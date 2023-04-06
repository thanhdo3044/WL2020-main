'use strict';
module.exports = (sequelize, DataTypes) => {
    const PackageType = sequelize.define('PackageType', {
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
        typeId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'TYPE_ID'
        },
        active: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'ACTIVE'
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'DESCRIPTION'
        }
    }, {
        tableName: 'PACKAGE_TYPE',
        timestamps: false,
        schema: 'vcn',
    });
    PackageType.associate = function(models) {       
    };
    return PackageType;
};