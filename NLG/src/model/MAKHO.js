const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('MAKHO', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        makho: {
            type: DataTypes.UUIDV4,
            allowNull: false,
            field: 'MAKHO',
            defaultValue: DataTypes.UUIDV4
        },
        tenkho : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'TENKHO'
        },
        nguoitao : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'CREATED_BY'
        },
        ngaytao : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'CREATED_AT'
        },
        
        DEL_FLAG : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'DEL_FLAG'
        },
        type : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'TYPE'
        },
        thukho: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'THUKHO'
        },
        
        
       
        
    }, {
        tableName: 'MAKHO',
        timestamps: false,
        schema: 'nlg',
    });
};