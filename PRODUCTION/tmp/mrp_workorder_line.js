/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('mrpWorkorderLine', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
		},
		// 	raw_workorder_id = fields.Many2one('mrp.workorder', 'Component for Workorder',
		//     ondelete='cascade')
		// finished_workorder_id = fields.Many2one('mrp.workorder', 'Finished Product for Workorder',
		//     ondelete='cascade')
		rawWorkorderId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'mrp_workorder',
				key: 'id'
			},
			field: 'raw_workorder_id'
		},
		finishedWorkorderId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'mrp_workorder',
				key: 'id'
			},
			field: 'finished_workorder_id'
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
		}
	}, {
		tableName: 'mrp_workorder_line'
	});
};