import DataType from 'sequelize';
import Model from '../sequelize';

const ListingRetreatCategory = Model.define('ListingRetreatCategory', {

    id: {
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    listId: {
        type: DataType.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
            model: 'Listing',
            key: 'id',
        },
    },

    category: {
        type: DataType.STRING,
    },

    subCategory: {
        type: DataType.STRING,
    },
});

export default ListingRetreatCategory;
