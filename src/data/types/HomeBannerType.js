import {
    GraphQLObjectType as ObjectType,
    GraphQLID as ID,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType
} from 'graphql';

const HomeBannerType = new ObjectType({
    name: 'HomeBanner',
    fields: {
        id: {
            type: IntType
        },
        name: {
            type: StringType
        },
        enable: {
            type: IntType
        },
        status: {
            type: StringType
        }
    }
});

export default HomeBannerType;