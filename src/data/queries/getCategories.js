import CategoryType from '../types/CategoryType';
import { Categories } from '../../data/models';

import {
  GraphQLList as List,
} from 'graphql';

const getCategories = {

  type: new List(CategoryType),

  async resolve({ request }) {

    return await Categories.findAll();
    
  },
};

export default getCategories;
