import LanguageType from '../types/LanguageType';
import { Languages } from '../models';

import {
  GraphQLList as List,
} from 'graphql';

const getLanguages = {

  type: new List(LanguageType),

  async resolve({ request }) {

    return await Languages.findAll();

  },
};

export default getLanguages;
