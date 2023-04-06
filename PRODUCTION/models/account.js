'use strict'
const {
  Model
} = require('sequelize')
// const fs = require('fs')
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  };
  Account.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'ID'
    },
    guid: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'GUID',
      defaultValue: DataTypes.UUIDV4
    },
    account: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'ACCOUNT'
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'PASSWORD'
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'FIRST_NAME'
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'LAST_NAME'
    },
    active: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'ACTIVE'
    },
    typeUser: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'TYPE_USER'
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'ROLE_ID'
    },
    factoryId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'POSITION'
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    createBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'CREATE_BY'
    }
  }, {
    sequelize,
    modelName: 'Account',
    tableName: 'ACCOUNT',
    timestamps: true,
    schema: 'base'
  });
  // (async () => {
  //   // await Po.sync({
  //   //   alter: true
  //   // })
  //   const data = await Account.findAll({
  //     // where: {
  //     //   factoryId: 100002
  //     // },
  //     raw: true
  //   })
  //   fs.writeFile('backups/Accounts.json', JSON.stringify(data), function (err) {
  //     if (err) {
  //       console.log(err)
  //     }
  //   })
  // })()
  return Account
}
