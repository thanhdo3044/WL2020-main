const Sequelize = require('sequelize')
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('PHIEUNHAPKHO', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        sophieu: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'SOPHIEU'
        },
        // month : {
        //     type: DataTypes.INTEGER,
        //     allowNull: true,
        //     field: 'MONTH'
        // },
        // year : {
        //     type: DataTypes.INTEGER,
        //     allowNull: true,
        //     field: 'YEAR'
        // },
        makho: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'MAKHO'
        },
        NHOMSP: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'NHOMSP'
        },
        MALOGONHAP: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'MALOGONHAP'
        },
        BIENSOXE: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'BIENSOXE'
        },
        createBy: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'CREATED_BY'
        },
        createDate: {
            type: DataTypes.STRING,
            allowNull: true,
            // defaultValue: Sequelize.fn('GETDATE'),
            field: 'CREATED_AT'
        },
        delFlag: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'DEL_FLAG'
        },
        ALLOWMODIFY: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'ALLOWMODIFY'
        },
        MANCC: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'MANCC'
        },
        ALLOWHACAP: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'ALLOWHACAP'
        },
        DONGIATB: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'DONGIATB'
        },
        ALLOWTINHTIEN: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'ALLOWTINHTIEN'
        },
        QC_STAFF: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'QC_STAFF'
        },
        // DONGIA_LOAI: {
        //     type: DataTypes.STRING,
        //     allowNull: true,
        //     field: 'DONGIA_LOAI'
        // },
        xuongxenang: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'XUONGXENANG'
        },
        ACTUALDATE: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'ACTUALDATE'
        },
        loaigo: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'LOAI_GO'
        },


    }, {
        tableName: 'PHIEUNHAPKHO',
        timestamps: false,
        schema: 'nlg',
    });
};