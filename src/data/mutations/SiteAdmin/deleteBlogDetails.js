// GrpahQL
import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLFloat as FloatType,
    GraphQLBoolean as BooleanType,
} from 'graphql';

import BlogDetailsType from '../../types/BlogDetailsType';

// Sequelize models
import { BlogDetails } from '../../models';

const deleteBlogDetails = {

    type: BlogDetailsType,

    args: {
        id: { type: new NonNull(IntType) }
    },

    async resolve({ request, response }, {
        id
    }) {
        if (request.user.admin) {
            const blogDetails = await BlogDetails.findByPk(id);
            if (!blogDetails) {
                return {
                    status: '404'
                }
            }

            const deleteBlog = await BlogDetails.destroy({
                where: {
                    id: id
                }
            });

            if (deleteBlog) {
                return {
                    status: '200'
                }
            } else {
                return {
                    status: '400'
                }
            }

        } else {
            return {
                status: 'notLoggedIn'
            }
        }
    }
}

export default deleteBlogDetails;