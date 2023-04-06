'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Bom', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      guid: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      itemId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'ITEM_ID'
      },
      materialsId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'MATERIALS_ID'
      },
      rate: {
        type: "MONEY",
        allowNull: true,
      },
      createBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'CREATE_BY'
      },
      createDate: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.DATEONLY,
        field: 'CREATE_DATE'
      },
      modifyBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'MODIFY_BY'
      },
      modifyDate: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.DATEONLY,
        field: 'MODIFY_DATE'
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
      tableName: 'Bom',
      schema: 'prod'
    });
  }
};