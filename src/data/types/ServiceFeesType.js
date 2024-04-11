import {
    GraphQLObjectType as ObjectType,
    GraphQLID as ID,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType,
} from 'graphql';

const ServiceFeesType = new ObjectType({
    name: 'ServiceFees',
    fields: {
        id: {
            type: IntType
        },
        guestType: {
            type: StringType
        },
        guestValue: {
            type: FloatType
        },
        hostType: {
            type: StringType
        },
        hostValue: {
            type: FloatType
        },
        currency: {
            type: StringType
        },
        status: {
            type: StringType
        }
    }
});

export default ServiceFeesType;