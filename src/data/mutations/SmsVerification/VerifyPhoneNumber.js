import UserAccountType from '../../types/userAccountType';
import { UserProfile, UserVerifiedInfo } from '../../models';
import logger from '../../../core/logger';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const VerifyPhoneNumber = {

  type: UserAccountType,

  args: {
      verificationCode: { type: new NonNull(IntType) }
  }, 

    async resolve({ request }, { verificationCode }) {

    // Check whether user is logged in
    if(request.user) {
        try {
          
          const isValidCode = await UserProfile.count({
              where: {
                  userId: request.user.id,
                  verificationCode
              }
          });
  
          if (isValidCode) {
  
              const updatePhoneVerified = await UserVerifiedInfo.update({
                  isPhoneVerified: true
              }, {
                      where: {
                          userId: request.user.id
                      }
              });
  
              if (updatePhoneVerified && updatePhoneVerified[0] && updatePhoneVerified[0] === 1) {
                  logger.info(`data.mutations.SmsVerification.VerifyPhoneNumber.VerifyPhoneNumber: Updated UserVerifiedInfo for ${request.user.id} with result ${JSON.stringify(updatePhoneVerified)}`);
                  return {
                      status: '200'
                  };
              } else {
                  logger.warn(`data.mutations.SmsVerification.VerifyPhoneNumber.VerifyPhoneNumber: Unexpected result when updating UserVerifiedInfo for ${request.user.id}: ${JSON.stringify(updatePhoneVerified)}`);
                  return {
                      status: '400'
                  };
              }
              
          } else {
              logger.warn(`data.mutations.SmsVerification.VerifyPhoneNumber.VerifyPhoneNumber: No valid code for user ${request.user.id} and verificationCode ${verificationCode}: Query result for valid code was ${JSON.stringify(isValidCode)}`);
              return {
                  status: '400'
              }
          }
        } catch (error) {
          logger.error(`data.mutations.SmsVerification.VerifyPhoneNumber.VerifyPhoneNumber: Error when verifying phone number for ${request.user.id}: ${error.message}`, error);
          return {
            status: '500'
          }
        }
      } else {
          logger.warn(`data.mutations.SmsVerification.VerifyPhoneNumber.VerifyPhoneNumber: Unauthenticated try to verifying phone number with values verificationCode: ${verificationCode}. Request was ${JSON.stringify(request)}`);
          return {
            status: "notLoggedIn"
          };
      }
    },
};

export default VerifyPhoneNumber;

/**
mutation VerifyPhoneNumber($verificationCode: Int!) {
    VerifyPhoneNumber(verificationCode: $verificationCode) {
        status
    }
}
 */
