// GrpahQL
import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType,
} from 'graphql';
// GraphQL Type
import EditListingType from '../../types/EditListingType';
// Sequelize models
import {
    Listing,
    UserListingSteps,
    UserHouseRules,
    ListingData,
    ListBlockedDates,
    ListPhotos,
    SiteSettings
} from '../../../data/models';

const ListingDataUpdate = {

    type: EditListingType,

    args: {
        id: { type: IntType },
        houseRules: { type: new List(IntType) },
        checkInStart: { type: StringType },
        checkInEnd: { type: StringType },
        minNight: { type: StringType },
        maxNight: { type: StringType },
        cancellationPolicy: { type: IntType },
        maxDaysNotice: { type: StringType },
        bookingNoticeTime: { type: StringType },
        basePrice: { type: FloatType },
        cleaningPrice: { type: FloatType },
        currency: { type: StringType },
        additionalRules: { type: StringType },
        securityDeposit: { type: FloatType }
    },

    async resolve({ request, response }, {
        id,
        houseRules,
        checkInStart,
        checkInEnd,
        minNight,
        maxNight,
        cancellationPolicy,
        maxDaysNotice,
        bookingNoticeTime,
        basePrice,
        cleaningPrice,
        currency,
        additionalRules,
        securityDeposit
    }) {

        let isListUpdated = false;

        // Check whether user is logged in
        if (request.user) {
            let where = { id };
            if (!request.user.admin) {
                where = {
                    id,
                    userId: request.user.id
                }
            };

            // Confirm whether the Listing Id is available
            const isListingAvailable = await Listing.findByPk(id);

            if (isListingAvailable != null) {

                if (houseRules) {
                    const removeHouseRules = await UserHouseRules.destroy({
                        where: {
                            listId: id
                        }
                    });
                    if (houseRules.length > 0) {
                        houseRules.map(async (item, key) => {
                            let updateHouseRules = await UserHouseRules.create({
                                listId: id,
                                houseRulesId: item
                            })
                        });
                    }
                }

                let maxDaysNoticeValue = "available";
                // Check if record already available for this listing
                const isListingIdAvailable = await ListingData.findOne({ where: { listId: id } });
                if (isListingIdAvailable != null) {
                    // Update Record
                    const updateData = ListingData.update({
                        checkInStart: checkInStart,
                        checkInEnd: checkInEnd,
                        minNight: minNight,
                        maxNight: maxNight,
                        cancellationPolicy: cancellationPolicy,
                        maxDaysNotice: maxDaysNotice,
                        bookingNoticeTime: bookingNoticeTime,
                        basePrice: basePrice,
                        cleaningPrice: cleaningPrice,
                        currency: currency,
                        additionalRules: additionalRules,
                        securityDeposit: securityDeposit
                    },
                        {
                            where: {
                                listId: id
                            }
                        });
                    isListUpdated = true;

                } else {
                    // Create New Record
                    const createData = ListingData.create({
                        listId: id,
                        checkInStart: checkInStart,
                        checkInEnd: checkInEnd,
                        minNight: minNight,
                        maxNight: maxNight,
                        cancellationPolicy: cancellationPolicy,
                        maxDaysNotice: maxDaysNotice,
                        bookingNoticeTime: bookingNoticeTime,
                        basePrice: basePrice,
                        cleaningPrice: cleaningPrice,
                        currency: currency,
                        additionalRules: additionalRules,
                        securityDeposit: securityDeposit
                    });

                    if (createData) {
                        isListUpdated = true;
                    }
                }


                if (isListUpdated) {
                    return {
                        status: 'success'
                    }
                } else {
                    return {
                        status: 'failed'
                    }
                }

            } else {
                return {
                    status: 'notAvailable'
                }
            }

        } else {
            return {
                status: "notLoggedIn",
            };
        }

    },
};

export default ListingDataUpdate;