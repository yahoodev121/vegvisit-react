import UserAccountType from '../types/userAccountType';
import { User, UserLogin, UserClaim, UserProfile, UserDiets } from '../../data/models';
import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';
const userAccount = {
  type: UserAccountType,
  async resolve({ request, response }) {
    if (request.user && request.user.admin != true) {
      //Collect from Logged-in User
      let loggedInId = request.user.id;
      let loggedInEmail = request.user.email;
      /*return await UserProfile.findOne({
        where: { userId: loggedInId }
      });*/
      // Get All User Profile Data
      const userProfile = await UserProfile.findOne({
        attributes: [
          'profileId',
          'firstName',
          'lastName',
          'displayName',
          'dateOfBirth',
          'gender',
          'phoneNumber',
          'preferredLanguage',
          'preferredCurrency',
          'location',
          'info',
          'createdAt',
          'picture',
          'countryCode',
          'country',
          'countryName',
          'lifestyle',
          'spokenLanguages',
          'funFacts',
          'hobbies',
          'books',
          'music',
          'movies',
          'quote',
          'school',
          'work',
          'companionAnimals',
          'foodCategory',
        ],
        where: { userId: request.user.id },
      });
      const userEmail = await User.findOne({
        attributes: [
          'email',
          'userBanStatus'
        ],
        where: { id: request.user.id }
      })
      const userDiets = await UserDiets.findAll({
        attributes: [
          'dietId',
        ],
        where: { userId: request.user.id }
      })
      let userDietsIds;
      if (userDiets && userDiets.length && userDiets.length > 0){
        userDietsIds = userDiets.map(userDiet => {
          return userDiet.dataValues.dietId;
        })
      }
      if (userProfile && userEmail) {
        return {
          userId: request.user.id,
          profileId: userProfile.dataValues.profileId,
          firstName: userProfile.dataValues.firstName,
          lastName: userProfile.dataValues.lastName,
          displayName: userProfile.dataValues.displayName,
          gender: userProfile.dataValues.gender,
          dateOfBirth: userProfile.dataValues.dateOfBirth,
          email: userEmail.email,
          userBanStatus: userEmail.userBanStatus,
          phoneNumber: userProfile.dataValues.phoneNumber,
          preferredLanguage: userProfile.dataValues.preferredLanguage,
          preferredCurrency: userProfile.dataValues.preferredCurrency,
          location: userProfile.dataValues.location,
          info: userProfile.dataValues.info,
          createdAt: userProfile.dataValues.createdAt,
          picture: userProfile.dataValues.picture,
          countryCode: userProfile.dataValues.countryCode,
          country: userProfile.dataValues.country,
          countryName: userProfile.dataValues.countryName,
          lifestyle: userProfile.dataValues.lifestyle,
          spokenLanguages: userProfile.dataValues.spokenLanguages,
          funFacts: userProfile.dataValues.funFacts,
          hobbies: userProfile.dataValues.hobbies,
          books: userProfile.dataValues.books,
          music: userProfile.dataValues.music,
          movies: userProfile.dataValues.movies,
          quote: userProfile.dataValues.quote,
          school: userProfile.dataValues.school,
          work: userProfile.dataValues.work,
          companionAnimals: userProfile.dataValues.companionAnimals,
          foodCategory: userProfile.dataValues.foodCategory,
          userDiets: userDietsIds,
          status: "success"
        }
      }
    } else {
      return {
        status: "notLoggedIn"
      }
    }
  },
};
export default userAccount;
