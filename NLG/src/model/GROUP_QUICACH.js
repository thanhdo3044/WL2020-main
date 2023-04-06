const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('GROUP_CODE', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
       
        name : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'NAME'
        },
        chankhackho : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'chankhackho'
        },
        tylechinhpham : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'tylechinhpham'
        },
    }, {
        tableName: 'GROUP_CODE',
        timestamps: false,
        schema: 'nlg',
    });
};