'use strict';
module.exports = (sequelize, DataTypes) => {
    const Bom = sequelize.define('Bom', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        materialsId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        rate: {
            type: DataTypes.DECIMAL(16,9),
            allowNull: true,
        },
        groupId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        factoryId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        createdBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        updatedAt: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        modifyBy: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        deletedAt: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        tableName: 'BOM',
        timestamps: false,
        schema: 'vcn',
    });
    Bom.associate = function(models) {
        models.Bom.belongsTo(models.ItemVCN, {
            foreignKey: 'itemId',as:'item'
        })        
        models.Bom.belongsTo(models.ItemVCN, {
            foreignKey: 'materialsId',as:'materials'
        })        
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
    return Bom;
};