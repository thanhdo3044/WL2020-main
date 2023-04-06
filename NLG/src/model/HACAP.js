const Sequelize = require('sequelize')
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('HACAP', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        id_dt: {
            type: DataTypes.INTEGER,
            allowNull: true,

            field: 'ID_DT'
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'TYPE'
        },
        DAY: {
            type: DataTypes.INTEGER,
            allowNull: true,

            field: 'DAY'
        },
        RONG: {
            type: DataTypes.INTEGER,
            allowNull: true,

            field: 'RONG'
        },
        CAO: {
            type: DataTypes.INTEGER,
            allowNull: true,

            field: 'CAO'
        },
        note: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'NOTE'
        },
        delFlag: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'DEL_FLAG'
        },

        createBy: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'CREATED_BY'
        },
        createDate: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.fn('GETDATE'),
            allowNull: true,
            field: 'CREATED_AT'
        },
        sothanh: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'SOTHANH'
        },
        manvl: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'MANVL'
        },
        DONGIA_CTY: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'DONGIA_CTY'
        },

        DONGIA_LOAI: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'DONGIA_LOAI'
        },
        updateat: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'UPDATED_AT'
        },
        gapDoi: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'GAPDOI'
        },

        quicach: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'CODE'
        },
    }, {
        tableName: 'HACAP',
        timestamps: false,
        schema: 'nlg',
    });
};