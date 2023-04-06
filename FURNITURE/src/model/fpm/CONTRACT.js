/* jshint indent: 2 */
const Sequelize = require('sequelize')
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CONTRACT', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'ID'
		},
		guid: {
			type: DataTypes.UUIDV4,
			allowNull: false,
			field: 'GUID',
			defaultValue: Sequelize.UUIDV4
		},
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'PROJECT_ID',
    },
    url: {
      type: DataTypes.STRING,
      field: 'URL',
      allowNull: true
    },
    fileName: {
      type: DataTypes.STRING,
      field: 'FILE_NAME',
      allowNull: true
    },
    createBy: {
      type: DataTypes.INTEGER,
      field: 'CREATE_BY',
      allowNull: true
    },
    createdate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.fn('GETDATE'),
			field: 'CREATE_DATE',
    }
  }, {
    tableName: 'CONTRACT',
    timestamps: false,
		schema: 'fpm',
  });
};
