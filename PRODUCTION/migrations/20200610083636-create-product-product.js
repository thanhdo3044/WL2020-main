'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ProductProducts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      defaultCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      categId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      volume: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      width: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      height: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      length: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ProductProducts');
  }
};