import DataType from 'sequelize';
import Model from '../sequelize';

const ListingRetreats = Model.define('ListingRetreats', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    listId: {
        type: DataType.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
            model: 'Listing',
            key: 'id',
        },
    },

    languageId: {
        type: DataType.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
            model: 'RetreatLanguages',
            key: 'id',
        },
    },

    accommodations: {
        type: DataType.STRING,
    },

    teachers: {
        type: DataType.STRING,
    },

    eventType: {
        type: DataType.STRING,
    },

    category: {
        type: DataType.STRING,
    },

    title: {
        type: DataType.STRING,
    },

    location: {
        type: DataType.STRING,
    },

    country: {
        type: DataType.INTEGER,
    },

    street: {
        type: DataType.INTEGER,
    },

    city: {
        type: DataType.STRING,
    },

    state: {
        type: DataType.STRING,
    },

    zipcode: {
        type: DataType.STRING,
    },

    lat: {
        type: DataType.STRING,
    },

    lng: {
        type: DataType.STRING,
    },

    subCategory: {
        type: DataType.STRING,
    },

    RetreatStyle: {
        type: DataType.STRING,
    },

    atmospheres: {
        type: DataType.STRING,
    },

    yogaTypes: {type: DataType.STRING,},
    skillLevels: {type: DataType.STRING,},
    benefits: {type: DataType.STRING,},
    summary: {type: DataType.STRING,},
    reviews: {type: DataType.STRING,},
    includes: {type: DataType.STRING,},
    not_includes: {type: DataType.STRING,},
    special: {type: DataType.STRING,},
    full_description: {type: DataType.STRING,},
    instagram_url: {type: DataType.STRING,},
    meal: {type: DataType.STRING,},
    drink: {type: DataType.STRING,},
    food: {type: DataType.STRING,},
    currency: {type: DataType.STRING,},
    retreat_dates: {type: DataType.STRING,},
    duration: {type: DataType.INTEGER,},
    min_days: {type: DataType.INTEGER,},
    Seats: {type: DataType.INTEGER,},
    showType: {type: DataType.INTEGER,},
    isAllowPayment: {type: DataType.BOOLEAN,},
    isCash: {type: DataType.BOOLEAN,},
    addons: {type: DataType.STRING,},
    cancellationPolicy: {type: DataType.STRING,},
    allow_flexibility: {type: DataType.STRING,},
    use_increase_booking: {type: DataType.STRING,},
    free_gift_name: {type: DataType.STRING,},
    free_gift_desc: {type: DataType.STRING,},
    itinerary: {type: DataType.STRING,},
    localInfoDesc: {type: DataType.STRING,},
    localInformation: {type: DataType.STRING,},
    facilityFeatures: {type: DataType.STRING,},
    seasonalInformation: {type: DataType.STRING,},
    travelHelp: {type: DataType.STRING,},

});

export default ListingRetreats;
