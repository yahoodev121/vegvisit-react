import DataType from 'sequelize';
import Model from '../sequelize';

const Listing = Model.define('Listing', {

  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  userId: {
    type: DataType.UUID,
    allowNull: false
  },

  title: {
    type: DataType.STRING,
  },

  description: {
    type: DataType.TEXT,
  },

  roomType: {
    type: DataType.STRING,
  },

  residenceType: {
    type: DataType.STRING,
  },

  bedrooms: {
    type: DataType.STRING,
  },

  beds: {
    type: DataType.INTEGER,
  },

  personCapacity: {
    type: DataType.INTEGER,
  },

  bathrooms: {
    type: DataType.FLOAT,
  },

  country: {
    type: DataType.STRING,
  },

  street: {
    type: DataType.STRING,
  },

  buildingName: {
    type: DataType.STRING,
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
    type: DataType.FLOAT,
  },

  lng: {
    type: DataType.FLOAT,
  },

  coverPhoto: {
    type: DataType.INTEGER,
  },

  isMapTouched: {
    type: DataType.BOOLEAN,
    defaultValue: false,
  },

  timeZone: {
    type: DataType.STRING,
  },

  bookingType: {
    type: DataType.ENUM('request', 'instant'),
    defaultValue: 'instant',
    allowNull: false
  },

  isPublished: {
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },

  lastPublished: {
    type: DataType.DATE,
  },

  isReady: {
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },

  reviewsCount: {
    type: DataType.INTEGER,
    defaultValue: 0,
  },

  kitchen: {
    type: DataType.STRING,
  },

  nonVeg: {
    type: DataType.STRING,
  },

  aboutPlaces: {
    type: DataType.STRING
  },

  aboutKitchen: {
    type: DataType.STRING,
  },

  neighourhood: {
    type: DataType.STRING,
  },

  notes: {
    type: DataType.STRING,
  },

  // services: { 
  //   type: DataType.STRING 
  // },

  moreDetails: {
    type: DataType.STRING
  },

  listingStatus: {
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },

  calendarExportSecret: {
    type: DataType.STRING
  },

  reviewsImportUrlAirbnb: {
    type: DataType.STRING
  },

  lastReviewsImportAirbnb: {
    type: DataType.DATE
  },

  listType: {
    type: DataType.ENUM('Stays', 'Stays with Experience', 'Retreats'),
  },

  experienceCategory: {
    type: DataType.STRING
  },
});

export default Listing;
