import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
} from 'graphql';

const RetreatMealType = new ObjectType({
    name: 'RetreatMeal',
    fields: {
        id: { type: IntType },
        listingRetreatId: { type: IntType },
        mealId: { type: IntType },
    },
});

export default RetreatMealType;
