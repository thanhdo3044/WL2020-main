const Sequelize = require('sequelize')
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('PLAN_NLG', {
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
        // month : {
        //     type: DataTypes.INTEGER,
        //     allowNull: true,
        //     field: 'MONTH'
        // },
        // year : {
        //     type: DataTypes.INTEGER,
        //     allowNull: true,
        //     field: 'YEAR'
        // },
        mancc: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'MANCC'
        },
        quantity: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'PLANQTY'
        },
        createBy: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'CREATE_BY'
        },
        createDate: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.fn('GETDATE'),
            field: 'CREATED_AT'
        },
        groupCode: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'GROUP_CODE'
        },
        delFlag: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'DEL_FLAG'
        },
        note: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'NOTE'
        },
        kho: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'KHO'
        },
        VUOTNCC: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'VUOTNCC'
        },
    }, {
        tableName: 'PLAN_NLG',
        timestamps: false,
        schema: 'nlg',
    });
};