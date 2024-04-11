import DataType from 'sequelize';
import Model from '../sequelize';

const HasRetreatAreas = Model.define('HasRetreatAreas', {

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

  areaId: {
    type: DataType.INTEGER,
    allowNull: false,
    foreignKey: true,
    references: {
      model: 'AtmosphHasRetreatAreas',
      key: 'id',
    },
  },

});

export default HasRetreatAreas;
