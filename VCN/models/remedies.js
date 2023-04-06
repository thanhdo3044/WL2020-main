'use strict';
module.exports = (sequelize, DataTypes) => {
    const Remedies = sequelize.define('Remedies', {
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
        }
    }, {
        tableName: 'REMEDIES',
        timestamps: false,
        schema: 'vcn',
    });
    Remedies.associate = function(models) {       
    };
    return Remedies;
};