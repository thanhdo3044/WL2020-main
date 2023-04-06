'use strict';
module.exports = (sequelize, DataTypes) => {
  const Kiln = sequelize.define('Kiln', {
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
    factoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    stepId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: "Kiln",
    timestamps: false,
    schema: "prod",
    underscored: true
  });
  Kiln.associate = function (models) {
    // associations can be defined here
  };
  // (async () => {
  //   await Market.sync({
  //     force: true,
  //   });
  // })
  return Kiln;
};