'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("budgets", "title", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn("budgets", "updated_at", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn("budgets", "title");
    await queryInterface.removeColumn("budgets", "updated_at");
  },
};