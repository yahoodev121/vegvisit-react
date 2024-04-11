import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLBoolean as BooleanType,
    GraphQLInt as IntType,
    GraphQLFloat as FloatType,
    GraphQLNonNull as NonNull,
    GraphQLList as List,
} from 'graphql';

const PopularLocationType = new ObjectType({
    name: 'PopularLocationListing',
    fields: {
        id: { type: IntType },
        location: { type: StringType },
        locationAddress: { type: StringType },
        image: { type: StringType },
        isEnable: { type: StringType },
        createdAt: { type: StringType },
        updatedAt: { type: StringType },
        status: { type: StringType }
    },
});

export default PopularLocationType;