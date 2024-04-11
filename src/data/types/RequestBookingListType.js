import {
    GraphQLObjectType as ObjectType,
    GraphQLID as ID,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLFloat as FloatType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType
} from 'graphql';

const RequestBookingListType = new ObjectType({
    name: 'RequestBookingListType',
    fields: {
        id: {
            type: IntType
        },
        listId: {
            type: IntType
        }, 
        host: {
            type: StringType
        },
        guest: {
            type: StringType
        },
        checkInStart: {
            type: StringType
        },
        checkInEnd: {
            type: StringType
        },
        createdAt: {
            type: StringType
        },
        updatedAt: {
            type: StringType
        }, 
        count:{
            type: IntType
        },
        status:{
            type: StringType
        }
    }
});

export default RequestBookingListType;