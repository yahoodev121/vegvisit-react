import puppeteer from 'puppeteer'
import logger from '../../../core/logger'
import isValidNumber from '../../../helpers/isValidNumber'
import { willRunAsRoot } from '../../../config'

process.on('message', async url => {
  if (url) {
    try {
      logger.debug(
        `data.mutations.Reviews.getReviews.process.on('message'): Starting to read reviews in child process from URL: ${url}`
      )
      let reviews = await getReviews(url);
      logger.debug(
        `data.mutations.Reviews.getReviews.process.on('message'): Reviews result: ${JSON.stringify(
          reviews
        )}`
      )
      process.send(reviews);
      process.exitCode = 0;
      setTimeout(() => {
        process.exit(0);
      }, 20000);
    } catch (error) {
      logger.error(
        `data.mutations.Reviews.getReviews.process.on('message'): Error processing getReviews request for ${url}: ${error.message}`,
        error
      )
      process.send({
        error: error.message
      })
      process.exit(1);
    }
  } else {
    process.exit(2);
  }
})

async function getCount (page, selector) {
  return await page.$$eval(selector, a => a.length)
}

async function scrollDown (page, selector) {
  await page.$$eval(selector, elements => {
    if (elements && elements.length && elements.length > 1) {
      lastElementLoaded = elements[elements.length - 1]
      lastElementLoaded.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'end'
      })
    }
  })
}

async function scrollDownForAllElements (page, selector) {
  const delay = 2000
  let preCount = 0
  let postCount = 0
  do {
    preCount = await getCount(page, selector)
    await scrollDown(page, selector)
    await page.waitForTimeout(delay)
    postCount = await getCount(page, selector)
  } while (postCount > preCount)
  await page.waitForTimeout(delay)
  return postCount
}

async function getAverageRating (page, ratingSelector) {
  const ratingText = await page.$eval(ratingSelector, ratingElement => {
    return ratingElement.childNodes[1].textContent
  })
  let rating
  if (ratingText) {
    const ratingNumberText = ratingText.substr(0, ratingText.indexOf(' ·'))
    if (ratingNumberText) {
      const ratingNumber = parseFloat(ratingNumberText.replace(',', '.'))
      if (isValidNumber(ratingNumber)) {
        rating = ratingNumber
      }
    }
  }
  return rating
}

async function getReviewElements (
  page,
  reviewsSelector,
  reviewMetadataSelector,
  reviewDateSelector,
  reviewMetadataMainDivSelector,
  reviewTextSelector
) {
  const reviewElements = await page.$$(reviewsSelector)
  let reviews = []
  const excludePattern = 'This is an automated posting.'
  for (const reviewElement of reviewElements) {
    let review = {}
    // By using $eval we only get the first element of a review, by that excluding any answer to the review from the host
    // If we want to include answers, then we have to use $$eval but also make sure the right author and user is then used
    review.reviewAuthor = await reviewElement
      .$eval(reviewMetadataSelector, 
        (node) => {
          return node.childNodes[0].innerText;
        })
      .catch(error => {
        return ''
      })
    review.reviewDate = await reviewElement
      .$eval(
        `${reviewMetadataSelector} ${reviewDateSelector}`,
        (node) => {
          return node.innerText;
        }
      )
      .catch(error => {
        return ''
      })
    review.reviewText = await reviewElement
      .$eval(reviewTextSelector,
      (node) => {
        return node.innerText;
      })
      .catch(error => {
        return ''
      })
    logger.debug(
      `data.mutations.Reviews.getReviews.getReviewElements: Evaluated review element: ${JSON.stringify(
        review
      )}`
    )
    if (
      review.reviewAuthor &&
      review.reviewText &&
      !review.reviewText.endsWith(excludePattern)
    ) {
      reviews.push(review)
    }
  }
  return reviews
}

export async function getReviews (url) {
  let browser
  if (willRunAsRoot) {
    browser = await puppeteer.launch({
      args: ['--no-sandbox']
    })
  } else {
    browser = await puppeteer.launch()
  }
  const page = await browser.newPage()
  await page.goto(url)
  const ratingSelector = '[data-testid="modal-container"] h2.hpipapi div._19wpxkk' // Heading with average rating and number of reviews
  const reviewsSelector = '[data-review-id]'
  const reviewMetadataMainDivSelector = '.chnzxuf' // Main div including photo
  const reviewMetadataSelector = '.t9gtck5' // Excluding photo, i.e. name and date
  const reviewDateSelector = '._1f1oir5'
  const reviewTextSelector = '.ll4r2nl' // Review Text

  await page.waitForSelector(reviewsSelector)

  let rating = await getAverageRating(page, ratingSelector)

  // Apply default rating in case
  if (rating === null || rating === undefined || !isValidNumber(rating)) {
    rating = 5
    logger.debug(
      `data.mutations.Reviews.getReviews.getReviews: The dafault rating of ${rating} is used for the import of ratings from page ${url}.`
    )
  } else {
    logger.debug(
      `data.mutations.Reviews.getReviews.getReviews: An average rating of ${rating} was found on page ${url}.`
    )
  }

  //Scroll until all review elements are loaded
  let postCount = await scrollDownForAllElements(page, reviewsSelector)
  logger.debug(
    `data.mutations.Reviews.getReviews.getReviews: After scrolling to end of page there are ${postCount} reviews on page ${url}.`
  )

  let reviews = await getReviewElements(
    page,
    reviewsSelector,
    reviewMetadataSelector,
    reviewDateSelector,
    reviewMetadataMainDivSelector,
    reviewTextSelector
  )

  // Use average rating for each individual review since we don't have the individual rating
  reviews.map(review => {
    review.rating = rating
  })

  await browser.close()
  return reviews
}
