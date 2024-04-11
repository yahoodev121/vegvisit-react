import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
    GraphQLInt as IntType,
} from 'graphql';

import EmailTokenType from '../types/EmailTokenType';
import { EmailToken } from '../../data/models';

const ResendConfirmEmail = {

    type: EmailTokenType,

    async resolve({ request, response }) {

        if (request.user && request.user.admin != true) {

            const userId = request.user.id;
            const email = request.user.email;
            let token = Date.now();
            
            const checkEmailToken = await EmailToken.findOne({
                where: {
                    userId,
                    email,
                },
            });

            if (checkEmailToken) {
                return checkEmailToken;
            } else {
                const createEmailToken = await EmailToken.create({
                    userId,
                    email,
                    token
                });
                if (createEmailToken) {
                    return {
                        userId,
                        email,
                        token
                    }
                } else {
                    return {
                        status: 'error'
                    }
                }
            }

        } else {
            return {
                status: 'error'
            }
        }

    },
};

export default ResendConfirmEmail;