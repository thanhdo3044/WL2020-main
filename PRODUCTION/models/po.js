'use strict'
// const fs = require('fs')
module.exports = (sequelize, DataTypes) => {
    const Po = sequelize.define('Po', {
        id: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.INTEGER
        },
        guid: {
            type: DataTypes.UUID,
            allowNull: true,
            defaultValue: DataTypes.UUIDV4
        },
        code: {
            type: DataTypes.UUID,
            allowNull: true,
            defaultValue: DataTypes.UUIDV4
        },
        parent: {
            type: DataTypes.UUID,
            allowNull: true
        },
        fromPo: {
            type: DataTypes.UUID,
            allowNull: true
        },
        stepId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Next_stepId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        itemId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        quantity: {
            type: DataTypes.DECIMAL(19, 6),
            allowNull: true
        },
        counts: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        time: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        shift: {
            type: DataTypes.STRING,
            allowNull: true
        },
        week: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        market: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ton: {
            type: DataTypes.DECIMAL(19, 6),
            allowNull: true
        },
        soLuongUuTien: {
            type: DataTypes.DECIMAL(19, 6),
            allowNull: false,
            defaultValue: 0
        },
        hanMucTon: {
            type: DataTypes.DECIMAL(19, 6),
            allowNull: false,
            defaultValue: 0
        },
        soLuongCanSanXuat: {
            type: DataTypes.DECIMAL(19, 6),
            allowNull: false,
            defaultValue: 0
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        root: {
            type: DataTypes.STRING,
            allowNull: true
        },
        number: {
            type: DataTypes.STRING,
            allowNull: true
        },
        thoiGianThucHien: {
            type: DataTypes.DECIMAL(19, 6),
            allowNull: true
        },
        thoiGianCanSanXuat: {
            type: DataTypes.DECIMAL(19, 6),
            allowNull: true
        },
        caLamViec: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        factoryId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ngayLamViec: {
            type: DataTypes.DECIMAL(19, 6),
            allowNull: true
        },
        thoiGianBatDau: {
            type: DataTypes.DECIMAL(19, 6),
            allowNull: true
        },
        thoiGianCho: {
            type: DataTypes.DECIMAL(19, 6),
            allowNull: true
        },
        factor: {
            type: DataTypes.DECIMAL(19, 6),
            allowNull: true
        },
        ngayDongGoi: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        taoPhoi: {
            type: DataTypes.DATE,
            allowNull: true
        },
        capPhoi: {
            type: DataTypes.DATE,
            allowNull: true
        },
        keHoach: {
            type: DataTypes.DECIMAL(19, 6),
            allowNull: false
        },
        daNhanTon: {
            type: DataTypes.INTEGER
        },
        approvedByAccount: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        approvedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        endPO: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        loiCongDon: {
            type: DataTypes.DECIMAL(19, 6),
            allowNull: false,
            defaultValue: 0
        },
        xuatTon: {
            type: DataTypes.DECIMAL(19, 6),
            allowNull: false,
            defaultValue: 0
        },
        namhong: {
            type: DataTypes.DECIMAL(19, 6),
            allowNull: false,
            defaultValue: 0
        },
        th: {
            type: DataTypes.DECIMAL(19, 6),
            allowNull: false,
            defaultValue: 0
        },
        ys1a: {
            type: DataTypes.DECIMAL(19, 6),
            allowNull: false,
            defaultValue: 0
        },
        ys1b: {
            type: DataTypes.DECIMAL(19, 6),
            allowNull: false,
            defaultValue: 0
        },
        tb: {
            type: DataTypes.DECIMAL(19, 6),
            allowNull: false,
            defaultValue: 0
        },
        goodsType: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Reason: {
            type: DataTypes.STRING,
            allowNull: true
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        KH_approvedByAccount: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        KH_approvedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        createBy: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'PO',
        timestamps: true,
        paranoid: true,
        schema: 'prod'
    });

    (async() => {
        // await Po.sync({
        //   alter: true
        // })
        // fs.writeFile('backups/Pos.json', JSON.stringify(data), function (err) {
        //   if (err) {
        //     console.log(err)
        //   }
        // })
    })()
    Po.associate = function(models) {
        // associations can be defined here
        Po.belongsTo(models.Item, {
            foreignKey: 'itemId'
        })
        Po.hasMany(models.VItemInPackage, { sourceKey: 'code', foreignKey: 'code' })
        Po.belongsTo(models.Department, {
                foreignKey: 'stepId'
            })
            // Po.belongsTo(models.Department, {
            //   foreignKey: 'stepId'
            // })
            // Po.belongsTo(models.NhapTonDauKy, {
            //   foreignKey: 'itemId',
            //   as: 'conTon'
            // })
        Po.belongsTo(models.Market, {
            foreignKey: 'market',
            targetKey: 'code'
        })
        Po.belongsTo(models.Po, {
            as: 'HomePo',
            foreignKey: 'parent',
            targetKey: 'code'
        })
    }
    return Po
}