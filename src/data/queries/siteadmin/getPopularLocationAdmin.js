import {
    GraphQLList as List
} from 'graphql';

// Models
import { PopularLocation } from '../../models';

import sequelize from '../../sequelize';

// Types
import PopularLocationType from '../../types/siteadmin/PopularLocationType';

const getPopularLocationAdmin = {

    type: new List(PopularLocationType),

    async resolve({ request }) {
        // if (request.user.admin) {

        //const limit = 6;

        return await PopularLocation.findAll({
            where: {
                isEnable: true,
            },
            //limit,
            order: [[sequelize.literal('RAND()')]],
        });

        // } else {
        //     return {
        //         status: "notLoggedIn",
        //     };
        // }
    }
};

export default getPopularLocationAdmin;

/**

query getPopularLocation {
  getPopularLocation{
    id
    location
    locationAddress
    image
    isEnable
    createdAt
    updatedAt
  }
}

**/