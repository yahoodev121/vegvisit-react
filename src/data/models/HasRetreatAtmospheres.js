import DataType from 'sequelize';
import Model from '../sequelize';

const HasRetreatAtmospheres = Model.define('HasRetreatAtmospheres', {

  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  listingRetreatId: {
    type: DataType.INTEGER,
    allowNull: false,
    foreignKey: true,
    references: {
      model: 'ListingRetreats',
      key: 'id',
    },
  },

  atmosphereId: {
    type: DataType.INTEGER,
    allowNull: false,
    foreignKey: true,
    references: {
      model: 'AtmosphHasRetreatAtmospheres',
      key: 'id',
    },
  },

});

export default HasRetreatAtmospheres;
