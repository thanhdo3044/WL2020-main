'use strict'
// const fs = require('fs')
module.exports = (sequelize, DataTypes) => {
    const PoVCN = sequelize.define('PoVCN', {
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
        strucre: {
            type: DataTypes.STRING,
            allowNull: true
        },
        stepId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        quantity: {
            type: DataTypes.DECIMAL(19, 6),
            allowNull: true
        },
        spSauDong: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        soLuongSauDong: {
            type: DataTypes.DECIMAL(19, 6),
            allowNull: true
        },
        spSauDong2: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        slSauDong2: {
            type: DataTypes.DECIMAL(19, 6),
            allowNull: true
        },
        spSauDong3: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        slSauDong3: {
            type: DataTypes.DECIMAL(19, 6),
            allowNull: true
        },
        slTruocDong: {
            type: DataTypes.DECIMAL(19, 6),
            allowNull: true
        },

        daThucHien: {
            type: DataTypes.DECIMAL(19, 6),
            allowNull: true
        },
        order: {
            type: DataTypes.INTEGER,
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
        factoryId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ngayDongGoi: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        size: {
            type: DataTypes.DECIMAL(19.6),
            allowNull: false,
        },
        sub: {
            type: DataTypes.DECIMAL(19.6),
            allowNull: false,
        },
        plus: {
            type: DataTypes.DECIMAL(19.6),
            allowNull: false,
        },
        customer: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        resources: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        keHoach: {
            type: DataTypes.DECIMAL(19, 6),
            allowNull: false
        },
        approvedByAccount: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        approvedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        approvedPKDAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        approvedPKDBy: {
            type: DataTypes.INTEGER,
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
        yeuCauKyThuat: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 0
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        createdBy: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        description: {
            allowNull: true,
            type: DataTypes.STRING
        },
        heSo: {
            allowNull: true,
            type: DataTypes.INTEGER
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        loaisp: {
            allowNull: true,
            type: DataTypes.STRING
        },
        po: {
            allowNull: true,
            type: DataTypes.STRING
        },
        dinhmuc: {
            allowNull: true,
            type: DataTypes.FLOAT
        },
        tamung: {
            allowNull: true,
            type: DataTypes.STRING
        },
    }, {
        tableName: 'Po',
        timestamps: true,
        paranoid: true,
        schema: 'vcn'
    });

    (async () => {
        // await Po.sync({
        //   alter: true
        // })
        // fs.writeFile('backups/Pos.json', JSON.stringify(data), function (err) {
        //   if (err) {
        //     console.log(err)
        //   }
        // })
    })()
    PoVCN.associate = function (models) {
        // associations can be defined here
        PoVCN.belongsTo(models.Account, {
            foreignKey: 'createdBy',as:'acc1'
        })
        PoVCN.belongsTo(models.Account, {
            foreignKey: 'approvedPKDBy',as:'acc2'
        })
        PoVCN.belongsTo(models.Account, {
            foreignKey: 'approvedByAccount',as:'acc3'
        })
        PoVCN.belongsTo(models.ItemVCN, {
            foreignKey: 'itemId',as:'ItemVCN'
        })
        PoVCN.belongsTo(models.ItemVCN, {
            foreignKey: 'spSauDong',as:'ItemDong'
        })
        PoVCN.belongsTo(models.ItemVCN, {
            foreignKey: 'spSauDong2',as:'ItemDong2'
        })
        PoVCN.belongsTo(models.ItemVCN, {
            foreignKey: 'spSauDong3',as:'ItemDong3'
        })
        PoVCN.belongsTo(models.Department, {
            foreignKey: 'stepId'
        })
        PoVCN.belongsTo(models.Customer, {
            foreignKey: 'customer'
        })
        // Po.belongsTo(models.Department, {
        //   foreignKey: 'stepId'
        // })
        // Po.belongsTo(models.NhapTonDauKy, {
        //   foreignKey: 'itemId',
        //   as: 'conTon'
        // })
    }
    return PoVCN
}