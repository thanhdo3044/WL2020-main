/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('MrpWorkcenter', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
		},
		code: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		sequence: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		color: {
			type: DataTypes.INTEGER,
			allowNull: true,
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
	}, {});
};