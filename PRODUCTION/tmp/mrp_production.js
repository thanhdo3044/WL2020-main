/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('mrpProduction', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: true,
			unique: true,
			field: 'name'
		},
		origin: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'origin'
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
		productQty: {
			type: DataTypes.DOUBLE,
			allowNull: false,
			field: 'product_qty'
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
		productUomQty: {
			type: DataTypes.DOUBLE,
			allowNull: true,
			field: 'product_uom_qty'
		},
		bomId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'mrp_bom',
				key: 'id'
			},
			field: 'bom_id'
		},
		routingId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'mrp_routing',
				key: 'id'
			},
			field: 'routing_id'
		},
		state: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'state'
		},
		reservationState: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'reservation_state'
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'res_users',
				key: 'id'
			},
			field: 'user_id'
		},
		companyId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'res_company',
				key: 'id'
			},
			field: 'company_id'
		},
		propagateCancel: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			field: 'propagate_cancel'
		},
		propagateDate: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			field: 'propagate_date'
		},
		propagateDateMinimumDelta: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'propagate_date_minimum_delta'
		},
		priority: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'priority'
		},
		isLocked: {
			type: DataTypes.BOOLEAN,
			allowNull: true
		},
	}, {
		tableName: 'mrp_production'
	});
};