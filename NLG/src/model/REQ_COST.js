const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('REQ_COST', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        no : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'REQNO'
        },
        createBy : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'CREATE_BY'
        },
        createAt : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'CREATED_AT'
        },
        approval : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'APPROVAL'
        },
        approvalBy : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'APPROVAL_BY'
        },
        approvalAt : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'APPROVAL_AT'
        },
        reason : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'REASON'
        },
        DEL_FLAG : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'DEL_FLAG'
        },
        updateBy : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'UPDATE_BY'
        },
        updateTime : {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'UPDATE_TIME'
        },
    }, {
        tableName: 'REQ_COST',
        timestamps: false,
        schema: 'nlg',
    });
};