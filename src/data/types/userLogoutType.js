import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const UserLogout = new ObjectType({
  name: 'userLogout',
  fields: {
    status: {type: StringType},
  },
});

export default UserLogout;
