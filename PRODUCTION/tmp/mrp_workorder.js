/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	let MrpWorkorder = sequelize.define('MrpWorkorder', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		workcenterId: {
			type: DataTypes.UUID,
			allowNull: false
		},
		qtyProduced: {
			type: DataTypes.DOUBLE,
			allowNull: true
		},
		state: {
			type: DataTypes.STRING,
			allowNull: true
		},
		operationId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'mrp_routing_workcenter',
				key: 'id'
			},
			field: 'operation_id'
		},
		nextWorkOrderId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'mrp_workorder',
				key: 'id'
			},
			field: 'next_work_order_id'
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
	}, {});
};