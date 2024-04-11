import DataType from 'sequelize';
import Model from '../sequelize';

const Areas = Model.define('Areas', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: DataType.STRING,
        allowNull: false
    },

});

export default Areas; 