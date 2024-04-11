import {
  GraphQLObjectType as ObjectType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const DaysUntilCheckInType = new ObjectType({
  name: 'DaysUntilCheckIn',
  fields: {
    daysUntilCheckInGuestThreshold: { type: new NonNull(IntType) },
    daysUntilCheckInHostThreshold: { type: new NonNull(IntType) },
  },
});

export default DaysUntilCheckInType;