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
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.fn('GETDATE'),
            field: 'CREATED_AT'
        },
        createBy: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'CREATED_BY'
        },


        groupCode: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'GROUP_CODE'
        },
        HESO: {
            type: DataTypes.FLOAT,
            allowNull: true,
            field: 'HESO'
        },

    }, {
        tableName: 'HE_SO',
        timestamps: false,
        schema: 'nlg',
    });
};