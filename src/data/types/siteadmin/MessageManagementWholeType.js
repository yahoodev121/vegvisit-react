import {
    GraphQLObjectType as ObjectType,
    GraphQLID as ID,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLList as List,
} from 'graphql';

import MessageManagementType from '../../types/siteadmin/MessageManagementType';
import ThreadsType from '../../types/ThreadsType';

const MessageManagementWholeType = new ObjectType({
    name: 'MessageManagementWholeType',

    fields: {
        usersData: {
            type: new List(ThreadsType)
        },
        count: {
            type: IntType
        }
    },
});
export default MessageManagementWholeType;
