'use strict'
const {
  Model, Op
} = require('sequelize')
const moment = require('moment')
module.exports = (sequelize, DataTypes) => {
  class VGhiLoi100004 extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  };
  VGhiLoi100004.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    stepId: {
      type: DataTypes.INTEGER
    },
    market: {
      type: DataTypes.STRING
    },
    itemId: {
      type: DataTypes.INTEGER
    },
    loi: {
      type: DataTypes.DECIMAL(19, 6)
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'V_GhiLoi100004'
  })
  return VGhiLoi100004
}
