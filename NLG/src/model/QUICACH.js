const Sequelize = require('sequelize')
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('BOM', {
        code: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'CODE'
        },
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        // guid: {
        //     type: DataTypes.UUIDV4,
        //     allowNull: false,
        //     field: 'GUID',
        //     defaultValue: DataTypes.UUIDV4
        // },

        name: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'NAME'
        },
        dai: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'DAI'
        },
        rong: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'RONG'
        },
        day: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'DAY'
        },
        KLQC: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'KLQC'
        },
        nhom: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'NHOM'
        },
        phanloai: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'PHANLOAI'
        },
        useFLAG: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'USEFLAG'
        },
        dacbiet: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'DACBIET'
        },
        INSERT_BY: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'INSERT_BY'
        },
        VUOTNCC: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'VUOTNCC'
        },
        GROUP_QC: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'GROUP_QC'
        },
    }, {
        tableName: 'BOM',
        timestamps: false,
        schema: 'nlg',
    });
};