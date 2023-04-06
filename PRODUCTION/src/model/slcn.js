const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('SLCN', {
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
        workerId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'WORKER_ID'
        },
        machineId: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'MACHINE_ID'
        },
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'ITEM_ID'
        },
        dateOn: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'DATE_ON'
        },
        dateOff: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'DATE_OFF'
        },
        quantity: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'QUANTITY'
        }
    }, {
        tableName: 'SLCN',
        timestamps: false,
        schema: 'prod',
    });
};