import {
    GraphQLObjectType as ObjectType,
    GraphQLID as ID,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType
} from 'graphql';

const BlogDetailsType = new ObjectType({
    name: 'BlogDetailsType',
    fields: {
        id: {
            type: IntType
        },
        pageTitle: {
            type: StringType
        },
        metaTitle: {
            type: StringType
        },
        metaDescription: {
            type: StringType
        },
        pageUrl: {
            type: StringType
        },
        content: {
            type: StringType
        },
        isEnable: {
            type: BooleanType
        },
        createdAt: {
            type: StringType
        },
        footerCategory: {
            type: StringType
        },
        status: {
            type: StringType
        }
    }
});

export default BlogDetailsType;