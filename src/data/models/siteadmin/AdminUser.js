import DataType from 'sequelize';
import Model from '../../sequelize';
import bcrypt from 'bcrypt';

const AdminUser = Model.define('AdminUser', {

  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },

  email: {
    type: DataType.STRING(255),
    validate: { isEmail: true },
    allowNull: false,
  },

  password: {
    type: DataType.STRING,
    allowNull: false,
  },

  emailConfirmed: {
    type: DataType.BOOLEAN,
    defaultValue: false,
  },

  isSuperAdmin: {
    type: DataType.BOOLEAN,
    defaultValue: false,
  },

}, {

  indexes: [
    { fields: ['email'] },
  ],

});

AdminUser.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

export default AdminUser;
