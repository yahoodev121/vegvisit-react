import {
    GraphQLObjectType as ObjectType,
    GraphQLID as ID,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLList as List,
} from 'graphql';

import ReviewsType from '../../types/ReviewsType';

const ReviewsWholeType = new ObjectType({
    name: 'ReviewsWholeType',

    fields: {
        reviewsData: {
            type: new List(ReviewsType)
        },
        count: {
            type: IntType
        }
    },
});
export default ReviewsWholeType;
