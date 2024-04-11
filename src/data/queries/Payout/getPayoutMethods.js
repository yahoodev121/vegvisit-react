import PaymentMethodsType from '../../types/PaymentMethodsType';
import {PaymentMethods} from '../../models';

import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType
} from 'graphql';

const getPayoutMethods = {

    type: new List(PaymentMethodsType),

    async resolve({request}, {listId}) {
        if(request.user && !request.user.admin) {
            return await PaymentMethods.findAll({
              where: { isPayoutMethod: true}
            });
        } else {
            return {
              status: "notLoggedIn",
            };
        }
    }
};

export default getPayoutMethods;