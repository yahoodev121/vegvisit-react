import BlogDetailsType from '../../types/BlogDetailsType';
import { BlogDetails } from '../../models';

import Sequelize from 'sequelize';
import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
    GraphQLInt as IntType,
    GraphQLBoolean as BooleanType,
} from 'graphql';
const updateBlogDetails = {
    type: BlogDetailsType,
    args: {
        id: { type: IntType },
        metaTitle: { type: StringType },
        metaDescription: { type: StringType },
        pageUrl: { type: StringType },
        pageTitle: { type: StringType },
        content: { type: StringType },
        footerCategory: { type: StringType },
    },
    async resolve({ request }, {
        id,
        metaTitle,
        metaDescription,
        pageUrl,
        pageTitle,
        content,
        footerCategory,
    }) {
        const Op = Sequelize.Op;
        if (request.user && request.user.admin == true) {
            const checkUrl = await BlogDetails.findOne({
                where: {
                    pageUrl ,
                    id: {
                      [Op.ne]: id
                      },
                     
                }
            });

            if(checkUrl){
                return {
                    status: 'URL exist'
                }
            }
            else{
                const Update = await BlogDetails.update({
                    metaTitle,
                    metaDescription,
                    pageUrl,
                    pageTitle,
                    footerCategory,
                    content: content
                }, {
                        where: {
                            id: id
                        }
                    });
                return {
                    status: 'success'
                }
            }
        } else {
            return {
                status: 'failed'
            }
        }
    },
};
export default updateBlogDetails;
