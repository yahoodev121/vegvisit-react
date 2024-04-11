import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLList as List
} from 'graphql';
import UserVerifiedInfoType from './UserVerifiedInfoType';
import UserType from './UserType';
import UserDietsType from './UserDietsType';
import { UserVerifiedInfo, User } from '../models';
const UserAccountType = new ObjectType({
  name: 'UserAccount',
  fields: {
    userId: { type: new NonNull(ID) },
    profileId: { type: new NonNull(IntType) },
    firstName: { type: StringType },
    lastName: { type: StringType },
    displayName: { type: StringType },
    gender: { type: StringType },
    dateOfBirth: { type: StringType },
    email: { type: StringType },
    userBanStatus: { type: IntType },
    phoneNumber: { type: StringType },
    preferredLanguage: { type: StringType },
    preferredCurrency: { type: StringType },
    location: { type: StringType },
    info: { type: StringType },
    createdAt: { type: StringType },
    status: { type: StringType },
    picture: { type: StringType },
    verification: {
      type: UserVerifiedInfoType,
      async resolve(userProfile) {
        return await UserVerifiedInfo.findOne({ where: { userId: userProfile.userId } });
      }
    },
    userData: {
      type: UserType,
      async resolve(userProfile) {
        return await User.findOne({ where: { id: userProfile.userId } });
      }
    },
    country: { type: IntType },
    verificationCode: { type: IntType },
    countryCode: { type: StringType },
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
    userDiets: {
      type: new List(IntType),
    }
  },
});
export default UserAccountType;
