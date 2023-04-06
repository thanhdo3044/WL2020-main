'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class OpeningStock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  OpeningStock.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'DATE',
      defaultValue: sequelize.NOW
    },
    departmentId: {
      type: DataTypes.INTEGER,
      field: 'DEPARTMENT_ID',
      allowNull: false
    },
    itemId: {
      type: DataTypes.INTEGER,
      field: 'ITEM_ID',
      allowNull: false
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    daXuat: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    poId: {
      type: DataTypes.UUID,
      field: 'PO_ID',
      allowNull: true
    },
    createdBy: {
      type: DataTypes.INTEGER,
      field: 'CREATE_BY',
      allowNull: false
    },
    nguonPhoi: {
      type: DataTypes.STRING,
      field: 'nguonPhoi',
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: sequelize.NOW

    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    palletFull: {
      type: DataTypes.INTEGER,
      field: 'pallet_full',
      allowNull: true,
    },
    palletTop1: {
      type: DataTypes.INTEGER,
      field: 'pallet_top1',
      allowNull: true,
    },
    palletTop2: {
      type: DataTypes.INTEGER,
      field: 'pallet_top2',
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      field: 'description',
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      field: 'QUANTITY',
      allowNull: true
    },
    market_code: {
      type: DataTypes.STRING,
      field: 'market_code',
      allowNull: true
    },
    destination: {
      type: DataTypes.INTEGER,
      field: 'DESTINATION_ID',
      allowNull: true
    },
    selection: {
      type: DataTypes.INTEGER,
      field: 'SELECTION',
      allowNull: true
    },
    month: {
      type: DataTypes.INTEGER,
      field: 'MONTH',
      allowNull: true
    },
    week: {
      type: DataTypes.INTEGER,
      field: 'WEEK',
      allowNull: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      field: 'product_id',
      allowNull: true
    },
    detailed_id: {
      type: DataTypes.INTEGER,
      field: 'detailed_id',
      allowNull: true
    },
    quantity_au: {
      type: DataTypes.FLOAT,
      field: 'quantity_au',
      allowNull: true
    }

  }, {
    sequelize,
    modelName: 'OpeningStock',
    tableName: 'OPENING_STOCK',
    schema: 'prod'
  });
  return OpeningStock
}
