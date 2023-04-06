/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	let ProductProduct = sequelize.define('ProductProduct', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
		},
		defaultCode: {
			type: DataTypes.STRING,
			allowNull: true
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: true
		},
		categId: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		volume: {
			type: DataTypes.DOUBLE,
			allowNull: true
		},
		width: {
			type: DataTypes.DOUBLE,
			allowNull: true
		},
		height: {
			type: DataTypes.DOUBLE,
			allowNull: true
		},
		length: {
			type: DataTypes.DOUBLE,
			allowNull: true
		}
	}, {});
	// (async () => {
	// 	await ProductProduct.sync({
	// 		force: true
	// 	});
	// 	// Code here
	// })();
	return ProductProduct;
};