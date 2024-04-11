import PaymentType from '../types/PaymentType';
import { PaymentSettings } from '../../data/models';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLBoolean as BooleanType,
} from 'graphql';

const getPaymentInfo = {

  type: PaymentType,

  args: {
    id: { type: IntType }
  },

  async resolve({ request }, { id }) {

    if(request.user) {

        return await PaymentSettings.findOne({
            where:{
                id: id
            }
        });

    } else {
        return {
            status: "failed"
        }
    }
  },
};

export default getPaymentInfo;