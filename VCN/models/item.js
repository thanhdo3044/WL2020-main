'use strict';
module.exports = (sequelize, DataTypes) => {
    const ItemVCN = sequelize.define('ItemVCN', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        length: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        width: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        height: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        typeId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'typeId'
        },
        unitId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'unitId'

        },
        active: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
        ,
        modifiedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        updatedAt: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        volumn: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        woodsType: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        recipeGroup: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        recipeBirch: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        recipeLVL: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        factoryId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    }, {
        tableName: 'ITEM',
        timestamps: false,
        schema: 'vcn',
    });
    ItemVCN.associate = function (models) {
    };
    (async () => {
        // try {
        //   await Item.sync({
        //     alter: true
        //   });
        // } catch (error) {
        //   console.log(error)
        // }

        // try {
        //   await Item.update({
        //     heso: 1
        //   }, {
        //     where: {}
        //   })
        // } catch (error) {
        //   console.log(error)
        // }
    })();
    return ItemVCN;
};