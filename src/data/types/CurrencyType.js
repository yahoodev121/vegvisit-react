import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLList as List,
} from 'graphql';

const CurrencyType = new ObjectType({
  name: 'Currency',
  fields: {
    base: { type: StringType },
    date: { type: StringType },
    rates: { type: StringType },
    status: { type: StringType },
  },
});

export default CurrencyType;
