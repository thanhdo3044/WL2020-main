const Sequelize = require('sequelize')
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('RUNG', {


        name: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'NAME'
        },
        Xa: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'Xa'
        },
        Tinh: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'Tinh'
        },


        createBy: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'INSERT_BY'
        },
        createDate: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: Sequelize.fn('GETDATE'),
            field: 'INSERT_TIME'
        },
        modifyBy: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'UPDATE_BY'
        },
        modifyDate: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'UPDATE_TIME'
        },
        SOCHUNGCHI: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'SOCHUNGCHI'
        },

    }, {
        tableName: 'RUNG',
        timestamps: false,
        schema: 'nlg',
    });
};