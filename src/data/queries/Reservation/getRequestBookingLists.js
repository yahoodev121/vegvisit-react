import RequestBookingListType from '../../types/RequestBookingListType';
import { RequestBookingList } from '../../../data/models';
import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
    GraphQLInt as IntType,
} from 'graphql';


const getRequestBookingLists = {

    type: RequestBookingListType, 

    args: {
        listId: { type: IntType },
        host: { type: StringType },
        guest: { type: StringType }, 
    },

    async resolve({ request }, {
        listId,
        host,
        guest, 
    }) {

        const list = await RequestBookingList.findOne({
            where :{
                listId,
                host,
                guest, 

            }, 
            order: [['id', 'DESC']],
            limit: 1,
        });

        if(list)
        {
            return list;
            
        } else {
            return {
                status: '400'
              }
        }
        
    },
};
export default getRequestBookingLists;
