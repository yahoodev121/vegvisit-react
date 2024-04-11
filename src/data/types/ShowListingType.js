import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLBoolean as BooleanType,
  GraphQLInt as IntType,
  GraphQLFloat as FloatType,
  GraphQLNonNull as NonNull,
  GraphQLList as List,
} from 'graphql';

import moment from 'moment';
import momentTimezone from 'moment-timezone';

//sequelize
import Sequelize from 'sequelize';

import UserVerifiedInfoType from './UserVerifiedInfoType';
import CancellationType from './CancellationType';
import ListCalendarType from './ListCalendarType';
import UserBedTypes from './UserBedTypes';
import ReviewsType from './ReviewsType';
import ListBlockedDatesType from './ListBlockedDatesType';

import {
  Cancellation,
  Reviews,
  ListCalendar,
  WishList,
  Listing,
  BedTypes,
  ListBlockedDates,
  ListPhotos,
  Categories,
  ListingRetreats,
  ListingRetreatCategory,
  HasRetreatMeals,
  Meals
} from '../models';

const Profile = new ObjectType({
  name: 'profile',
  fields: {
    profileId: {
      type: IntType,
    },
    firstName: {
      type: StringType,
    },
    lastName: {
      type: StringType,
    },
    displayName: {
      type: StringType,
    },
    dateOfBirth: {
      type: StringType,
    },
    picture: {
      type: StringType,
    },
    location: {
      type: StringType,
    },
    info: {
      type: StringType,
    },
    createdAt: {
      type: StringType,
    }
  }
});
const User = new ObjectType({
  name: 'user',
  fields: {
    email: {
      type: StringType,
      resolve(user) {
        return user.email;
      }
    },
    profile: {
      type: Profile,
      resolve(user) {
        return user.getProfile();
      }
    },
    verification: {
      type: UserVerifiedInfoType,
      resolve(user) {
        return user.getUserVerifiedInfo();
      }
    },
    userBanStatus: {
      type: IntType,
      resolve(user) {
        return user.userBanStatus;
      }
    },
    userDeletedAt: {
      type: StringType,
      resolve(user) {
        return user.userDeletedAt;
      }
    },
  }
});
const ListSettingsTypes = new ObjectType({
  name: 'listSettingsTypes',
  fields: {
    id: { type: IntType },
    typeName: { type: StringType },
    typeLabel: { type: StringType },
    step: { type: StringType },
    fieldType: { type: StringType },
    isEnable: { type: StringType },
    status: { type: StringType },
  },
});
const ListSettings = new ObjectType({
  name: 'listSettings',
  fields: {
    id: { type: IntType },
    typeId: { type: IntType },
    itemName: { type: StringType },
    itemDescription: { type: StringType },
    otherItemName: { type: StringType },
    maximum: { type: IntType },
    minimum: { type: IntType },
    startValue: { type: IntType },
    endValue: { type: IntType },
    isEnable: { type: StringType },
    settingsType: {
      type: ListSettingsTypes,
      resolve(listSettings) {
        return listSettings.getListSettingsTypes();
      }
    },
  }
});
const UserAmenities = new ObjectType({
  name: 'userAmenities',
  fields: {
    amenitiesId: {
      type: StringType,
      resolve(userAmenities) {
        return userAmenities.amenitiesId;
      }
    },
    listsettings: {
      type: ListSettings,
      resolve(userAmenities) {
        return userAmenities.getListSettings();
      }
    },
  }
});

const UserServices = new ObjectType({
  name: 'userServices',
  fields: {
    serviceId: {
      type: StringType,
      resolve(userServices) {
        return userServices.serviceId;
      }
    },
    listsettings: {
      type: ListSettings,
      resolve(userServices) {
        return userServices.getListSettings();
      }
    },
  }
});
const UserSafetyAmenities = new ObjectType({
  name: 'userSafetyAmenities',
  fields: {
    safetyAmenitiesId: {
      type: StringType,
      resolve(userSafetyAmenities) {
        return userSafetyAmenities.safetyAmenitiesId;
      }
    },
    listsettings: {
      type: ListSettings,
      resolve(userSafetyAmenities) {
        return userSafetyAmenities.getListSettings();
      }
    },
  }
});
// Spaces
const UserSpaces = new ObjectType({
  name: 'userSpaces',
  fields: {
    spacesId: {
      type: StringType,
      resolve(userSpaces) {
        return userSpaces.spacesId;
      }
    },
    listsettings: {
      type: ListSettings,
      resolve(userSpaces) {
        return userSpaces.getListSettings();
      }
    },
  }
});
// House Rules
const UserHouseRules = new ObjectType({
  name: 'userHouseRules',
  fields: {
    id: {
      type: IntType,
    },
    houseRulesId: {
      type: StringType,
      resolve(userHouseRules) {
        return userHouseRules.houseRulesId;
      }
    },
    listsettings: {
      type: ListSettings,
      resolve(userHouseRules) {
        return userHouseRules.getListSettings();
      }
    },
  }
});

