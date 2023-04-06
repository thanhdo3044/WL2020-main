"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class OrderMeta extends Model {
        static associate(models) {
            OrderMeta.belongsTo(models.Order, {
                foreignKey: {
                    name: "orderId"
                }
            });
        }
    }
    OrderMeta.init({
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        orderId: {
            allowNull: false,
            type: DataTypes.UUID
        },
        metaKey: {
            type: DataTypes.STRING
        },
        metaValue: {
            type: DataTypes.TEXT
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        dateStart: {
            allowNull: true,
            type: DataTypes.STRING
        },
        dateEnd: {
            allowNull: true,
            type: DataTypes.STRING
        },
        carId: {
            allowNull: true,
            type: DataTypes.INTEGER
        },
        fromLocation: {
            allowNull: true,
            type: DataTypes.STRING
        },
        toLocation: {
            allowNull: true,
            type: DataTypes.STRING
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        selection: {
            allowNull: true,
            type: DataTypes.STRING
        },
        fullName: {
            allowNull: true,
            type: DataTypes.STRING
        },
        timeRecruit: {
            allowNull: true,
            type: DataTypes.STRING
        },
        number: {
            allowNull: true,
            type: DataTypes.STRING
        },
        locationWork: {
            allowNull: true,
            type: DataTypes.STRING
        },
        description: {
            allowNull: true,
            type: DataTypes.STRING
        },
        kinhGui: {
            allowNull: true,
            type: DataTypes.STRING
        },
        soLuongDeXuat: {
            allowNull: true,
            type: DataTypes.INTEGER
        },
        soLuongCap: {
            allowNull: true,
            type: DataTypes.INTEGER
        },
        donViTinh: {
            allowNull: true,
            type: DataTypes.STRING
        },
        tenThietBiVP: {
            allowNull: true,
            type: DataTypes.STRING
        },
        STT: {
            allowNull: true,
            type: DataTypes.STRING
        },
        position: {
            allowNull: true,
            type: DataTypes.STRING
        },
        maNV: {
            allowNull: true,
            type: DataTypes.STRING
        },
        luongHienTai: {
            allowNull: true,
            type: DataTypes.STRING
        },
        luongDeXuat: {
            allowNull: true,
            type: DataTypes.STRING
        },
        thoiGianTangLuongGanNhat: {
            allowNull: true,
            type: DataTypes.DATE
        },
        fullName2: {
            allowNull: true,
            type: DataTypes.STRING
        },
        position2: {
            allowNull: true,
            type: DataTypes.STRING
        },
        maVT: {
            allowNull: true,
            type: DataTypes.STRING
        },
        tenVT: {
            allowNull: true,
            type: DataTypes.STRING
        },
        yeuCauKyThuat: {
            allowNull: true,
            type: DataTypes.STRING
        },
        xuatXu: {
            allowNull: true,
            type: DataTypes.STRING
        },
        mucDichSuDung: {
            allowNull: true,
            type: DataTypes.STRING
        },
        phoneNumber: {
            allowNull: true,
            type: DataTypes.STRING
        },
        department: {
            allowNull: true,
            type: DataTypes.STRING
        },
        department2: {
            allowNull: true,
            type: DataTypes.STRING
        },
        stepDepartment: {
            allowNull: true,
            type: DataTypes.STRING
        },
        lyDo: {
            allowNull: true,
            type: DataTypes.STRING
        },
        thoiGianMangThai: {
            allowNull: true,
            type: DataTypes.STRING
        },
        xinRaCong: {
            allowNull: true,
            type: DataTypes.STRING
        },
        quyCach: {
            allowNull: true,
            type: DataTypes.STRING
        },
        Tenbaoho: {
            allowNull: true,
            type: DataTypes.STRING
        },
        edit: {
            allowNull: true,
            type: DataTypes.INTEGER
        },
        date: {
            allowNull: true,
            type: DataTypes.STRING
        },
        work: {
            allowNull: true,
            type: DataTypes.STRING
        },
        total: {
            allowNull: true,
            type: DataTypes.STRING
        },
        hoursIn: {
            allowNull: true,
            type: DataTypes.STRING
        },
        hoursOut: {
            allowNull: true,
            type: DataTypes.STRING
        },
        statusRequests: {
            allowNull: true,
            type: DataTypes.INTEGER
        },

    }, {
        sequelize,
        modelName: "OrderMeta",
        schema: "eof"
    });
    // (async () => {
    //   await OrderMeta.sync({
    //     force: true
    //   });
    // })();

    return OrderMeta;
};