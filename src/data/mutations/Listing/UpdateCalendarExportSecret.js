import ShowListingType from '../../types/ShowListingType';
import { Listing } from '../../models';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const crypto = require('crypto');

const UpdateCalendarExportSecret = {

  type: ShowListingType,

  args: {
    listId: { type: new NonNull(IntType) },
  }, 

  async resolve({ request }, { listId }) {

    // Check whether user is logged in
    if(request.user && !request.user.admin) {

        const where = {
            id: listId,
            userId: request.user.id
        }

        const listing = await Listing.findOne({ where });

        let updated, secret, updateResult;

        if (listing && !listing.calendarExportSecret) {

            secret = crypto.randomBytes(16).toString('hex');

            updateResult = await listing.update({
              calendarExportSecret: secret
            });

        }

        if(updateResult && updateResult.calendarExportSecret) {
            updateResult.status = '200';
            return updateResult;
        } else {
            return {
                status: '400'
            }
        }

      } else {
          return {
            status: "notLoggedIn"
          };
      }
    },
};

export default UpdateCalendarExportSecret;

