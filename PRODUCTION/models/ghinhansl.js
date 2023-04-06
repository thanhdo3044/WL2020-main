'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GhiNhanSL extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  GhiNhanSL.init({
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    QUANTITY: {
      type: "MONEY",
      allowNull: true
    },

    itemName: DataTypes.STRING,
    length: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'LENGTH'
    },
    width: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'WIDTH'
    },
    height: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'HEIGHT'
    },
    tongKL: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    departmentName: DataTypes.STRING,
    departmentName2: DataTypes.STRING,
    groupName: DataTypes.STRING,
    groupDepartment: DataTypes.STRING,
    sanPham: DataTypes.STRING,
    createDate: DataTypes.DATE,
    departmentId: {
      type: DataTypes.STRING,
      field: 'departmentId'
    }

  }, {
    sequelize,
    modelName: 'GhiNhanSL',
    tableName: 'View_SanLuong',
    timestamps: false,
  });
  return GhiNhanSL;
};