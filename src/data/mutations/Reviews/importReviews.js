import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLInt as IntType,
  GraphQLBoolean as BooleanType
} from 'graphql'

import { fork } from 'child_process'

import ResultType from '../../types/ResultType'

// Sequelize
import sequelize from '../../../data/sequelize'
import { Listing, Reviews } from '../../models'

import logger from '../../../core/logger'

import { getReviews } from './getReviews'

import { createChildProcessForReviewsImport } from '../../../config'

const importReviews = {
  type: ResultType,

  args: {
    url: { type: new NonNull(StringType) },
    listId: { type: new NonNull(IntType) },
    actionType: { type: new NonNull(StringType) }
  },

  async resolve ({ request, response }, { url, listId, actionType }) {
    // Check whether user is logged in
    if (request.user) {
      try {
        const userId = request.user.id
        logger.debug(
          `data.mutations.Reviews.importReviews.importReviews: Received request to ${actionType} reviews for User ${userId} and Listing ${listId} from ${url}.`
        )
        // Parameters validation
        try {
          if (!['add', 'update'].includes(actionType)) {
            throw new Error(`Unknown action type: ${actionType}`)
          }
          if (
            !url.match(
              /https?:\/\/[A-Za-z]+\.airbnb(\.[A-Za-z]+){1,2}\/rooms\/[0-9]+\/reviews$/
            )
          ) {
            throw new Error(`Invalid airbnb reviews import url: ${url}`)
          }
        } catch (error) {
          logger.error(
            `data.mutations.Reviews.importReviews.importReviews: Bad parameters error when trying to ${actionType} reviews for User ${request.user.id} and Listing ${listId} from ${url}: ${error.message}`,
            error
          )
          return {
            status: '400'
          }
        }

        let reviews
        if (createChildProcessForReviewsImport) {
          const readReviewsPromise = new Promise((resolve, reject) => {
            logger.debug(
              `data.mutations.Reviews.importReviews.importReviews: Forking now for reviews import: ${__dirname}/getReviews`
            )
            // TODO: Once migrated to Nodejs >= 15 we could use the AbortController to stop the child process,
            // see: https://nodejs.org/dist/latest-v16.x/docs/api/child_process.html#child_processforkmodulepath-args-options
            // instead of child.kill(), see below
            const child = fork(__dirname + '/getReviews')
            child.on('message', reviews => {
              if (reviews.error) {
                logger.warn(
                  `data.mutations.Reviews.importReviews.importReviews: Received an error notification from the reviews import process: ${JSON.stringify(
                    reviews
                  )}`
                )
                reject(new Error(reviews.error))
              } else {
                logger.debug(
                  `data.mutations.Reviews.importReviews.importReviews: Received reviews from forked process: ${JSON.stringify(
                    reviews
                  )}`
                );
                child.kill('SIGINT');
                resolve(reviews);
              }
            })
            child.on("error", (err) => {
                child.kill('SIGINT');
                logger.error(
                  `data.mutations.Reviews.importReviews.importReviews: Received an error from the reviews import process: ${err.message}`,
                  err
                )
            });
            child.on('exit', (code, signal) => {
              logger.info(
                `data.mutations.Reviews.importReviews.importReviews: Forked reviews import process exited. Signal received was ${signal}. Exit code was ${code}.`
              )
            });
            
            child.send(url)
          })
          reviews = await readReviewsPromise
        } else {
          logger.debug(
            `data.mutations.Reviews.importReviews.importReviews: Starting reviews import in main process: ${__filename}`
          )
          reviews = await getReviews(url)
        }
        logger.info(
          `data.mutations.Reviews.importReviews.importReviews: Found ${reviews &&
            reviews.length} reviews for User ${userId} and Listing ${listId} from ${url}: ${JSON.stringify(
            reviews
          )}`
        )

        let createdReviews
        let count = 0
        if (reviews && reviews.length > 0) {
          const reviewObjects = reviews.map(review => {
            return {
              reservationId: 0,
              listId,
              authorId: '00001',
              userId,
              reviewContent: review.reviewText,
              rating: review.rating,
              importUserName: review.reviewAuthor,
              importUrl: url,
              importDateInfo: review.reviewDate
            }
          })

          createdReviews = await sequelize.transaction(async t => {
            if (actionType === 'update') {
              const removeReviews = await Reviews.destroy({
                where: {
                  listId,
                  importUrl: url
                },
                transaction: t
              })
              logger.info(
                `data.mutations.Reviews.importReviews.importReviews: Deleted ${removeReviews} reviews for User ${userId} and Listing ${listId} with url ${url} since action type was "${actionType}". Reviews will be reimported now.`
              )
            }
            const reviews = await Reviews.bulkCreate(reviewObjects, {
              returning: true,
              transaction: t
            })

            logger.info(
              `data.mutations.Reviews.importReviews.importReviews: Imported reviews for User ${userId} and Listing ${listId} from ${url} with result: ${JSON.stringify(
                reviews
              )}`
            )

            const numReviews = await Reviews.count({
              where: {
                listId,
                userId
              },
              transaction: t
            })

            const reviewsStarRating = await Reviews.sum('rating', {
              where: {
                listId,
                userId
              },
              transaction: t
            })

            const reviewsCount = Number(reviewsStarRating / numReviews)

            const listings = await Listing.update(
              {
                reviewsImportUrlAirbnb: url,
                lastReviewsImportAirbnb: new Date(),
                reviewsCount: reviewsCount
              },
              {
                where: {
                  id: listId,
                  userId
                },
                transaction: t
              }
            )

            if (!(listings && listings.length === 1 && listings[0] === 1)) {
              throw new Error(
                `The listing could not be updated correctly for the reviews import for User ${userId} and Listing ${listId} with import url ${url}. Result was: ${JSON.stringify(
                  listings
                )}`
              )
            }

            logger.info(
              `data.mutations.Reviews.importReviews.importReviews: Updated listing for User ${userId} and Listing ${listId} with import url ${url} and reviewsCount value ${reviewsCount}. Result: ${JSON.stringify(
                listings
              )}`
            )

            return reviews
          })

          count =
            createdReviews && createdReviews.length ? createdReviews.length : 0

          logger.debug(
            `data.mutations.Reviews.importReviews.importReviews: Transaction success: Imported ${count} reviews for User ${userId} and Listing ${listId} from ${url}`
          )
          return {
            count,
            status: '201'
          }
        } else {
          logger.debug(
            `data.mutations.Reviews.importReviews.importReviews: No reviews were found. The database was not updated.`
          )
          return {
            count,
            status: '200'
          }
        }
      } catch (error) {
        logger.error(
          `data.mutations.Reviews.importReviews.importReviews: Error when trying to ${actionType} reviews for User ${request.user.id} and Listing ${listId} from ${url}: ${error.message}`,
          error
        )
        return {
          status: '500'
        }
      }
    } else {
      return {
        status: 'Not loggedIn'
      }
    }
  }
}

export default importReviews

/*

mutation ImportReviews(
    $url: String!,
    $listId: Int!,
){
    ImportReviews(
        url: $url,
        listId: $listId
    ) {
        status
        count
    }
}

*/
