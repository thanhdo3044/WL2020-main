const Sequelize = require('sequelize')
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('PHIEUNHAPKHO_DT', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        sophieunhap: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'SOPHIEUNHAP'
        },

        DAY: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'DAY'
        },
        RONG: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'RONG'
        },
        CAO: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'CAO'
        },
        sobo: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'SOBO'
        },
        sothanh_bo: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'SOTHANH_BO'
        },
        note: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'NOTE'
        },
        createBy: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'CREATED_BY'
        },
        createDate: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.fn('GETDATE'),
            field: 'CREATED_AT'
        },
        qc_inspector: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'QC_INSPECTOR'
        },
        delFlag: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'DEL_FLAG'
        },
        delai: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'DELAI'
        },
        SAMPLEQTY: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'SAMPLEQTY'
        },
        QTY: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'QTY'
        },
        MANVL: {
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
        NOTEHACAP: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'NOTEHACAP'
        },
        CODE: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'CODE'
        },
        KLQC: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'KLQC'
        },
        DONGIA_TB: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'DONGIA_TB'
        },
        CODENHOM: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'CODENHOM'
        },
        SOPHIEUTRAVE: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'SOPHIEUTRAVE'
        },

        OVER_PLAN: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'OVER_PLAN'
        },
        khacKho: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'khacKho'
        },
        longit: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'longit'
        },
        vuotkho: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'vuotkho'
        },
        MALOGONHAP: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'MALOGONHAP'
        },
        PALLET: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'PALLET'
        },
    }, {
        tableName: 'PHIEUNHAPKHO_DT',
        timestamps: false,
        schema: 'nlg',
    });
};