// Spaces
const ListBedTypes = new ObjectType({
  name: 'listBedTypes',
  fields: {
    bedType: {
      type: IntType,
      resolve(listBedTypes) {
        return listBedTypes.bedType;
      }
    },
    listsettings: {
      type: ListSettings,
      resolve(listBedTypes) {
        return listBedTypes.getListSettings();
      }
    },
  }
});

// List Blocked Dates
const ListBlockedDatesValue = new ObjectType({
  name: 'listBlockedDates',
  fields: {
    blockedDates: {
      type: StringType,
      resolve(listBlockedDates) {
        return listBlockedDates.blockedDates;
      }
    },
    reservationId: {
      type: IntType,
      resolve(listBlockedDates) {
        return listBlockedDates.reservationId;
      }
    },
    calendarStatus: {
      type: StringType,
      resolve(listBlockedDates) {
        return listBlockedDates.calendarStatus;
      }
    },
    isSpecialPrice: {
      type: FloatType,
      resolve(listBlockedDates) {
        return listBlockedDates.isSpecialPrice;
      }
    }
  }
});
// Listing More Data
const ListingData = new ObjectType({
  name: 'listingData',
  fields: {
    bookingNoticeTime: { type: StringType },
    checkInStart: { type: StringType },
    checkInEnd: { type: StringType },
    maxDaysNotice: { type: StringType },
    minNight: { type: StringType },
    maxNight: { type: StringType },
    basePrice: { type: FloatType },
    securityDeposit : {type: FloatType },
    cleaningPrice: { type: FloatType },
    currency: { type: StringType },
    weeklyDiscount: { type: IntType },
    monthlyDiscount: { type: IntType },
    cancellationPolicy: { type: IntType },
    additionalRules: { type: StringType},
    cancellation: {
      type: CancellationType,
      resolve(listingData) {
        return Cancellation.findOne({
          where: {
            id: listingData.cancellationPolicy,
            isEnable: true
          }
        });
      }
    }
  }
});
// User Listing Data
const UserListingData = new ObjectType({
  name: 'userListingData',
  fields: {
    id: {
      type: IntType,
      resolve(userListingData) {
        return userListingData.id;
      }
    },
    settingsId: {
      type: IntType,
      resolve(userListingData) {
        return userListingData.settingsId;
      }
    },
    listsettings: {
      type: ListSettings,
      resolve(userListingData) {
        return userListingData.getListSettings();
      }
    },
  }
});
// Listing Category Data
const ListingCategoryData = new ObjectType({
  name: 'listingCategoryData',
  fields: {
    id: {
      type: IntType,
      resolve(listingCategoryData) {
        return listingCategoryData.id;
      }
    },
    name: {
      type: StringType,
      resolve(listingCategoryData) {
        return listingCategoryData.name;
      }
    },
  }
});

const ListingPhotoItemData = new ObjectType({
  name: 'listingPhotoItemData',
  fields: {
    type: {
      type: StringType,
      resolve(listingPhotoItemData) {
        return listingPhotoItemData.type;
      }
    },
    name: {
      type: StringType,
      resolve(listingPhotoItemData) {
        return listingPhotoItemData.name;
      }
    },
  }
});

const ListingLocationItemData = new ObjectType({
  name: 'listingLocationItemData',
  fields: {
    country: {
      type: StringType,
      resolve(listingLocationItemData) {
        return listingLocationItemData.country;
      }
    },
    street: {
      type: StringType,
      resolve(listingLocationItemData) {
        return listingLocationItemData.street;
      }
    },
    buildingName: {
      type: StringType,
      resolve(listingLocationItemData) {
        return listingLocationItemData.buildingName;
      }
    },
    city: {
      type: StringType,
      resolve(listingLocationItemData) {
        return listingLocationItemData.city;
      }
    },
    state: {
      type: StringType,
      resolve(listingLocationItemData) {
        return listingLocationItemData.state;
      }
    },
    zipCode: {
      type: StringType,
      resolve(listingLocationItemData) {
        return listingLocationItemData.zipCode;
      }
    },
  }
});

