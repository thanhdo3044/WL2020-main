'use strict';
module.exports = (sequelize, DataTypes) => {
    const Unit = sequelize.define('Unit', {
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
        factoryId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    }, {
        tableName: 'UNIT',
        timestamps: false,
        schema: 'base',
    });
    Unit.associate = function(models) {
        models.ItemVCN.belongsTo(models.Unit, {
            foreignKey: 'unitId'
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
    return Unit;
};