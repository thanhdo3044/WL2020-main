/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('mrpProductProduceLine', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'id'
		},
		rawProductProduceId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'mrp_product_produce',
				key: 'id'
			},
			field: 'raw_product_produce_id'
		},
		finishedProductProduceId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'mrp_product_produce',
				key: 'id'
			},
			field: 'finished_product_produce_id'
		},

		productId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'product_product',
				key: 'id'
			},
			field: 'product_id'
		},
		qtyToConsume: {
			type: DataTypes.DOUBLE,
			allowNull: true,
			field: 'qty_to_consume'
		},
		productUomId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'uom_uom',
				key: 'id'
			},
			field: 'product_uom_id'
		},
		qtyDone: {
			type: DataTypes.DOUBLE,
			allowNull: true,
			field: 'qty_done'
		},
		qtyReserved: {
			type: DataTypes.DOUBLE,
			allowNull: true,
			field: 'qty_reserved'
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
		}
	}, {
		tableName: 'mrp_product_produce_line'
	});
};