'use strict';
const express = require('express');
const router = express.Router();
const { Budget, BudgetItem, sequelize } = require('../models'); // Adjust path if models are indexed differently
const { Op } = require('sequelize');

// --- Helper Function for Error Handling ---
const handleError = (res, error, message = 'Server error', statusCode = 500) => {
  console.error(message, error);
  res.status(statusCode).json({ message: message, error: error.message });
};

// --- GET /api/budgets/user/:userId --- 
// Get the latest budget for a specific user
router.get('/user/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID format.' });
  }

  // Verify the requested user ID matches the authenticated user
  if (userId !== req.user.id) {
    return res.status(403).json({ message: 'Unauthorized access to user data' });
  }

  try {
    const budget = await Budget.findOne({
      where: { user_id: userId },
      order: [['updated_at', 'DESC']], // Get the most recently updated budget
      include: [{
        model: BudgetItem, // Include associated items
        as: 'items' // Make sure this alias matches your model association
      }]
    });

    if (!budget) {
      return res.status(404).json({ message: 'No budget found for this user.' });
    }

    // Ensure items are included, even if empty
    const budgetData = budget.toJSON();
    budgetData.items = budgetData.items || []; 

    res.status(200).json({ budget: budgetData });
  } catch (error) {
    handleError(res, error, 'Error fetching budget data');
  }
});

// --- POST /api/budgets --- 
// Create a new budget for a user
router.post('/', async (req, res) => {
  const { title, total_amount, items } = req.body;
  const userId = req.user.id; // Get user ID from authenticated user

  if (!title || total_amount === undefined || !Array.isArray(items)) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  let transaction;
  try {
    transaction = await sequelize.transaction();

    // Check for existing budget with same title
    const existingBudget = await Budget.findOne({
      where: { user_id: userId, title },
      transaction
    });

    if (existingBudget) {
      // Delete existing items
      await BudgetItem.destroy({
        where: { budget_id: existingBudget.id },
        transaction
      });

      // Update the existing budget
      await existingBudget.update({
        total_amount,
        updated_at: new Date()
      }, { transaction });

      // Create new items
      const newItems = items.map(item => ({
        budget_id: existingBudget.id,
        label: item.label,
        value: item.value
      }));

      await BudgetItem.bulkCreate(newItems, { transaction });

      await transaction.commit();
      return res.status(200).json({ 
        message: 'Budget updated successfully',
        budget: await Budget.findByPk(existingBudget.id, {
          include: [{ model: BudgetItem, as: 'items' }]
        })
      });
    }

    // Create new budget
    const newBudget = await Budget.create({
      user_id: userId,
      title,
      total_amount
    }, { transaction });

    const newItems = items.map(item => ({
      budget_id: newBudget.id,
      label: item.label,
      value: item.value
    }));

    await BudgetItem.bulkCreate(newItems, { transaction });

    await transaction.commit();
    res.status(201).json({ 
      message: 'Budget created successfully',
      budget: await Budget.findByPk(newBudget.id, {
        include: [{ model: BudgetItem, as: 'items' }]
      })
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    handleError(res, error, 'Error saving budget');
  }
});

// --- PUT /api/budgets/:id --- 
// Update an existing budget
router.put('/:id', async (req, res) => {
  const budgetId = parseInt(req.params.id, 10);
  if (isNaN(budgetId)) {
    return res.status(400).json({ message: 'Invalid budget ID format.' });
  }

  const { user_id, title, total_amount, items } = req.body; // user_id for verification if needed

  // Basic Validation
  if (!title || total_amount === undefined || !Array.isArray(items)) {
    return res.status(400).json({ message: 'Missing required fields: title, total_amount, items array.' });
  }

  let transaction;
  try {
    transaction = await sequelize.transaction();

    // Find the existing budget
    const budget = await Budget.findByPk(budgetId, { transaction });
    if (!budget) {
      await transaction.rollback(); // No need to proceed
      return res.status(404).json({ message: 'Budget not found.' });
    }

    // Optional: Verify ownership if user_id is passed and you have authentication middleware setting req.user
    // if (budget.user_id !== user_id /* or req.user.id */) { 
    //   await transaction.rollback();
    //   return res.status(403).json({ message: 'Forbidden: You do not own this budget.' });
    // }

    // Update budget fields
    budget.title = title;
    budget.total_amount = total_amount;
    // sequelize automatically updates updated_at if timestamps: true
    await budget.save({ transaction });

    // Update items: Delete existing and bulk insert new ones (simplest approach)
    await BudgetItem.destroy({ where: { budget_id: budgetId }, transaction });

    if (items.length > 0) {
      const budgetItemsData = items.map(item => ({
        budget_id: budgetId,
        label: item.label,
        value: item.value,
      }));
      await BudgetItem.bulkCreate(budgetItemsData, { transaction });
    }

    await transaction.commit();

     // Refetch the updated budget with items to return it
    const updatedBudgetWithItems = await Budget.findByPk(budgetId, {
      include: [{ model: BudgetItem, as: 'items' }]
    });

    res.status(200).json({ message: 'Budget updated successfully', budget: updatedBudgetWithItems });

  } catch (error) {
    if (transaction) await transaction.rollback();
    handleError(res, error, 'Error updating budget');
  }
});

// Get all budgets for a user
router.get('/user/:userId/history', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID format.' });
  }

  // Verify the requested user ID matches the authenticated user
  if (userId !== req.user.id) {
    return res.status(403).json({ message: 'Unauthorized access to user data' });
  }

  try {
    const budgets = await Budget.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      include: [{
        model: BudgetItem,
        as: 'items'
      }]
    });

    res.status(200).json({ budgets });
  } catch (error) {
    handleError(res, error, 'Error fetching budget history');
  }
});

// Delete a budget
router.delete('/:budgetId', async (req, res) => {
  const budgetId = parseInt(req.params.budgetId, 10);
  if (isNaN(budgetId)) {
    return res.status(400).json({ message: 'Invalid budget ID format.' });
  }

  let transaction;
  try {
    transaction = await sequelize.transaction();

    // First verify the budget belongs to the authenticated user
    const budget = await Budget.findOne({
      where: { id: budgetId, user_id: req.user.id },
      transaction
    });

    if (!budget) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Budget not found or unauthorized access.' });
    }

    // Delete all associated budget items
    await BudgetItem.destroy({
      where: { budget_id: budgetId },
      transaction
    });

    // Delete the budget
    await Budget.destroy({
      where: { id: budgetId },
      transaction
    });

    await transaction.commit();
    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    if (transaction) await transaction.rollback();
    handleError(res, error, 'Error deleting budget');
  }
});

module.exports = router; 