import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLInt as IntType,
  GraphQLBoolean as BooleanType
} from 'graphql';
const UserType = new ObjectType({
  name: 'User',
  fields: {
    id: { type: new NonNull(ID) },
    email: { type: StringType },
    type: { type: StringType },
    status: { type: StringType },
    userBanStatus: { type: IntType },
    userStatus: { type: BooleanType },
    userExistStatus: { type: BooleanType }
  },
});
export default UserType;
