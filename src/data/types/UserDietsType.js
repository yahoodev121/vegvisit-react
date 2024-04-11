import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLBoolean as BooleanType
} from 'graphql';

import DietType from './DietType'

const UserDietsType = new ObjectType({
  name: 'UserDiets',
  fields: {
      id: {
          type: IntType
      },
      userId: {
          type: IntType
      },
      dietId: {
          type: IntType
      },
      diet: {
          type: DietType,
          resolve(userDiets) {
              return userDiets.getDiet();
          }
      },
  }
});

export default UserDietsType;