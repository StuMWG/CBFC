'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("budget_items", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      budget_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "budgets",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      label: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      value: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("budget_items");
  },
};