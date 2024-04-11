import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLFloat as FloatType,
  GraphQLInt as IntType,
} from 'graphql';

const LocationItemType = new ObjectType({
  name: 'LocationItem',
  fields: {
    address: { type: StringType },
    street: { type: StringType },
    country: { type: StringType },
    city: { type: StringType },
    state: { type: StringType },
    zipcode: { type: StringType },
    lat: { type: FloatType },
    lng: { type: FloatType },
    timeZone: { type:StringType },
    status: { type: IntType}
  },
});

export default LocationItemType;
