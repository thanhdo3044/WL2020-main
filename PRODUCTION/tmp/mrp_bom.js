/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('mrpBom', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
		},
		code: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'code'
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			field: 'active'
		},
		type: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'type'
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
		readyToProduce: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'ready_to_produce'
		},

		companyId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'res_company',
				key: 'id'
			},
			field: 'company_id'
		}
	}, {
		tableName: 'mrp_bom'
	});
};