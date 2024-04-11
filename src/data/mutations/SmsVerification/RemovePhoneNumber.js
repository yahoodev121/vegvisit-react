import UserAccountType from '../../types/userAccountType';
import { UserProfile, UserVerifiedInfo } from '../../models';
import logger from '../../../core/logger';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const RemovePhoneNumber = {

  type: UserAccountType,

  args: {
  }, 

    async resolve({ request }) {

    // Check whether user is logged in
    if(request.user) {
        try {
  
              const isValidUser = await UserProfile.count({
                  where: {
                      userId: request.user.id,
                  }
              });
  
              if (isValidUser) {
                  const phoneNumberRemoved = await UserProfile.update({
                      countryCode: null,
                      phoneNumber: null,
                      countryName: null,
                      verificationCode: null
                  }, {
                          where: {
                              userId: request.user.id
                          }
                  });
  
                  const updatePhoneVerified = await UserVerifiedInfo.update({
                      isPhoneVerified: false
                  }, {
                          where: {
                              userId: request.user.id
                          }
                  });
  
                  if (phoneNumberRemoved && phoneNumberRemoved[0] && phoneNumberRemoved[0] === 1) {
                      logger.info(`data.mutations.SmsVerification.RemovePhoneNumber.RemovePhoneNumber: Updated UserVerifiedInfo for ${request.user.id} with result ${JSON.stringify(updatePhoneVerified)}`);
                      return {
                          status: '200'
                      };
                  } else {
                      logger.warn(`data.mutations.SmsVerification.RemovePhoneNumber.RemovePhoneNumber: Unexpected result when updating UserVerifiedInfo for ${request.user.id}: ${JSON.stringify(updatePhoneVerified)}`);
                      return {
                          status: '400'
                      }
                  }
  
              } else {
                  logger.warn(`data.mutations.SmsVerification.RemovePhoneNumber.RemovePhoneNumber: Invalid user (${request.user.id}) when trying to remove phone number: Result was ${isValidUser}. Request was ${JSON.stringify(request)}`);
                  return {
                      status: '401'
                  }
              }
        } catch (error) {
          logger.error(`data.mutations.SmsVerification.RemovePhoneNumber.RemovePhoneNumber: Error when removing phone number: ${error.message}. Request was ${JSON.stringify(request)}`, error);
        }
      } else {
          logger.warn(`data.mutations.SmsVerification.RemovePhoneNumber.RemovePhoneNumber: Unauthenticated attempt to remove phone number: Result was ${isValidUser}. Request was ${JSON.stringify(request)}`);
          return {
            status: "notLoggedIn"
          };
      }
    },
};

export default RemovePhoneNumber;

/**
mutation {
    RemovePhoneNumber {
        status
    }
}
 */
