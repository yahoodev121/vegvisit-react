import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLList as List,
} from 'graphql';

import ShowListingType from './ShowListingType';

const searchListingType = new ObjectType({
  name: 'SearchListing',
  fields: {
    count: { type: StringType },
    results: { type: new List(ShowListingType) },
    status: { type: StringType },
  },
});

export default searchListingType;