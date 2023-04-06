const Sequelize = require('sequelize')
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('PROVIDERS', {
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
        address: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'ADDRESS'
        },
        staff: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'STAFF'
        },
        DEL_FLAG: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'DEL_FLAG'
        },
        vung: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'VUNG'
        },
        vung2: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'VUNG2'
        },
        COHD: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'COHD'
        },
        COC: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'COC'
        },
        createBy: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'INSERT_BY'
        },
        createDate: {
            type: DataTypes.STRING,
            allowNull: true,
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
        MX: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'MX'
        },
    }, {
        tableName: 'PROVIDERS',
        timestamps: false,
        schema: 'nlg',
    });
};