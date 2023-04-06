/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('mrpBomLine', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
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
		companyId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'res_company',
				key: 'id'
			},
			field: 'company_id'
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
		sequence: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'sequence'
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
		bomId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'mrp_bom',
				key: 'id'
			},
			field: 'bom_id'
		},
		operationId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'mrp_routing_workcenter',
				key: 'id'
			},
			field: 'operation_id'
		}
	}, {});
};