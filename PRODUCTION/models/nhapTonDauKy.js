'use strict';
const {
    Model,
    Op
} = require('sequelize')
const moment = require('moment')
module.exports = (sequelize, DataTypes) => {
    class NhapTonDauKy extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    NhapTonDauKy.init({
        itemId: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER
        },
        stepId: {
            type: DataTypes.INTEGER
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        quantity: {
            type: DataTypes.FLOAT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'View_TonDauKy',
        schema: 'dbo',
        timestamps: false,
        tableName: 'View_TonDauKy'
    });
    return NhapTonDauKy;
};