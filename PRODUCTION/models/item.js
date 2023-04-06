'use strict';
module.exports = (sequelize, DataTypes) => {
    const Item = sequelize.define('Item', {
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
        length: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'LENGTH'
        },
        width: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'WIDTH'
        },
        height: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'HEIGHT'
        },
        typeId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'TYPE_ID'
        },
        unitId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'UNIT_ID'
        },
        volumn: {
            type: DataTypes.FLOAT,
            allowNull: true,
            field: 'VOLUMN'
        },
        factoryId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'FACTORY_ID'
        },
        GOODS_TYPE: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'GOODS_TYPE'
        },
        heSo: {
            type: DataTypes.FLOAT,
            allowNull: true,
            field: 'heSo'
        }
    }, {
        tableName: 'ITEM',
        timestamps: false,
        schema: 'base',
    });
    Item.associate = function(models) {
        // associations can be defined here
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
    return Item;
};