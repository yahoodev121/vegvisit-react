import {
    GraphQLObjectType as ObjectType,
    GraphQLID as ID,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLList as List,
} from 'graphql';
import UserManagementType from '../../types/siteadmin/UserManagementType';
const UserManagementWholeDataType = new ObjectType({
    name: 'UserManagementWholeDataType',
    description: "This represent user data for admin management",
    fields: {
        usersData: {
            type: new List(UserManagementType)
        },
        count: {
            type: IntType
        }
    },
});
export default UserManagementWholeDataType;
