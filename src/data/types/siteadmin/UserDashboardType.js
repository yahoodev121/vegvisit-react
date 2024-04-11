import {
    GraphQLObjectType as ObjectType,
    GraphQLID as ID,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType
} from 'graphql';

const UserDashboardType = new ObjectType({
    name: 'UserDashboard',
    fields: {
        totalCount: {
            type: IntType
        },
        todayCount: {
            type: IntType
        },
        monthCount: {
            type: IntType
        },
        status: {
            type: StringType
        }
    }
});

export default UserDashboardType;