const ListingTeacherItemData = new ObjectType({
  name: 'listingTeacherItemData',
  fields: {
    name: {
      type: StringType,
      resolve(listingTeacherItemData) {
        return listingTeacherItemData.name;
      }
    },
    email: {
      type: StringType,
      resolve(listingTeacherItemData) {
        return listingTeacherItemData.email;
      }
    },
    is_yoga_alliance: {
      type: StringType,
      resolve(listingTeacherItemData) {
        return listingTeacherItemData.is_yoga_alliance;
      }
    },
    about: {
      type: StringType,
      resolve(listingTeacherItemData) {
        return listingTeacherItemData.about;
      }
    },
    photos: {
      type: new List(ListingPhotoItemData),
      resolve(listingTeacherItemData) {
        return listingTeacherItemData.photos;
      }
    },
    location: {
      type: ListingLocationItemData,
      resolve(listingTeacherItemData) {
        return listingTeacherItemData.location;
      }
    },
  }
});

const ListingAccommodationData = new ObjectType({
  name: 'listingAccommodationData',
  fields: {
    type: {
      type: StringType,
      resolve(listingAccommodationData) {
        return listingAccommodationData.type;
      }
    },
    price: {
      type: StringType,
      resolve(listingAccommodationData) {
        return listingAccommodationData.price;
      }
    },
    deposit_percent: {
      type: StringType,
      resolve(listingAccommodationData) {
        return listingAccommodationData.deposit_percent;
      }
    },
    description: {
      type: StringType,
      resolve(listingAccommodationData) {
        return listingAccommodationData.description;
      }
    },
    photos: {
      type: new List(ListingPhotoItemData),
      resolve(listingAccommodationData) {
        return listingAccommodationData.photos;
      }
    },
  }
});


const MealData = new ObjectType({
  name: 'mealData',
  fields: {
    mealType: { type: StringType },
    mealIcon: { type: StringType }
  }
})

// Listing Retreat Data
const ListingRetreatData = new ObjectType({
  name: 'listingRetreatData',
  fields: {
    id: {
      type: IntType,
      resolve(listingRetreatData) {
        return listingRetreatData.id;
      }
    },
    languageId: {
      type: IntType,
      resolve(listingRetreatData) {
        return listingRetreatData.languageId;
      }
    },
    accommodations: {
      type: new List(ListingAccommodationData),
      resolve(listingRetreatData) {
        return JSON.parse(listingRetreatData.accommodations);
      }
    },
    teachers: {
      type: new List(ListingTeacherItemData),
      resolve(listingRetreatData) {
        return JSON.parse(listingRetreatData.teachers);
      }
    },
    eventType: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.eventType;
      }
    },
    category: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.category;
      }
    },
    title: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.title;
      }
    },
    location: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.location;
      }
    },
    country: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.country;
      }
    },
    street: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.street;
      }
    },
    city: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.city;
      }
    },
    state: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.state;
      }
    },
    zipcode: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.zipcode;
      }
    },
    lat: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.lat;
      }
    },
    lng: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.lng;
      }
    },
    subCategory: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.subCategory;
      }
    },
    RetreatStyle: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.RetreatStyle;
      }
    },
    atmospheres: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.atmospheres;
      }
    },
    yogaTypes: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.yogaTypes;
      }
    },
    skillLevels: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.skillLevels;
      }
    },
    benefits: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.benefits;
      }
    },
    summary: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.summary;
      }
    },
    reviews: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.reviews;
      }
    },
    includes: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.includes;
      }
    },
    not_includes: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.not_includes;
      }
    },
    special: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.special;
      }
    },
    full_description: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.full_description;
      }
    },
    instagram_url: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.instagram_url;
      }
    },
    meal: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.meal;
      }
    },
    drink: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.drink;
      }
    },
    food: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.food;
      }
    },
    currency: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.currency;
      }
    },
    retreat_dates: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.retreat_dates;
      }
    },
    duration: {
      type: IntType,
      resolve(listingRetreatData) {
        return listingRetreatData.duration;
      }
    },
    min_days: {
      type: IntType,
      resolve(listingRetreatData) {
        return listingRetreatData.min_days;
      }
    },
    Seats: {
      type: IntType,
      resolve(listingRetreatData) {
        return listingRetreatData.Seats;
      }
    },
    showType: {
      type: IntType,
      resolve(listingRetreatData) {
        return listingRetreatData.showType;
      }
    },
    isAllowPayment: {
      type: BooleanType,
      resolve(listingRetreatData) {
        return listingRetreatData.isAllowPayment;
      }
    },
    isCash: {
      type: BooleanType,
      resolve(listingRetreatData) {
        return listingRetreatData.isCash;
      }
    },
    addons: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.addons;
      }
    },
    cancellationPolicy: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.cancellationPolicy;
      }
    },
    allow_flexibility: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.allow_flexibility;
      }
    },
    use_increase_booking: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.use_increase_booking;
      }
    },
    free_gift_name: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.free_gift_name;
      }
    },
    free_gift_desc: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.free_gift_desc;
      }
    },
    itinerary: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.itinerary;
      }
    },
    localInfoDesc: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.localInfoDesc;
      }
    },
    localInformation: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.localInformation;
      }
    },
    facilityFeatures: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.facilityFeatures;
      }
    },
    seasonalInformation: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.seasonalInformation;
      }
    },
    travelHelp: {
      type: StringType,
      resolve(listingRetreatData) {
        return listingRetreatData.travelHelp;
      }
    },
  }
});

