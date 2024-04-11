import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
} from 'graphql';

const MealType = new ObjectType({
    name: 'Meal',
    fields: {
        id: { type: IntType },
        mealType: { type: StringType },
        mealIcon: { type: StringType },
    },
});

export default MealType;
