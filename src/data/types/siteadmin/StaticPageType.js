import {
    GraphQLObjectType as ObjectType,
    GraphQLID as ID,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType
} from 'graphql';

const StaticPageType = new ObjectType({
    name: 'StaticPageType',
    fields: {
        id: {
            type: IntType
        },
        pageName: {
            type: StringType
        },
        content: {
            type: StringType
        },
        createdAt: {
            type: StringType
        },
        metaTitle: {
            type: StringType
        },
        metaDescription: {
            type: StringType
        },
        status: {
            type: StringType
        }
    }
});

export default StaticPageType;