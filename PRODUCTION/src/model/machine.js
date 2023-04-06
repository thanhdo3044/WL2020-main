const Sequelize = require('sequelize')
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('FactoryMachine', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'id'
        },
        guid: {
            type: DataTypes.UUIDV4,
            allowNull: false,
            field: 'GUID',
            defaultValue: DataTypes.UUIDV4
        },
        machineId: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'machineId'
        },
        NAME: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'NAME'
        },
        outputTheory: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'outputTheory'
        },
        md_h: {
            type: DataTypes.FLOAT,
            allowNull: true,
            field: 'md_h'
        },
        departmentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'departmentId'
        },
        numberWorker: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'numberWorker'
        },
        factoryId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'factoryId'
        }
    }, {
        tableName: 'FactoryMachine',
        timestamps: false,
        schema: 'prod',
    });
};