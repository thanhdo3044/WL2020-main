const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('BANGGIANVL', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        maSP: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'MASP'
        },
        cost : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'COST'
        },
        modifyDate : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'UPDATE_DATE'
        },
        createBy : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'INSERT_BY'
        },
        useFLAG : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'USE_FLAG'
        },
        vung : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'VUNG'
        },
        reqNo : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'REQNO'
        },
        applyDate : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'APPLY_DATE'
        },
    }, {
        tableName: 'BANGGIANVL',
        timestamps: false,
        schema: 'nlg',
    });
};