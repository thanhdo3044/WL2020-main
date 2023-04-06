/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('productCategory', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		completeName: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		parentId: {
			type: DataTypes.UUID,
			allowNull: true
		}
	}, {
		tableName: 'product_category'
	});
};