import AdminUserLoginType from '../../types/siteadmin/AdminUserLoginType';
import { AdminUser } from '../../models';
import logger from '../../../core/logger';

import {
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const changeAdminUser = {

  type: AdminUserLoginType,

  args: {
    email: { type: StringType },
    password: { type: new NonNull(StringType) }
  },

  async resolve({ request }, { email, password }) {

    if(request.user && request.user.admin) {
      try {
        const userId = request.user.id;
        let adminEmail = request.user.email;
        if(email) {
          adminEmail = email;
        }
  
        const updateAdmin = await AdminUser.update(
            {
                email: adminEmail,
                password: AdminUser.generateHash(password)
            },
            {
              where: {
                id: userId
              }
            }
        );
  
        if(updateAdmin && updateAdmin[0] && updateAdmin[0] === 1) {
            logger.info(`data.mutations.SiteAdmin.changeAdminUser.changeAdminUser: Changed admin user (${userId}) credentials with result ${JSON.stringify(updateAdmin)}`);
            return {
              status: '200'
            }
        } else {
            logger.warn(`data.mutations.SiteAdmin.changeAdminUser.changeAdminUser: Unexpected result when trying to change admin user (${userId}) credentials. Result was ${JSON.stringify(updateAdmin)}`);
            return {
              status: '400'
            }
        }
      } catch (error) {
        logger.error(`data.mutations.SiteAdmin.changeAdminUser.changeAdminUser: Error when trying to change admin user (${userId}) credentials: ${error.message}`, error);
        return {
          status: "500"
        }
      }
    } else {
        if (request.user) {
          logger.warn(`data.mutations.SiteAdmin.changeAdminUser.changeAdminUser: Unauthorized try to change admin user credentials from ${JSON.stringify(request.user)}. Request was: ${JSON.stringify(request)}.`);
          return {
            status: "403"
          }
        } else {
          logger.warn(`data.mutations.SiteAdmin.changeAdminUser.changeAdminUser: Unauthenticated try to change admin user credentials. Request was: ${JSON.stringify(request)}.`);
          return {
            status: "401"
          }
      }
    }
  },
};

export default changeAdminUser;

/*

mutation changeAdminUser($email: String, $password: String!) {
  changeAdminUser (email: $email, password: $password) {
    status
  }
}

*/