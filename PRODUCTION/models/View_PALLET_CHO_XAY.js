/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
    const ViewPalletChoSay = sequelize.define('ViewPalletChoSay', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            field: 'ID'
        },
        code: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'CODE'
        },
        year: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'YEAR'
        },
        week: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'WEEK'
        },
        NUMBER: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'NUMBER'
        },
        createBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'CREATE_BY'
        },
        createDate: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'CREATE_DATE'
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'LAST_NAME'
        },
        VERIFY_BY: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'VERIFY_BY'
        },
        TYPE_NAME: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'NAME'
        }
        

    }, {
        tableName: 'View_PALLET_CHO_XAY',
        timestamps: false
    });

    ViewPalletChoSay.associate = function (models) {
        // Coc hasMany CocInfo
        ViewPalletChoSay.hasMany(models.ViewItemInPallet, {
            foreignKey: 'PALLET_ID'
        })
    };

    return ViewPalletChoSay
};