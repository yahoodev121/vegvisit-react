import DataType from 'sequelize';
import Model from '../sequelize';

const Meals = Model.define('Meals', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    mealType: {
        type: DataType.STRING,
        allowNull: false
    },

    mealIcon: {
        type: DataType.STRING,
        allowNull: false
    },
});

export default Meals;