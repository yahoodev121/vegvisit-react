import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLInt as IntType,
} from 'graphql';

import CurrencyType from '../types/CurrencyType';

import { getCurrencyInformation } from './getCurrencyInformation';

const Currency = {

  type:  CurrencyType,

  async resolve({ request, response }) {
    return await getCurrencyInformation();
  },
};

export default Currency;


