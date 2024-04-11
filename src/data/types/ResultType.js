import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
} from 'graphql';


const ResultType = new ObjectType({
  name: 'Result',
  fields: {
    count: { type: IntType },
    status: { type: StringType },
  },
});

export default ResultType;