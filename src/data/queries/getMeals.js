import MealType from '../types/MealType';
import { Meals } from '../models';

import {
  GraphQLList as List,
} from 'graphql';

const getMeals = {

  type: new List(MealType),

  async resolve({ request }) {

    return await Meals.findAll();

  },
};

export default getMeals;
