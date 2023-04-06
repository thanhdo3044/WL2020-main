const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('NLGO', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        ma: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'MANVL'
        },
        ten : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'TENNVL'
        },
        troGia : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'TROGIA'
        },
        tenChiTiet : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'TENCHITIET'
        },
        day : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'DAY'
        },
        rong : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'RONG'
        },
        cao : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'CAO'
        },
        loai : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'LOAI'
        },
        nhom : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'NHOM'
        },
        phanLoai : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'PHANLOAI'
        },
        maNguyenVatLieu : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'MANVLKHO'
        },
    }, {
        tableName: 'NLGO',
        timestamps: false,
        schema: 'nlg',
    });
};