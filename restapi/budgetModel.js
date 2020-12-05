var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var budgetSchema = new Schema({
    title: { 
    type: String, 
    required: true,
  },
  budget: { 
    type: Number, 
    required: true,
  },
  range: { 
    type: String, 
    required: true,
  },

}, {collection: 'budget_collection'});

module.exports = mongoose.model("budget_collection", budgetSchema);