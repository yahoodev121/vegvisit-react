import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLBoolean as BooleanType,
  GraphQLInt as IntType,
  GraphQLFloat as FloatType,
  GraphQLNonNull as NonNull,
  GraphQLList as List,
} from 'graphql';

const ListBlockedDatesType = new ObjectType({
  name: 'ListBlockedDates',
  fields: {
    id: { type: IntType },
    listId: { type: IntType },
    reservationId: { type: IntType },
    calendarId: { type: IntType },
    blockedDates: { type: StringType },
    status: { type: StringType },
    calendarStatus: { type: StringType },
    isSpecialPrice: { type: FloatType }
  }
});

export default ListBlockedDatesType;
