import UserManagementType from '../../types/siteadmin/UserManagementType';
import { User, Listing } from '../../../data/models';
import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
    GraphQLInt as IntType,
} from 'graphql';
const updateBanServiceHistoryStatus = {
    type: UserManagementType,
    args: {
        id: { type: StringType },
        banStatus: { type: IntType }
    },
    async resolve({ request }, {
        id,
        banStatus
    }) {
        if (request.user && request.user.admin == true) {
            //let isActive =  serviceStatus == 'completed' ? 0 : 1;
            const Update = await User.update({
                userBanStatus: banStatus,
                // isActive
            }, {
                    where: {
                        id
                    }
                });
            if (banStatus == 1) {
                const UpdateListingStatus = await Listing.update({
                    isPublished: 0,
                    // isActive
                }, {
                        where: {
                            userId: id
                        }
                    });
            }
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
export default updateBanServiceHistoryStatus;
