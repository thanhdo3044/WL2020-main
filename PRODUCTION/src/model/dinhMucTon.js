const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('DINH_MUC_TON', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        departmentId: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'DEPARTMENT_ID'
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
    }, {
        tableName: 'DINH_MUC_TON',
        timestamps: false,
        schema: 'prod',
    });
};