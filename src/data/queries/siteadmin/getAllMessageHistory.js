import ReservationType from '../../types/ReservationType';
import { Threads, ThreadItems, Reservation } from '../../models';
import ThreadsType from '../../types/ThreadsType';

import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType
} from 'graphql';

const getAllMessageHistory = {

    type: new List(ThreadsType),

    async resolve({ request }) {
        return await Threads.findAll({
            order: [
                ['messageUpdatedDate', 'DESC'] 
            ],
        });
    }
};

export default getAllMessageHistory;

