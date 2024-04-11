import DataType from 'sequelize';
import Model from '../sequelize';

const Diet = Model.define('Diet', {

  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement : true
  },

  dietName: {
    type: DataType.STRING,
  },

  isEnable: {
    type: DataType.BOOLEAN,
    defaultValue: true,
  },

});

export default Diet;
