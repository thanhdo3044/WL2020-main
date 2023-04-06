'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Kiln', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      guid: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      factoryId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'factory_id'
      },
      stepId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'step_id'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, {
      schema: 'prod'
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable({
      tableName: 'Kiln',
      schema: 'prod'
    });
  }
};