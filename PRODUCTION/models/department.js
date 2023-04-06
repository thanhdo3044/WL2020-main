'use strict'
module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'ID'
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'TYPE'
    },
    type2: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'TYPE2'
    },
    parentId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'PARENT_ID'
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'CODE'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'NAME'
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'ORDER'
    },
    caLamViec: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'DEPARTMENT',
    timestamps: false,
    schema: 'base'
  })

  // Department.associate = function (models) {
  //   // associations can be defined here
  //   Department.hasMany(models.Po, {
  //     foreignKey: 'stepId'
  //   })
  // };
  // return Department;
  // (async () => {
  //   await Department.sync({
  //     alter: true
  //   });
  //   // let pro = new ProductProduct();
  //   // console.log(pro)
  // })();
  return Department
}
