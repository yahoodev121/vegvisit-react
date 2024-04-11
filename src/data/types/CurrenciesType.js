import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLBoolean as BooleanType,
} from 'graphql';

const CurrenciesType = new ObjectType({
  name: 'Currencies',
  fields: {
    id: { type: IntType },
    symbol: { type: StringType },
    isEnable: { type: BooleanType },
    isPayment: { type: BooleanType },
    isBaseCurrency: { type: BooleanType },
    status: { type: StringType }
  },
});

export default CurrenciesType;
