const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('ITEM_VCN', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
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
        length: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'LENGTH'
        },
        width: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'WIDTH'
        },
        height: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'HEIGHT'
        },
        typeId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        unitId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        volumn: {
            type: DataTypes.FLOAT,
            allowNull: true,
            field: 'VOLUMN'
        },

    }, {
        tableName: 'ITEM',
        timestamps: false,
        schema: 'vcn',
    });
};