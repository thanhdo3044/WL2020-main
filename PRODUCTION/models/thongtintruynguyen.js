'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ThongTinTruyNguyen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ThongTinTruyNguyen.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    suppliesId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    supplies: {
      type: DataTypes.STRING,
      allowNull: true
    },
    quantity: {
      type: "MONEY",
      allowNull: true
    },
    vendorId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    vendor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    parcel: {
      type: DataTypes.STRING,
      allowNull: true
    },
    po: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

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
    volumn: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'VOLUMN'
    },
    departmentName: DataTypes.STRING,
    sanPham: DataTypes.STRING,
    number: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'ThongTinTruyNguyen',
    tableName: 'View_ThongTinTruyNguyen',
    timestamps: false,
    schema: 'dbo'
  });
  return ThongTinTruyNguyen;
};