'use strict';
module.exports = (sequelize, DataTypes) => {
    const Routing = sequelize.define('Routing', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        stepId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        order: {
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
        tableName: 'ROUTING',
        timestamps: false,
        schema: 'vcn',
    });
    Routing.associate = function(models) {
        models.Routing.belongsTo(models.ItemVCN, {
            foreignKey: 'itemId'
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
    return Routing;
};