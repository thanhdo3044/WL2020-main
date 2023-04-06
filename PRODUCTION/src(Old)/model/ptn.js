const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('PTN', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        departmentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'DEPARTMENT_ID'
        },
        itemId: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'ITEM_ID'
        },
        time: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'TIME'
        },
        quantity: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'QUANTITY'
        }
    }, {
        tableName: 'PTN',
        timestamps: false,
        schema: 'prod',
    });
};