// Listing Steps
const UserListingSteps = new ObjectType({
  name: 'userListingSteps',
  fields: {
    id: { type: IntType },
    listId: { type: IntType },
    step1: { type: StringType },
    step2: { type: StringType },
    step3: { type: StringType },
    currentStep: { type: IntType },
    status: { type: StringType },
  },
});
// Recommended Listing
const Recommend = new ObjectType({
  name: 'recommend',
  fields: {
    id: { type: IntType },
    listId: { type: IntType },
    status: { type: StringType },
  },
});
// Listing Photos
const ListPhotosType = new ObjectType({
  name: 'listPhotos',
  fields: {
    id: { type: IntType },
    listId: { type: IntType },
    name: { type: StringType },
    type: { type: StringType },
    status: { type: StringType },
  },
});
const ListCategoriesType = new ObjectType({
  name: 'listCategories',
  fields: {
    id: { type: IntType },
    listId: { type: IntType },
    category: { type: StringType },
    subCategory: { type: StringType },
  },
});

const ShowListingType = new ObjectType({
  name: 'ShowListing',
  fields: {
    id: { type: IntType },
    userId: { type: StringType },
    title: { type: StringType },
    description: { type: StringType },
    bedrooms: { type: StringType },
    experienceCategory: { type: StringType },
    residenceType: { type: StringType },
    buildingSize: { type: StringType },
    beds: { type: IntType },
    personCapacity: { type: IntType },
    bathrooms: { type: FloatType },
    country: { type: StringType },
    street: { type: StringType },
    buildingName: { type: StringType },
    city: { type: StringType },
    state: { type: StringType },
    zipcode: { type: StringType },
    lat: { type: FloatType },
    lng: { type: FloatType },
    timeZone: { type: StringType },
    coverPhoto: { type: IntType },
    listPhotos: {
      type: new List(ListPhotosType),
      async resolve(listing) {
        // return listing.getListPhotos()
        return await ListPhotos.findAll({
          where: {
            listId: listing.id,
          },
          order: [
            ['sorting','ASC'],
            ['createdAt','ASC'],
          ]
        });
      }
    },
    listCategories: {
      type: new List(ListCategoriesType),
      async resolve(listing) {
        // return listing.getListPhotos()
        return await ListingRetreatCategory.findAll({
          where: {
            listId: listing.id,
          }
        });
      }
    },
    kitchen: { type: StringType },
    listType: { type: StringType },
    nonVeg: { type: StringType },
    aboutPlaces: { type: StringType },
    aboutKitchen: { type: StringType },
    neighourhood: { type: StringType },
    notes: { type: StringType },
    moreDetails: { type: StringType },
    isMapTouched: { type: BooleanType },
    bookingType: { type: StringType },
    isPublished: { type: BooleanType },
    lastPublished: { type: StringType },
    isReady: { type: BooleanType },
    status: { type: StringType },
    updatedAt: { type: StringType },
    createdAt: { type: StringType },
    count: { type: IntType },
    listingStatus: { type: BooleanType },
    calendarExportSecret: { type: StringType },
    reviewsImportUrlAirbnb: { type: StringType },
    lastReviewsImportAirbnb: { type: StringType },
    user: {
      type: User,
      resolve(listing) {
        return listing.getUser();
      }
    },
    userAmenities: {
      type: new List(UserAmenities),
      resolve(listing) {
        return listing.getUserAmenities();
      }
    },
    userSafetyAmenities: {
      type: new List(UserSafetyAmenities),
      resolve(listing) {
        return listing.getUserSafetyAmenities();
      }
    },
    userServices: {
      type: new List(UserServices),
      resolve(listing) {
        return listing.getUserServices();
      }
    },
    userSpaces: {
      type: new List(UserSpaces),
      resolve(listing) {
        return listing.getUserSpaces();
      }
    },
    settingsData: {
      type: new List(UserListingData),
      resolve(listing) {
        return listing.getUserListingData();
      }
    },
    listingRetreat: {
      type: ListingRetreatData,
      async resolve(listing) {
        return listing.getListingRetreat();
        // const listingRetreat = await ListingRetreats.findOne({
        //   listId: listing.id
        // })
        // return listingRetreat;
      }
    },
    houseRules: {
      type: new List(UserHouseRules),
      resolve(listing) {
        return listing.getUserHouseRules();
      }
    },
    listBedTypes: {
      type: new List(ListBedTypes),
      resolve(listing) {
        return listing.getBedTypes();
      }
    },
    listingData: {
      type: ListingData,
      resolve(listing) {
        return listing.getListingData();
      }
    },
    // blockedDates: {
    //   type: new List(ListBlockedDatesValue),
    //   async resolve(listing) {
    //     return await listing.getListBlockedDates();
    //   }
    // },
    //new
    blockedDates: {
      type: new List(ListBlockedDatesType),
      async resolve(listBlock) {
        const Op = Sequelize.Op;
        let convertStartDate = moment(moment(momentTimezone.tz(new Date(), moment.tz.guess()).format('YYYY-MM-DD'))).subtract(1, 'days').format('YYYY-MM-DD');
        convertStartDate = Sequelize.fn('DATE', convertStartDate);
        // convertStartDate.setHours(0, 0, 0, 0);
        return await ListBlockedDates.findAll({
          where: {
            listId: listBlock.id,
            blockedDates: {
              [Op.gte]: convertStartDate
            }
          }
        })
      }
    },
    listingSteps: {
      type: UserListingSteps,
      resolve(listing) {
        return listing.getUserListingSteps();
      }
    },
    recommend: {
      type: Recommend,
      resolve(listing) {
        return listing.getRecommend();
      }
    },
    reviewsCount: {
      type: IntType,
      async resolve(listing) {
        return await Reviews.count({
          where: {
            listId: listing.id,
            userId: listing.userId,
            isAdminEnable: true
          }
        });
      }
    },
    reviewsStarRating: {
      type: IntType,
      async resolve(listing) {
        return await Reviews.sum('rating', {
          where: {
            listId: listing.id,
            userId: listing.userId,
            isAdminEnable: true
          }
        });
      }
    },
    reviews: {
      type: new List(ReviewsType),
      async resolve(listing) {
        return await Reviews.findAll({
          where: {
            listId: listing.id,
            userId: listing.userId,
            isAdminEnable: true
          },
          limit: 1
        });
      }
    },
    lastImportedReview: {
      type: ReviewsType,
      async resolve(listing) {
        const Op = Sequelize.Op;
        return await Reviews.findOne({
          where: {
            listId: listing.id,
            userId: listing.userId,
            isAdminEnable: true,
            importUrl: {
              [Op.not]: null
            }
          },
          order: [
            ['updatedAt', 'DESC']
          ]
        });
      }
    },
    calendars: {
      type: new List(ListCalendarType),
      async resolve(listing) {
        return await ListCalendar.findAll({
          where: {
            listId: listing.id,
          },
        });
      }
    },
    wishListStatus: {
      type: BooleanType,
      async resolve(listing, { }, request) {
        const where = {
          listId: listing.id
        };
        let userId = (request && request.user) ? request.user.id : undefined;
        if (userId) {
          where.userId = userId;
        }
        let count = await WishList.count({
          where,
        });
        return (count) ? true : false
      }
    },
    isListOwner: {
      type: BooleanType,
      async resolve(listing, { }, request) {
        const where = {
          id: listing.id
        };
        let userId = (request && request.user) ? request.user.id : undefined;
        if (userId) {
          where.userId = userId;
        }
        let count = await Listing.count({
          where,
        });
        return (count) ? true : false;
      }
    },
    userBedsTypes: {
      type: new List(UserBedTypes),
      async resolve(bedtypes) {
        return await BedTypes.findAll({
          where: {
            listId: bedtypes.id,
          }
        })
      }
    },
    listBlockedPrice: {
      type: new List(ListBlockedDatesType),
      async resolve(listBlock) {
        return await ListBlockedDates.findAll({
          where: {
            listId: listBlock.id,
            calendarStatus: 'available'
          }
        })
      }
    }
  },
});
export default ShowListingType;
