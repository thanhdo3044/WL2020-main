const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('TYPE_HACAP', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        typeName : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'TYPENAME'
        },
        bgColor: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'BGCOLOR'
        },
        icon: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'ICON'
        },
    }, {
        tableName: 'TYPE_HACAP',
        timestamps: false,
        schema: 'nlg',
    });
};