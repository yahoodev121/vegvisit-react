import PopularLocationType from '../../types/siteadmin/PopularLocationType';
import { PopularLocation } from '../../../data/models';
import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
    GraphQLInt as IntType,
} from 'graphql';
const updatePopularLocationStatus = {
    type: PopularLocationType,
    args: {
        id: { type: IntType },
        isEnable: { type: StringType },
    },
    async resolve({ request }, {
        id,
        isEnable,
    }) {

        if (request.user && request.user.admin == true) {
            const Update = await PopularLocation.update({
                isEnable: isEnable == 'true' ? 0 : 1 ,
            }, {
                    where: {
                        id : id
                    }
                });
            return {
                status: 'success'
            }
        } else {
            return {
                status: 'failed'
            }
        }
    },
};
export default updatePopularLocationStatus;
