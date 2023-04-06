const Sequelize = require('sequelize')
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('HandleQc', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        stepId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        packageId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        factoryId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        updatedAt: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        deletedBy: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        modifiedBy: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        tableName: 'HandleQc',
        timestamps: false,
        schema: 'prod',
    });
};