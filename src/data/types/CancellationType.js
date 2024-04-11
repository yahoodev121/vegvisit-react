import {
    GraphQLObjectType as ObjectType,
    GraphQLID as ID,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType,
} from 'graphql';

const CancellationType = new ObjectType({
    name: 'Cancellation',
    fields: {
        id: {
            type: IntType
        },
        policyName: {
            type: StringType
        },
        policyContent: {
            type: StringType
        },
        priorDays: {
            type: IntType
        },
        accommodationPriorCheckIn: {
            type: FloatType
        },
        accommodationBeforeCheckIn: {
            type: FloatType
        },
        accommodationDuringCheckIn: {
            type: FloatType
        },
        guestFeePriorCheckIn: {
            type: FloatType
        },
        guestFeeBeforeCheckIn: {
            type: FloatType
        },
        guestFeeDuringCheckIn: {
            type: FloatType
        },
        hostFeePriorCheckIn: {
            type: FloatType
        },
        hostFeeBeforeCheckIn: {
            type: FloatType
        },
        hostFeeDuringCheckIn: {
            type: FloatType
        },
        firstNightsRefundRestriction: {
            type: IntType
        },
        firstNightsRefundable: {
            type: FloatType
        },
        guestCancellationTimeThreshold: {
            type: StringType
        },
        hostCancellationTimeThreshold: {
            type: StringType
        },
        isEnable: {
            type: BooleanType
        },
        status: {
            type: StringType
        }
    }
});

export default CancellationType;