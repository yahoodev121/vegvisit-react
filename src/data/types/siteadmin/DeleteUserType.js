import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLBoolean as BooleanType,
  GraphQLNonNull as NonNull,
  GraphQLList as List,
} from 'graphql';

const DeleteUserType = new ObjectType({
  name: 'DeleteUser',
  fields: {
    userId: { type: new NonNull(StringType) },
    status: { type: StringType },
  },
});

export default DeleteUserType;
