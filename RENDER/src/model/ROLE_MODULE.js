const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('MODULE', {
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

        }
    }, {
        tableName: 'MODULE',
        timestamps: false,
        schema: 'base',
    });
};