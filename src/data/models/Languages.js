import DataType from 'sequelize';
import Model from '../sequelize';

const Languages = Model.define('RetreatLanguages', {

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

export default Languages; 