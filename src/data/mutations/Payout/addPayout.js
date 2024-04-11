// GrpahQL
import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

import PayoutType from '../../types/PayoutType';

// Sequelize models
import { Payout } from '../../models';

const addPayout = {

  type: PayoutType,

  args: {
    methodId: { type: new NonNull(IntType)},
    payEmail: { type: new NonNull(StringType)},
    address1: { type: StringType },
    address2: { type: StringType },
    city: { type: StringType },
    state: { type: StringType },
    country: { type: new NonNull(StringType) },
    zipcode: { type: StringType },
    currency: { type: new NonNull(StringType) },
    last4Digits: { type: IntType }
  },

  async resolve({ request, response }, {
    methodId,
    payEmail,
    address1,
    address2,
    city,
    state,
    country,
    zipcode,
    currency,
    last4Digits
  }) {

    // Check if user already logged in
    if(request.user && !request.user.admin) {

        const userId = request.user.id;
        let defaultvalue = false;

        let count = await Payout.count({ where: {
          userId,
          default: true
        }});

        if(count <= 0){
          defaultvalue = true;
        }
        const payout = await Payout.create({
          methodId,
          userId,
          payEmail,
          address1,
          address2,
          city,
          state,
          country,
          zipcode,
          currency,
          default: defaultvalue,
          last4Digits
        });

        if(payout) {
          return payout;
        } else {
          return {
            status: 'failed to create a payout'
          }
        }
    } else {
        return {
          status: "notLoggedIn",
        };
    }
  },
};

export default addPayout;

/**
mutation addPayout(
  $methodId: Int!, 
  $payEmail: String!,
  $address1: String,
  $address2: String,
  $city: String!,
  $state: String!,
  $country: String!,
  $zipcode: String!,
  $currency: String!,
){
    addPayout(
      methodId: $methodId,
      payEmail: $payEmail,
      address1: $address1,
      address2: $address2,
      city: $city,
      state: $state,
      country: $country,
      zipcode: $zipcode,
      currency: $currency,
    ) {
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
