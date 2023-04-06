const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
	return sequelize.define('ACCEPT', {
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
        goodsIssueId : {
            type : DataTypes.INTEGER,
            allowNull : true,
            field : 'GOODS_ISSUE_ID'
        },
        productId : {
            type : DataTypes.INTEGER,
            allowNull : true,
            field : 'PRODUCT_ID'
        },
        quantity : {
            type : "MONEY",
            allowNull : true,
            field : 'QUANTITY'
        },
        note : {
            type : DataTypes.STRING,
            allowNull : true,
            field : 'NOTE'
        }
	}, {
		tableName: 'GOODS_ISSUE_PRODUCT',
		timestamps: false,
		schema: 'lgt',
	});
};