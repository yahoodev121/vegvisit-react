import {
    GraphQLObjectType as ObjectType,
    GraphQLID as ID,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLList as List,
} from 'graphql';

import ReportUserType from '../../types/ReportUserType';

const ReportUserWholeType = new ObjectType({
    name: 'ReportUserWholeType',

    fields: {
        reportsData: {
            type: new List(ReportUserType)
        },
        count: {
            type: IntType
        }
    },
});
export default ReportUserWholeType;
