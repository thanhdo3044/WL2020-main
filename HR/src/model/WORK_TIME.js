const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('WORK_TIME', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        guid: {
			type: DataTypes.UUIDV4,
			allowNull: false,
			field: 'GUID',
			defaultValue: DataTypes.UUIDV4
        },
        date : {
            type : Sequelize.DataTypes.DATE,
            allowNull : true,
            field : 'DATE'
        },
        shift : {
            type : Sequelize.DataTypes.STRING,
            allowNull : true,
            field : 'SHIFT'
        },
        departmentId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'DEPARTMENT_ID'
        },
        workers: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'WORKERS'
        },
        ot: {
            type: DataTypes.FLOAT,
            allowNull: true,
            field: 'OT'
        },
        createBy : {
            type : DataTypes.INTEGER,
            allowNull : true,
            field : 'CREATE_BY'
        },
        createDate : {
            type : DataTypes.DATE,
            allowNull : true,
            defaultValue : Sequelize.fn('GETDATE'),
            field : 'CREATE_DATE'
        }
    }, {
        tableName: 'WORK_TIME',
        timestamps: false,
        schema: 'hr',
    });
};