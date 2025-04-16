'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Budget extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Budget.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user' // Optional alias
      });
      Budget.hasMany(models.BudgetItem, {
        foreignKey: 'budget_id',
        as: 'items' // Alias used in budgetRoutes
      });
    }
  }

  Budget.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { // Optional, but good practice
        model: 'users',
        key: 'id',
      }
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true, // Based on migration
    },
    total_amount: {
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
    modelName: 'Budget',
    tableName: 'budgets',
    timestamps: false, // Set timestamps to false as columns are explicitly defined
    // No createdAt/updatedAt mapping needed now
  });

  return Budget;
};
