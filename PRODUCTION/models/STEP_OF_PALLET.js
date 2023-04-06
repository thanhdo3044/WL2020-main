/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('StepOfPallet', {
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
		palletId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'PALLET_ID'
		},
		stepId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'STEP_ID'
		},
		stepNextId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'STEP_NEXT_ID'
		},
		itemId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'ITEM_ID'
		},
		pass: {
			type: "MONEY",
			allowNull: true,
			field: 'PASS'
		},
		notPass: {
			type: "MONEY",
			allowNull: true,
			field: 'NOT_PASS'
		},
		kilnBatchId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'KILN_BATCH_ID'
		},
		planId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'PLAN_ID'
		},
		finish: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'FINISH'
		},
		createBy: {
			type: DataTypes.INTEGER,
			allowNull: true,
			field: 'CREATE_BY'
		},
		createDate: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'CREATE_DATE'
		}
	}, {
		tableName: 'STEP_OF_PALLET',
		timestamps: false,
		schema: 'base'
	});
};