import UserAccountType from '../../types/userAccountType';
import { UserProfile } from '../../models';
import logger from '../../../core/logger';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const AddPhoneNumber = {

  type: UserAccountType,

  args: {
    countryCode: { type: new NonNull(StringType) },
    phoneNumber: { type: new NonNull(StringType) },
  }, 

    async resolve({ request }, { countryCode, phoneNumber }) {

    // Check whether user is logged in
    if(request.user) {
        
        try {
          const phoneNumberUpdated = await UserProfile.update({
              countryCode,
              phoneNumber
          },{
              where: {
                  userId: request.user.id
              }
          });
  
          if(phoneNumberUpdated && phoneNumberUpdated[0] && phoneNumberUpdated[0] === 1) {
              logger.info(`data.mutations.SmsVerification.AddPhoneNumber.AddPhoneNumber: Updated phone number for ${request.user.id}) with result ${JSON.stringify(phoneNumberUpdated)}`);
              return {
                  status: '200',
                  countryCode,
                  phoneNumber
              };
          } else {
            logger.warn(`data.mutations.SmsVerification.AddPhoneNumber.AddPhoneNumber: Unexpected result when updating phone number for ${request.user.id}) with values countryCode: ${countryCode}, phoneNumber: ${phoneNumber}: ${JSON.stringify(phoneNumberUpdated)}. Request was ${JSON.stringify(request)}`);
              return {
                  status: '400'
              }
          }
        } catch (error) {
          logger.error(`data.mutations.SmsVerification.AddPhoneNumber.AddPhoneNumber: Error when updating phone number for ${request.user.id}) with values countryCode: ${countryCode}, phoneNumber: ${phoneNumber}: ${error.message}. Request was ${JSON.stringify(request)}`, error);
          return {
            status: "500"
          }
        }
      } else {
          logger.warn(`data.mutations.SmsVerification.AddPhoneNumber.AddPhoneNumber: Unauthenticated try to update phone number with values countryCode: ${countryCode}, phoneNumber: ${phoneNumber}. Request was ${JSON.stringify(request)}`);
          return {
            status: "notLoggedIn"
          };
      }
    },
};

export default AddPhoneNumber;

/**
mutation AddPhoneNumber($countryCode: String!, $phoneNumber: String!) {
    AddPhoneNumber(countryCode: $countryCode, phoneNumber: $phoneNumber) {
        status
    }
}
 */
