import DataType from "sequelize";
import Model from "../sequelize";

const Categories = Model.define("RetreatCategories", {
  id: {
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },

  name: {
    type: DataType.STRING,
    allowNull: false,
  },

  parentId: {
    type: DataType.INTEGER,
    allowNull: false,
  },

  eventType: {
    type: DataType.STRING,
    allowNull: false,
  },
});

export default Categories;
