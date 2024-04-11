import CurrenciesType from '../types/CurrenciesType';
import { Currencies } from '../../data/models';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const getBaseCurrency = {

  type: CurrenciesType,

  async resolve({ request }) {

    return await Currencies.findOne({
      where: {
        isBaseCurrency: true
      }
    });
    
  },
};

export default getBaseCurrency;
