import {
    GraphQLObjectType as ObjectType,
    GraphQLID as ID,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType
} from 'graphql';

const RecommendType = new ObjectType({
    name: 'Recommend',
    fields: {
        id: {
            type: IntType
        },
        listId: {
            type: IntType
        },
        status: {
            type: StringType
        }
    }
});

export default RecommendType;