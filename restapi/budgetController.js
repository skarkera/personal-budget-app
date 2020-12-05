'use strict';
var mongoose = require('mongoose'),
Budget = mongoose.model("budget_collection");

exports.budget = function(req, res) {
  Budget.find({}, function(err, budget) {
      console.log("within exports.budget find");
      console.log(budget);
    if (err)
      res.send(err);
    res.json(budget);
  });
};

exports.add = function(req, res) {
    console.log("within add.budget");
  var new_budget= new Budget(req.body);
  new_budget.save(function(err, budget) {
    if (err)
      res.send(err);
    res.json(budget);
  });
};

exports.update = function(req, res) {
    console.log("within update.budget");
  var id = mongoose.Types.ObjectId(req.query.budgetId);
  Budget.findOneAndUpdate({_id: id}, req.body, {new: true}, function(err, budget) {
    if (err)
      res.send(err);
    res.json(budget);
  });
};

exports.delete = function(req, res) {
    console.log("within exports.delete");
  var id = mongoose.Types.ObjectId(req.query.budgetId);
  Budget.remove({
    _id: id
  }, function(err, budget) {
    if (err)
      res.send(err);
    res.json({ message: 'Budget successfully deleted' });
  });
};

exports.getBudget = function(req, res) {
    console.log("within getexports.budget");
    var budgetId = req.query.budgetId;
    Budget.findById(mongoose.Types.ObjectId(budgetId), function(err, budget) {
      if (err)
        res.send(err);
      res.json(budget);
    });
  };