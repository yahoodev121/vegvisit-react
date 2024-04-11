import SiteSettingsType from '../../../types/siteadmin/SiteSettingsType';
import { SiteSettings } from '../../../models';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
} from 'graphql';

const removeLogo = {

  type: SiteSettingsType,

  async resolve({ request }) {

    if(request.user && request.user.admin == true) {
        let removeLogo = await SiteSettings.destroy({
            where: {
              title: 'Logo'
            }
        });

        if(removeLogo){
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

export default removeLogo;
