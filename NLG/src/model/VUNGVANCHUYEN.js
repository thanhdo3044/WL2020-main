const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('VUNGVANCHUYEN', {
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
        heSoNhan : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'HESONHAN'
        },
        DEL_FLAG : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'DEL_FLAG'
        },

    }, {
        tableName: 'VUNGVANCHUYEN',
        timestamps: false,
        schema: 'nlg',
    });
};