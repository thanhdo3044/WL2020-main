/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('ViewItemInPallet', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            field: 'ID'
        },
        palletId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'PALLET_ID'
        },
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'ITEM_ID'
        },
        name: {
            type: DataTypes.STRING,
            field: 'NAME'
        },
        quantity: {
            type: "MONEY",
            allowNull: true,
            field: 'QUANTITY'
        },
        volumn: {
            type: DataTypes.FLOAT,
            allowNull: true,
            field: 'VOLUMN'
        },
        khoiLuong: {
            type: DataTypes.FLOAT,
            allowNull: true,
            field: 'khoiLuong'
        },
        height: {
            type: DataTypes.FLOAT,
            allowNull: true,
            field: 'HEIGHT'
        },
        length: {
            type: DataTypes.FLOAT,
            allowNull: true,
            field: 'LENGTH'
        },
        width: {
            type: DataTypes.FLOAT,
            allowNull: true,
            field: 'WIDTH'
        }

    }, {
        tableName: 'View_ITEM_IN_PALLET',
        timestamps: false,
    });
};