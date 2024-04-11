import {
    GraphQLObjectType as ObjectType,
    GraphQLID as ID,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLFloat as FloatType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType
} from 'graphql';

const ListCalendarPriceType = new ObjectType({
    name: 'ListCalendarPriceType',
    fields: {
        id: {
            type: IntType
        },
        listId: {
            type: IntType
        },
        blockedDates: {
            type: StringType
        },
        isSpecialPrice: {
            type: FloatType
        },
        createdAt: {
            type: StringType
        },
        updatedAt: {
            type: StringType
        },
        status: {
            type: StringType
        },
        calendarStatus: {
            type: StringType
        }
    }
});

export default ListCalendarPriceType;