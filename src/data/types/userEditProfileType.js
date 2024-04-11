import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLInt as IntType,
  GraphQLList as List
} from 'graphql';

import UserDietsType from './UserDietsType'

const UserEditProfile = new ObjectType({
  name: 'userEditProfile',
  fields: {
    firstName: { type: StringType },
    lastName: { type: StringType },
    gender: { type: StringType },
    dateOfBirth: { type: StringType },
    email: { type: new NonNull(StringType) },
    phoneNumber: { type: StringType },
    preferredLanguage: { type: StringType },
    preferredCurrency: { type: StringType },
    location: { type: StringType },
    info: { type: StringType },
    status: {type: StringType},
    country: { type: IntType },
    verificationCode: { type: IntType },
    countryName: { type: StringType },
    countryCode: { type: StringType },
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
  },
});

export default UserEditProfile;
