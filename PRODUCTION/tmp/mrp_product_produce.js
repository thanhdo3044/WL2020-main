/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('mrpProductProduce', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		serial: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			field: 'serial'
		},
		productionId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'mrp_production',
				key: 'id'
			},
			field: 'production_id'
		},
		productId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'product_product',
				key: 'id'
			},
			field: 'product_id'
		},
		qtyProducing: {
			type: DataTypes.DOUBLE,
			allowNull: true,
			field: 'qty_producing'
		},
		productUomId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'uom_uom',
				key: 'id'
			},
			field: 'product_uom_id'
		},
		consumption: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'consumption'
		},
		createUid: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'res_users',
				key: 'id'
			},
			field: 'create_uid'
		},
		createDate: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'create_date'
		},
		writeUid: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'res_users',
				key: 'id'
			},
			field: 'write_uid'
		},
		writeDate: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'write_date'
		},

	}, {
		tableName: 'mrp_product_produce'
	});
};