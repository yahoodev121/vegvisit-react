import RequestBookingListType from '../../types/RequestBookingListType';
import { RequestBookingList } from '../../../data/models';
import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
    GraphQLInt as IntType,
} from 'graphql';


const RequestBookingLists = {

    type: RequestBookingListType, 

    args: {
        listId: { type: IntType },
        host: { type: StringType },
        guest: { type: StringType },
        checkInStart: { type: StringType }, 
        checkInEnd: { type: StringType },
    },

    async resolve({ request }, {
        listId,
        host,
        guest,
        checkInStart, 
        checkInEnd,
    }) {

        const createBlog = await RequestBookingList.create({
            listId,
            host,
            guest,
            checkInStart,
            checkInEnd, 
        });

        if(createBlog) {
            return {
                status: '200'
            }
        } else {
            return {
                status: '400'
              }
        }
        
    },
};
export default RequestBookingLists;
