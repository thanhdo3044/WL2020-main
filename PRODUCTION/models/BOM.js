'use strict';
// const fs = require('fs')
// let rawdata = fs.readFileSync('../BACKUP/boms.json');
// let boms = JSON.parse(rawdata);
module.exports = (sequelize, DataTypes) => {
  const Bom = sequelize.define('Bom', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      field: 'ID'
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'ITEM_ID'
    },
    materialsId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'MATERIALS_ID'
    },
    factoryId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rate: {
      type: "MONEY",
      allowNull: true
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },factoryId: {
      allowNull: true,
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'BOM',
    schema: 'prod',
    timestamps: true,
  });
  Bom.associate = function (models) {
    // associations can be defined here
  };

  return Bom;
};