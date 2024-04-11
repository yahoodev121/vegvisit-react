import PoularLocationType from '../../../types/siteadmin/PopularLocationType';
import { PopularLocation } from '../../../models';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const uploadLocation = {

  type: PoularLocationType,

  args: {
    image: { type: StringType },
    id: { type: IntType },
  },

  async resolve({ request }, { image,id}) {

    if(request.user && request.user.admin == true) {
        let updateLocation =await PopularLocation.update({
          image: image
      }, {
              where: {
                  id : id
              }
          });
     

        if(updateLocation){
          return {
            status: 'success'
          }
        } else {
          return {
            status: 'failed'
          }
        }

    } else {
        return {
            status: 'not logged in'
        }
    }

  },
};

export default uploadLocation;
