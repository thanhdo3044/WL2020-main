const Sequelize = require('sequelize')
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('DINH_MUC_KHO', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        createDate: {
            type: DataTypes.STRING,
            allowNull: true,
            //defaultValue: Sequelize.fn('GETDATE'),
            field: 'CREATED_AT'
        },
        createBy: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'CREATE_BY'
        },

        mancc: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'MANCC'
        },
        groupCode: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'GROUP_CODE'
        },
        quantity: {
            type: DataTypes.FLOAT,
            allowNull: true,
            field: 'PLANQTY'
        },
    }, {
        tableName: 'PLAN_WEEK',
        timestamps: false,
        schema: 'nlg',
    });
};