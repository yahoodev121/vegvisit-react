import AreaType from '../types/AreaType';
import { Areas } from '../models';

import {
  GraphQLList as List,
} from 'graphql';

const getAreas = {

  type: new List(AreaType),

  async resolve({ request }) {

    return await Areas.findAll();

  },
};

export default getAreas;
