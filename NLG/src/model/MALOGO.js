const Sequelize = require('sequelize')
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('CHU_RUNG', {


        name: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'NAME'
        },
        thang: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'thang'
        },
        year: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'year'
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
        logotron: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'logotron'
        },
        logoxe: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'logoxe'
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
        Xuongxe: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'Xuongxe'
        },
        KL_GOTRON: {
            type: DataTypes.FLOAT,
            allowNull: true,
            field: 'KL_GOTRON'
        },
        MANCC: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'MANCC'
        },
        COST: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'COST'
        },

    }, {
        tableName: 'CHU_RUNG',
        timestamps: false,
        schema: 'nlg',
    });
};