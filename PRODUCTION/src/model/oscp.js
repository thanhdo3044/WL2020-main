const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('OSCP', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        guid: {
            type: DataTypes.UUIDV4,
            allowNull: false,
            field: 'GUID',
            defaultValue: DataTypes.UUIDV4
        },
        departmentId: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'DEPARTMENT_ID'
        },
        itemId: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'ITEM_ID'
        },
        tenMay: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'TEN_MAY'
        },
        soCongNhan: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'SO_CONG_NHAN'
        },
        thoiGianHoanThanhChiTiet: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'THOI_GIAN_HOAN_THANH_CHI_TIET'
        },
        soCongLaoDongTrenChuKy: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'SO_CONG_LAO_DONG_TREN_CHU_KY'
        },
        tongThoiGianChuKy: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'TONG_THOI_GIAN_CHU_KY'
        },
        congSuatMay: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'CONG_SUAT_MAY'
        },
        dienNangTrenChuKy: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'DIEN_NANG_TREN_CHU_KY'
        },
        tonKhoCongDoan: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'TON_KHO_CONG_DOAN'
        },
        thoiGianVanChuyen: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'THOI_GIAN_VAN_CHUYEN'
        },
    }, {
        tableName: 'OSCP',
        timestamps: false,
        schema: 'prod',
    });
};