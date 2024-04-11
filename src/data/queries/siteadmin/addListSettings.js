import ListSettingsType from '../../types/siteadmin/AdminListSettingsType';
import { ListSettings } from '../../../data/models';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLObjectType as ObjectType,
  GraphQLBoolean as BooleanType,
} from 'graphql';

const addListSettings = {

  type: ListSettingsType,

  args: {
    typeId: { type: IntType },
    itemName: { type: StringType },
    itemDescription: { type: StringType },
    otherItemName: { type: StringType },
    maximum: { type: IntType },
    minimum: { type: IntType },
    startValue: { type: IntType },
    endValue: { type: IntType },
    isEnable: { type: StringType },
  },

  async resolve({ request }, {
    typeId,
    itemName,
    itemDescription,
    otherItemName,
    maximum,
    minimum,
    startValue,
    endValue,
    isEnable
   }) {

    if(request.user && request.user.admin == true) {

      const insertListSettings = await ListSettings.create({
        typeId: typeId,
        itemName: itemName,
        itemDescription: itemDescription,
        otherItemName: otherItemName,
        maximum: maximum,
        minimum: minimum,
        startValue: startValue,
        endValue: endValue,
        isEnable: isEnable
      })

      return {
        status: 'success'
      }
     } else {
         return {
           status: 'failed'
         }
     }
  },
};

export default addListSettings;
