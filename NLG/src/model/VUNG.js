const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('VUNG', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        code : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'MAVUNG'
        },
        name : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'TENVUNG'
        },
    }, {
        tableName: 'VUNG',
        timestamps: false,
        schema: 'nlg',
    });
};