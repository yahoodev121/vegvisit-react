import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLList as List,
} from 'graphql';

import ReviewsType from './ReviewsType';
import ProfileType from './ProfileType';
import UserType from './UserType';

import UserVerifiedInfoType from './UserVerifiedInfoType';
import UserDietsType from './UserDietsType';

import {Reviews, User, UserVerifiedInfo} from '../models';

const ShowUserProfileType = new ObjectType({
  name: 'ShowUserProfile',
  fields: {
    userId: { type: StringType },
    profileId: { type: IntType },
    firstName: { type: StringType },
    lastName: { type: StringType },
    gender: { type: StringType },
    dateOfBirth: { type: StringType },
    phoneNumber: { type: StringType },
    preferredLanguage: { type: StringType },
    preferredCurrency: { type: StringType },
    location: { type: StringType },
    info: { type: StringType },
    createdAt: { type: StringType },
    picture:  { type: StringType },
    country:  { type: StringType },
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
    userDiets: {
      type: new List(UserDietsType),
      resolve(profile) {
        return profile.getUserDiets();
      },
    },
    profileBanStatus: {
      type: UserType,
      async resolve(profile) {
        return User.findOne({
          where: { 
            id: profile.userId
           }
        });
      }
    },
    userVerifiedInfo: {
      type: UserVerifiedInfoType,
      async resolve(profile) {
        return UserVerifiedInfo.findOne({
          where: { 
            userId: profile.userId
           }
        });
      }
    },
    reviewsCount: {
      type: IntType,
      async resolve(profile) {
        return await Reviews.count({
          where: {
            userId: profile.userId
          }
        });
      }
    },
    userData: {
      type: ProfileType,
      resolve(reviews) {
        return UserProfile.findOne({
          where: { profileId: reviews.profileId }
        });
      }
    },
    reviews: {
      type: new List(ReviewsType),
      async resolve(profile) {
        return await Reviews.findAll({
          where: {
            userId: profile.userId,
            isAdminEnable: true
          },
          limit: 3
        });
      }
    },
  },
});

export default ShowUserProfileType;
