'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class BudgetItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BudgetItem.belongsTo(models.Budget, {
        foreignKey: 'budget_id',
        as: 'budget' // Optional alias
      });
    }
  }

  BudgetItem.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    budget_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { // Optional, but good practice
        model: 'budgets',
        key: 'id',
      }
    },
    label: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    value: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    // Explicitly define timestamp columns matching migration defaults
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'), // Match migration
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'), // Match migration
    },
  }, {
    sequelize,
    modelName: 'BudgetItem',
    tableName: 'budget_items', // Ensure this matches your table name
    timestamps: false, // Set timestamps to false as columns are explicitly defined
    // No createdAt/updatedAt mapping needed now
  });

  return BudgetItem;
};
