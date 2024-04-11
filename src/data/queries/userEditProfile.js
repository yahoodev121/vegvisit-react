// GrpahQL
import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import userEditProfileType from '../types/userEditProfileType';
import UserDietsType from '../types/UserDietsType';

// Sequelize models
import {
  User,
  UserLogin,
  UserClaim,
  UserProfile,
  AdminUser,
  EmailToken,
  UserDiets
} from '../../data/models';

import jwt from 'jsonwebtoken';
import { auth } from '../../config';

// Helper
import { capitalizeFirstLetter } from '../../helpers/capitalizeFirstLetter';

const userEditProfile = {

  type: userEditProfileType,

  args: {
    firstName: { type: StringType },
    lastName: { type: StringType },
    gender: { type: StringType },
    dateOfBirth: { type: StringType },
    email: { type: new NonNull(StringType) },
    // phoneNumber: { type: StringType },
    preferredLanguage: { type: StringType },
    preferredCurrency: { type: StringType },
    location: { type: StringType },
    info: { type: StringType },
    loggedinEmail: { type: StringType },
    // countryCode: { type: StringType },
    countryName: { type: StringType },
    lifestyle: { type: StringType },
    spokenLanguages: { type: StringType },
    funFacts: { type: StringType },
    hobbies: { type: StringType },
    books: { type: StringType },
    music: { type: StringType },
    movies: { type: StringType },
    quote: { type: StringType },
    school: { type: StringType },
    work: { type: StringType },
    companionAnimals: { type: StringType },
    foodCategory: { type: StringType },
    userDiets: { type: new List(IntType) },
  },

  async resolve({ request, response }, {
    firstName,
    lastName,
    gender,
    dateOfBirth,
    email,
    // phoneNumber,
    preferredLanguage,
    preferredCurrency,
    location,
    info,
    loggedinEmail,
    // countryCode,
    countryName,
    lifestyle,
    spokenLanguages,
    funFacts,
    hobbies,
    books,
    music,
    movies,
    quote,
    school,
    work,
    companionAnimals,
    foodCategory,
    userDiets
  }) {
    if (request.user && request.user.admin != true) {

      const isUserPhoneNumber = await UserProfile.findOne({
        where: {
          userId: request.user.id
        }
      });
      //Collect from Logged-in User
      let loggedInId = request.user.id;
      // let loggedInEmail = request.user.email;
      let updatedFirstName = capitalizeFirstLetter(firstName);
      let updatedLastName = capitalizeFirstLetter(lastName);
      let displayName = updatedFirstName + ' ' + updatedLastName;
      // let isPhoneNumber = phoneNumber ? phoneNumber : isUserPhoneNumber.phoneNumber;
      // let isCountryCode = countryCode ? countryCode : isUserPhoneNumber.countryCode;
      let isCountryName = countryName ? countryName : isUserPhoneNumber.countryName;

      // For Email Update
      if (loggedinEmail != email) {

        const getUserId = await User.findOne({
          where: { email: email },
        });

        // Email is already used by someone
        if (getUserId) {
          return {
            status: 'email'
          };
        } else {
          // Check email is used by admin users
          const getAdminUserId = await AdminUser.fifindOnend({
            where: { email: email },
          });

          if (getAdminUserId) {
            return {
              status: 'email'
            };
          }


          //Update email address for current user
          const updateEmail = User.update(
            {
              email: email,
            },
            {
              where: {
                id: request.user.id
              }
            }
          );



          // Email token

          // const getEmailToken = await EmailToken.findOne({
          //   where: { email: email },
          // });

          // if(!getEmailToken.email) {

          // }

          const expiresIn = 60 * 60 * 24 * 180; // 180 days
          const token = jwt.sign({ id: request.user.id, email: email }, auth.jwt.secret, { expiresIn });
          response.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
          const updateUserEmail = EmailToken.update(
            {
              email: email
            },
            {
              where: {
                userId: request.user.id
              }
            }
          );


          //If something went wrong in Updating email address
          if (!updateEmail) {
            return {
              status: 'failed'
            };
          }
        }
      }

      // Updating records on Current User's Profile
      const updateUser = UserProfile.update(
        {
          firstName: updatedFirstName,
          lastName: updatedLastName,
          displayName,
          gender,
          dateOfBirth,
          // phoneNumber: isPhoneNumber,
          preferredLanguage,
          preferredCurrency,
          location,
          info,
          countryName: isCountryName,
          // countryCode: isCountryCode,
          lifestyle,
          spokenLanguages,
          funFacts,
          hobbies,
          books,
          music,
          movies,
          quote,
          school,
          work,
          companionAnimals,
          foodCategory
        },
        {
          where: {
            userId: request.user.id
          }
        }
      );

      if (userDiets) {
          const removeUserDiets = await UserDiets.destroy({
              where: {
                  userId: request.user.id
              }
          });
          if (userDiets.length && userDiets.length > 0) {
              userDiets.map(async (item, key) => {
                if (item || item === 0) {
                  const updateUserDiets = await UserDiets.create({
                      userId: request.user.id,
                      dietId: item
                  })
                }
              });
          }
      }


      // If update successful, return email & no error
      if (updateUser) {
        return {
          status: "success",
        };

      } else {
        return {
          status: 'failed'
        };
      }

    } else {
      return {
        status: 'notLoggedIn'
      };
    }
  },
};

export default userEditProfile;
