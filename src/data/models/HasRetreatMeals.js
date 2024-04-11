import DataType from 'sequelize';
import Model from '../sequelize';

const HasRetreatMeals = Model.define('HasRetreatMeals', {

  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement : true
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

  // mealId: {
  //   type: DataType.INTEGER,
  //   allowNull: false,
  //   foreignKey: true,
  //   references: {
  //     model: 'Meals',
  //     key: 'id',
  //   },
  // },

});

export default HasRetreatMeals;
