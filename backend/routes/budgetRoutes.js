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
  const { user_id, title, total_amount, items } = req.body;

  // Basic Validation
  if (!user_id || !title || total_amount === undefined || !Array.isArray(items)) {
    return res.status(400).json({ message: 'Missing required fields: user_id, title, total_amount, items array.' });
  }

  let transaction;
  try {
    transaction = await sequelize.transaction();

    // Create the main budget record
    const newBudget = await Budget.create({
      user_id,
      title,
      total_amount,
      // created_at and updated_at handled by defaultValue/timestamps
    }, { transaction });

    // Create associated budget items
    if (items.length > 0) {
      const budgetItemsData = items.map(item => ({
        budget_id: newBudget.id,
        label: item.label,
        value: item.value,
      }));
      await BudgetItem.bulkCreate(budgetItemsData, { transaction });
    }

    await transaction.commit();

    // Refetch the created budget with items to return it
    const createdBudgetWithItems = await Budget.findByPk(newBudget.id, {
      include: [{ model: BudgetItem, as: 'items' }]
    });

    res.status(201).json({ message: 'Budget created successfully', budget: createdBudgetWithItems });

  } catch (error) {
    if (transaction) await transaction.rollback();
    handleError(res, error, 'Error creating budget');
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


module.exports = router; 