'use strict';

module.exports = function(app) {
    var budget = require('../server.js');
    app.route('/budgets')
        .get(budget.budget)
        .post(budget.add);
    app.route('/budgets/:budgetId')
        .get(budget.getBudget)
        .put(budget.update)
        .delete(budget.delete);
};

module.exports = function(app) {
    var login = require('../server.js');
    app.route('/login')
        //.post(login.addLogin)
       .post(login.findLogin);
    app.route('/signup')
        .post(login.addLogin);
}; 