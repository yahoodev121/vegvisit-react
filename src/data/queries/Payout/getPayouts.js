import PayoutType from '../../types/PayoutType';
import {Payout} from '../../models';

import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType
} from 'graphql';

const getPayouts = {

    type: new List(PayoutType),

    async resolve({request}, {listId}) {
        if(request.user && !request.user.admin) {
            const userId = request.user.id;

            return await Payout.findAll({
                where: {
                    userId
                }
            });
        } else {
            return {
              status: "notLoggedIn",
            };
        }
    }
};

export default getPayouts;

/**

query getPayouts {
  getPayouts {
    id
    methodId
    userId
    payEmail
    address1
    address2
    city
    state
    country
    zipcode
    currency
    createdAt
    status
  }
}

**/