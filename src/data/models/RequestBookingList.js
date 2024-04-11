import DataType from 'sequelize';
import Model from '../sequelize';

const RequestBookingList = Model.define('RequestBookingList', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    listId: {
        type: DataType.INTEGER,
    },

    host: {
        type: DataType.STRING,
        allowNull: false
    },

    guest: {
        type: DataType.STRING,
        allowNull: false
    }, 

    checkInStart: {
    type: DataType.DATE,
    },

    checkInEnd: {
    type: DataType.DATE,
    },

});

export default RequestBookingList;