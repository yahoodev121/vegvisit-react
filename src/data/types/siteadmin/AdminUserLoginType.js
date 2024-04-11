import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const AdminUserLoginType = new ObjectType({
  name: 'adminUserLogin',
  fields: {
    email: { type: StringType },
    password: { type: StringType },
    status: {type: StringType},
  },
});

export default AdminUserLoginType;
