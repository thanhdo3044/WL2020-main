const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('DELIVERY_PLAN', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        guid: {
            type: DataTypes.UUIDV4,
            allowNull: false,
            field: 'GUID',
            defaultValue: DataTypes.UUIDV4
        },
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'ITEM_ID'
        },
        quantity: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'QUANTITY'
        },
        onBoardDate: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'ON_BOARD_DATE'
        }
    }, {
        tableName: 'DELIVERY_PLAN',
        timestamps: false,
        schema: 'prod',
    });
};