// GrpahQL
import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

import CancellationType from '../../types/CancellationType';
import {Cancellation} from '../../models';

const getAllCancellation = {

    type: new List(CancellationType),

    async resolve({request}) {
      	
      	return await Cancellation.findAll({ where: { isEnable: true }});

    }
};

export default getAllCancellation;

/**

query getAllCancellation{
  getAllCancellation {
    id
    policyName
    priorDays
    accommodationPriorCheckIn
    accommodationBeforeCheckIn
    accommodationDuringCheckIn
    guestFeePriorCheckIn
    guestFeeBeforeCheckIn
    guestFeeDuringCheckIn
    hostFeePriorCheckIn
    hostFeeBeforeCheckIn
    hostFeeDuringCheckIn
    isEnable
  }
}

**/