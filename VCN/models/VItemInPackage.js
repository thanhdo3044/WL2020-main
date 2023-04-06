'use strict'
const {
    Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class VItemInPackageVCN extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            VItemInPackageVCN.belongsTo(models.ItemVCN, {
                foreignKey: 'itemId', as:'Item'
            })
        }
    };
    VItemInPackageVCN.init({
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
            quantity: {
                type: DataTypes.FLOAT
            },
            code: {
                type: DataTypes.UUID
            },
            number: {
              type: DataTypes.STRING
            },
            createdAt: {
                type: DataTypes.DATE
            },
            createdAt2: {
                type: DataTypes.DATE
            },
            updatedAt: {
                allowNull: true,
                type: DataTypes.DATE
            }
        }, {
            sequelize,
            modelName: 'VItemInPackageVCN',
            tableName: 'View_ItemInPackagesVCN',
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
    return VItemInPackageVCN
}