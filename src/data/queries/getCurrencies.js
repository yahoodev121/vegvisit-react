import CurrenciesType from '../types/CurrenciesType';
import { Currencies } from '../../data/models';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const getCurrencies = {

  type: new List(CurrenciesType),

  async resolve({ request }) {

    return await Currencies.findAll({
      order: [
        ['isBaseCurrency','DESC'],
      ]
    });
    
  },
};

export default getCurrencies;
