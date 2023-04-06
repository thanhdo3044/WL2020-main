'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('OpeningStocks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      departmentId: {
        type: Sequelize.INTEGER,
        field: 'DEPARTMENT_ID',
        allowNull: false
      },
      itemId: {
        type: Sequelize.INTEGER,
        field: 'ITEM_ID',
        allowNull: false
      },
      quantity: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      poId: {
        type: Sequelize.UUID,
        field: 'PO_ID',
        allowNull: true
      },
      createdBy: {
        type: Sequelize.INTEGER,
        field: 'CREATE_BY',
        allowNull: false
      },
      nguonPhoi: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('OpeningStocks')
  }
}
