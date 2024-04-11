import DataType from 'sequelize';
import Model from '../sequelize';

const UserServices = Model.define('UserServices', {

  id: {
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement : true
  },

  listId: {
    type: DataType.INTEGER,
    allowNull: false
  },

  serviceId: {
    type: DataType.INTEGER,
    allowNull: false
  }

});

export default UserServices;