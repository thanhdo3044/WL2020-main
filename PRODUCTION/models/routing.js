'use strict'
module.exports = (sequelize, DataTypes) => {
  const Routing = sequelize.define('Routing', {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'ITEM_ID'
    },
    stepId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'STEP_ID'
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'ORDER'
    },
    createBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'CREATE_BY'
    },
    modifyBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'MODIFY_BY'
    },
    // thoiGianThucHien: {
    //   type: DataTypes.FLOAT,
    //   allowNull: true
    // },
    // soNguoiThucHien: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true
    // },
    // donGia: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   defaultValue: 0
    // },
    factoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: 'ROUTING',
    timestamps: false,
    schema: 'prod'
  })
  Routing.associate = function (models) {
    // associations can be defined here
  }

  return Routing
}
