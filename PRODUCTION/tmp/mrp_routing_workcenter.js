/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('mrpRoutingWorkcenter', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'name'
		},
		workcenterId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'mrp_workcenter',
				key: 'id'
			},
			field: 'workcenter_id'
		},
		sequence: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'sequence'
		},
		routingId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'mrp_routing',
				key: 'id'
			},
			field: 'routing_id'
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
		tableName: 'mrp_routing_workcenter'
	});
};