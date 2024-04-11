import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
} from 'graphql';

const LanguageType = new ObjectType({
    name: 'Language',
    fields: {
        id: { type: IntType },
        name: { type: StringType },
    },
});

export default LanguageType;
