import DataType from 'sequelize';
import Model from '../sequelize';

const UserDiets = Model.define('UserDiets', {

  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement : true
  },

  userId: {
    type: DataType.UUID,
    allowNull: false
  },

  dietId: {
    type: DataType.INTEGER,
    allowNull: false
  }

});

export default UserDiets;
