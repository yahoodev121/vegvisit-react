import {
    GraphQLObjectType as ObjectType,
    GraphQLString as StringType,
    GraphQLInt as IntType,
} from 'graphql';

const AreaType = new ObjectType({
    name: 'Area',
    fields: {
        id: { type: IntType },
        name: { type: StringType },
    },
});

export default AreaType;
