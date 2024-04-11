// GrpahQL
import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

import AdminUserLoginType from '../../types/siteadmin/AdminUserLoginType';

// Authentication Utils
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { auth } from '../../../config';

// Sequelize models
import { AdminUser } from '../../../data/models';

const adminUserLogin = {

  type: AdminUserLoginType,

  args: {
    email: { type: new NonNull(StringType) },
    password: { type: new NonNull(StringType) },
  },

  async resolve({ request, response }, {
    email,
    password,
  }) {

    // Check if user already logged in
    if(!request.user) {
      // Check if the user is already exists
      const userLogin = await AdminUser.findOne({
        attributes: ['id', 'email', 'password'],
        where: { email: email},
      });

      // Let the user in
      if(userLogin) {
        if(bcrypt.compareSync(password, userLogin.password)){
          const expiresIn = 60 * 60 * 24 * 1; // 24 hours
          const token = jwt.sign({ id: userLogin.id, email: userLogin.email, admin: true }, auth.jwt.secret, { expiresIn });
          response.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
          return {
            status: "success",
          };
        } else {
            return {
              status: "password",
            };
          }
        } else {
            return {
              status: "email",
            };
          }
      } else {
          if(request.user.admin == true) {
            return {
              status: "loggedIn",
            };
          } else {
              return {
                status: "userLoggedIn",
              };
          }
      }
    },
};

export default adminUserLogin;
