'use strict'
const {
    Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class VItemInPackage extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            VItemInPackage.belongsTo(models.Item, {
                foreignKey: 'itemId'
            })
        }
    };
    VItemInPackage.init({
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            // packageId: {
            //   type: DataTypes.INTEGER
            // },
            itemId: {
                type: DataTypes.INTEGER
            },
            accountId: {
                type: DataTypes.INTEGER
            },
            accountId2: {
                type: DataTypes.INTEGER
            },
            stepId1: {
                type: DataTypes.INTEGER
            },
            stepId2: {
                type: DataTypes.INTEGER
            },
            gio: {
                type: DataTypes.INTEGER
            },
            phut: {
                type: DataTypes.INTEGER
            },
            giay: {
                type: DataTypes.INTEGER
            },
            gioNhan: {
                type: DataTypes.INTEGER
            },
            phutNhan: {
                type: DataTypes.INTEGER
            },
            giayNhan: {
                type: DataTypes.INTEGER
            },
            quantity: {
                type: DataTypes.FLOAT
            },
            code: {
                type: DataTypes.UUID
            },
            pallet: {
              type: DataTypes.STRING
            },
            SL_PALLET: {
                type: DataTypes.INTEGER
            },
            createdAt: {
                type: DataTypes.DATE
            },
            updatedAt: {
                allowNull: true,
                type: DataTypes.DATE
            }
        }, {
            sequelize,
            modelName: 'VItemInPackage',
            tableName: 'View_ItemInPackages',
            timestamps: false
        })
        // (async () => {
        //   const data = await VItemInPackage.findAll({
        //     where: {
        //       code: '75c98f33-edeb-4d8e-952f-80e365ce8912'
        //     },
        //     raw: true
        //   })
        //   console.log(data)
        // })()
    return VItemInPackage
}