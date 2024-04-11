import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLFloat as FloatType,
  GraphQLList as List,
} from 'graphql';

const SearchSettingsType = new ObjectType({
  name: 'SearchSettingsType',
  fields: {
    id: { type: IntType },
    minPrice: { type: FloatType },
    maxPrice: { type: FloatType },
    priceRangeCurrency: { type: StringType },
    status: { type: StringType }
  },
});

export default SearchSettingsType;