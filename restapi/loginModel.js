var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var loginSchema = new Schema({
    username: { 
    type: String, 
    required: true,
    },  
    password: { 
      type: String, 
      required: true,
    }
  
  }, {collection: 'login_collection'});

  module.exports = mongoose.model("login_collection", loginSchema); 
  