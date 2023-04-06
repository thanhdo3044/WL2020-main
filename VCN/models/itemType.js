'use strict';
module.exports = (sequelize, DataTypes) => {
    const ItemType = sequelize.define('ItemType', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        code: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'CODE'

        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'NAME'

        },
        sort: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    }, {
        tableName: 'ITEM_TYPE',
        timestamps: false,
        schema: 'vcn',
    });
    ItemType.associate = function(models) {
        models.ItemVCN.belongsTo(models.ItemType, {
            foreignKey: 'typeId'
        })      
        // models.ItemType.belongsTo(models., {
        // })        
    };
    (async() => {
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
    return ItemType;
};