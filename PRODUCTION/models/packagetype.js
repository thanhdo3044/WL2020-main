'use strict';
module.exports = (sequelize, DataTypes) => {
  const PackageType = sequelize.define('PackageType', {
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
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imagesUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    typeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    active: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: "PACKAGE_TYPE",
    timestamps: false,
    schema: "prod",
    underscored: true
  });
  PackageType.associate = function (models) {
    // associations can be defined here
  };
  return PackageType;
};