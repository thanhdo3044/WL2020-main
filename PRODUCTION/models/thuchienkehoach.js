'use strict';
module.exports = (sequelize, DataTypes) => {
  const ThucHienKeHoach = sequelize.define('ThucHienKeHoach', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    parent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    stepId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    itemId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    counts: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    time: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    shift: {
      type: DataTypes.STRING,
      allowNull: true
    },
    week: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    market: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ton: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    soLuongUuTien: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    hanMucTon: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    soLuongCanSanXuat: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    root: {
      type: DataTypes.STRING,
      allowNull: true
    },
    number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    thoiGianThucHien: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    thoiGianCanSanXuat: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    caLamViec: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ngayLamViec: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    thoiGianBatDau: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    thoiGianCho: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    factor: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    ngayDongGoi: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    taoPhoi: {
      type: DataTypes.DATE,
      allowNull: true
    },
    capPhoi: {
      type: DataTypes.DATE,
      allowNull: true
    },
    keHoach: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    soLuongDat: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    loiCongDon: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    tableName: 'View_ThucHienKeHoach',
    timestamps: false,
    schema: 'dbo'
  });
  ThucHienKeHoach.associate = function (models) {
    // associations can be defined here
    ThucHienKeHoach.belongsTo(models.Item, {
      foreignKey: 'itemId'
    })
    ThucHienKeHoach.belongsTo(models.Department, {
      foreignKey: 'stepId'
    })
  };
  return ThucHienKeHoach;
};