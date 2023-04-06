'use strict';
module.exports = (sequelize, DataTypes) => {
  const Market = sequelize.define('Market', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    guid: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    productId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: "MARKET",
    timestamps: true,
    schema: "base",
    underscored: true,
    timestamps: false
  });
  Market.associate = function (models) {
    // associations can be defined here
  };
  // return Market;
  return Market;
};