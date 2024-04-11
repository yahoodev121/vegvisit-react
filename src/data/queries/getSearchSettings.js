import SearchSettingsType from '../types/SearchSettingsType';
import { SearchSettings } from '../../data/models';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLBoolean as BooleanType,
  GraphQLFloat as FloatType,
} from 'graphql';

const getSearchSettings = {

  type: SearchSettingsType,

  async resolve({ request }) { 

      return await SearchSettings.findOne();
  },
};

export default getSearchSettings;