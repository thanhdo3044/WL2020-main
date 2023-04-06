/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	const Pallet = sequelize.define('Pallet', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			field: 'ID'
		},
		guid: {
			type: DataTypes.UUID,
			allowNull: false,
			field: 'GUID'
		},
		code: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'CODE'
		},
		number: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'NUMBER'
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
		typeId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'TYPE_ID'
		},
		parcel: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'PARCEL'
		},
		woodTypeId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'WOOD_TYPE_ID'
		},
		productionOrdersId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'PRODUCTION_ORDERS_ID'
		},
		env: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'ENV'
		},
		vendorId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'VENDOR_ID'
		},
		customerId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'CUSTOMER_ID'
		},
		glue: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'GLUE'
		},
		chemistry: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'CHEMISTRY'
		},
		ikeaCode: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'IKEA_CODE'
		},
		ikeaGuid: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'IKEA_GUID'
		},
		projectProductId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'PROJECT_PRODUCT_ID'
		},
		createBy: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'CREATE_BY'
		},
		createDate: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'CREATE_DATE'
		},
		modifyBy: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'MODIFY_BY'
		},
		modifyDate: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'MODIFY_DATE'
		},
		productionOrders: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'PRODUCTION_ORDERS'
		},
		receiptId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'RECEIPT_ID'
		}
	}, {
		tableName: 'PALLET',
		timestamps: false,
		schema: 'prod'
	});

	Pallet.associate = function (models) {
		// Coc hasMany CocInfo
		Pallet.hasMany(models.ViewItemInPallet, {
			foreignKey: 'PALLET_ID'
		})
	};

	return Pallet
};