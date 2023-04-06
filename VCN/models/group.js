'use strict';
module.exports = (sequelize, DataTypes) => {
    const Group = sequelize.define('Group', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
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
        tableName: 'group',
        timestamps: false,
        schema: 'vcn',
    });
    Group.associate = function(models) {
        models.Bom.belongsTo(models.Group, {
            foreignKey: 'groupId'
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
    return Group;
};