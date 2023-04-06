/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	const Coc = sequelize.define('Coc', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			field: 'ID'
		},
		guid: {
			type: DataTypes.UUID,
			allowNull: false,
			field: 'GUID'
		},
		date: {
			type: DataTypes.DATEONLY,
			allowNull: true,
			field: 'DATE'
		},
		itemId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'ITEM_ID'
		},
		order: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'ORDER'
		},
		quantity: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'QUANTITY'
		},
		factoryId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'FACTORY_ID'
		}
	}, {
		tableName: 'COC',
		timestamps: false,
		schema: 'prod'
	});
	Coc.associate = function (models) {
		// Coc hasMany CocInfo
		Coc.hasMany(models.CocInfo, {
			foreignKey: 'COC_ID'
		})
		Coc.belongsTo(models.Item, {
			foreignKey: 'ITEM_ID'
		})
	};
	return Coc;
};