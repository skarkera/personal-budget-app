'use strict';
module.exports = function(app) {
    var budget = require('./budgetController');
    app.route('/budgets')
        .get(budget.budget)
        .post(budget.add);
    app.route('/budgets/:budgetId')
        .get(budget.getBudget)
        .put(budget.update)
        .delete(budget.delete);
};