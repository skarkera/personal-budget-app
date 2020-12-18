"use strict";
/* import React from "react";
import ReactDOM from "react-dom";
import Main from "./Main"; */

const axios = require("axios").default;
const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
const compression = require('compression')

const jwt = require("jsonwebtoken");
const exjwt = require("express-jwt");
const bodyParser = require("body-parser");
const path = require("path");

var Budget = require("./restapi/budgetModel");
var LoginData = require("./restapi/loginModel");

/* ReactDOM.render(
  <Main/>, 
  document.getElementById("root")
); */
/* app.use(compression({
  level: 6,
  threshold: 10*1000,
  filter: (req,res) => {
    if (req.headers['x-no-compression']){
      return false
    }else{
      return compression.filter(req,res);
    }
  }
})); */
app.use(compression({ filter: shouldCompress }))

function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5000");
  res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization");
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/public")));

const secretKey = "My super secret key";
const jwtMW = exjwt({
  secret: secretKey,
  algorithms: ["HS256"],
});

app.post("/login", (req, res) => {

  const { username, password } = req.body;

  mongoose
    .connect("mongodb://localhost:27017/budget", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to database");

      const Login = mongoose.model("login_collection");

      Login.find(
        { username: username, password: password },
        function (err, docs) {
          console.log("Returned data", docs);

          if (err) {
            res.json({
              // res.status(401),json({
              success: false,
              token: null,
              err: "Username or password is incorrect",
            });
          } else {
              if (docs.length > 0){
                console.log("data to sign", docs[0]);
                let token = jwt.sign(
                  { data: docs[0] },
                  secretKey,
                  { expiresIn: "1m" }
                );
                res.json({
                  success: true,
                  err: null,
                  token,
                });
              } else{
                res.json({
                    // res.status(401),json({
                    success: false,
                    token: null,
                    err: "Username or password is incorrect",
                  });
              }
          }
        }
      );
    })
    .catch((connectionError) => {
      console.log(connectionError);
    });

  console.log(
    "Budget data-  RESTful web services with Nodejs started on: " + port
  );
});

app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  mongoose
    .connect("mongodb://localhost:27017/budget", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to database");
      const Login = mongoose.model("login_collection");
      
      Login.add = function (req, res) {
        var new_login = new Login(req.body);
        new_login.save(function (err, docs) {
          if (err) res.send(err);
        
          let token = jwt.sign(
            { username: req.username, password: req.password },
            secretKey,
            { expiresIn: "1m" }
          );
          res.json({
            success: true,
            err: null,
            token,
          });
        });
      };
      console.log("!!!!!!!!!!!");
      Login.add(req, res);
    })
    .catch((connectionError) => {
      console.log(connectionError);
    });

  console.log(
    "Budget data-  RESTful web services with Nodejs started on: " + port
  );
});

// add new budget
// postBudget
app.post("/budget", (req, res) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (authHeader) { 
    console.log("IN ADD BUDGET6");
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secretKey, (err, data)=>{
  mongoose
    .connect("mongodb://localhost:27017/budget", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
      .then(() => {
        console.log("IN ADD BUDGET7");
        console.log("Connected to database");
        const Budget = mongoose.model("budget_collection");
        Budget.add = function (req, res) {
          console.log("IN ADD BUDGET8");
    
          var new_budget = new Budget(req.body);
          new_budget.username = data.data.username;
          console.log("$$$new budget: ", new_budget.username);
          new_budget.save(function (err, docs) {
            console.log("IN ADD BUDGET9");
            if (err) res.send(err);
            res.json({
              success: true,
              err: null,
              token,
            });
          });
        };
        //console.log("!!!!!!!!!!!");
        Budget.add(req, res);
      })
      .catch((connectionError) => {
        console.log(connectionError);
          res.json({
              // res.status(401),json({
              success: false,
              token: null,
              err: "Session expired",
            });
      }); 

    }); 
  } else {
      res.sendStatus(403)
  }

  console.log(
    "Budget data-  RESTful web services with Nodejs started on: " + port
  );

});

// fetch the user budget
// getBudget
app.get("/budget", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader){
    console.log("in budget get function1");
      const token = authHeader.split(' ')[1];
      jwt.verify(token, secretKey, (err, data)=>{
        console.log("in budget get function2");
          if (err){
          console.log("in budget get function3");
              res.send(err)
            }
              mongoose
              .connect("mongodb://localhost:27017/budget", {
                useNewUrlParser: true,
                useUnifiedTopology: true,
              })
              .then(() => {
                console.log("in budget get function4");
                  const Budget = mongoose.model("budget_collection");
                  Budget.find(
                    {username: data.data.username, id: req.params.id}
                  ).then(data=>{
                    console.log("in budget get function6");
                    res.json({
                      success: true,
                      data: data
                    });
                  }
                    ).catch(error=>{
                      console.log("in budget get function7");
                      res.json({
                        success: true,
                        data: [],
                        msg: "no Entries for the user",
                      });
                    })
                })
                .catch((connectionError) => {
                  console.log("in budget get function8");
                  console.log(connectionError);
                });
      }); 
  } else {
    console.log("in budget get function5");
      res.sendStatus(403)
  }
    
});

//same as 
app.delete("/deletebudget", (req, res) => {
  // deleting by two attrbiutes 1- username and the second is the id of that specific budget
  mongoose
    .connect("mongodb://localhost:27017/budget", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      exports.delete = function (req, res) {
        console.log("within exports.delete");
        Budget.remove(
          {
              title:title,
              budget:budget,
              range:range,
              username: username,
              expense:expense

          },
          function (err, budget) {
            if (err) res.send(err);
            res.json({ message: "Budget successfully deleted" });
          }
        );
      };
    })
    .catch((connectionError) => {
      console.log(connectionError);
    });
});

// update a budget
app.patch("/updatebudget", (req, res) => {
  if (authHeader){
    console.log("update");
      const token = authHeader.split(' ')[1];
      jwt.verify(token, secretKey, (err, data)=>{
        console.log("update2");
          if (err){
          console.log("update3");
              res.send(err)
            }
              mongoose
              .connect("mongodb://localhost:27017/budget", {
                useNewUrlParser: true,
                useUnifiedTopology: true,
              })
              .then(() => {
                console.log("in budget get function4");
                  const Budget = mongoose.model("budget_collection");
                  Budget.update(
                    {username: data.data.username, id: req.params.id}
                  ).then(data=>{
                    console.log("update6");
                    res.json({
                      success: true,
                      data: data
                    });
                  }
                    ).catch(error=>{
                      console.log("update7");
                      res.json({
                        success: true,
                        data: [],
                        msg: "no Entries for the user",
                      });
                    })
                })
                .catch((connectionError) => {
                  //console.log("in budget get function8");
                  res.json({
                    // res.status(401),json({
                    success: false,
                    err: "unable to connect to the database",
                  });
                });
      }); 
  } else {
    console.log("in budget get function5");
      res.sendStatus(403)
  }
/*   mongoose
    .connect("mongodb://localhost:27017/budget", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      exports.update = function (req, res) {
        console.log("within update.budget");
        var id = mongoose.Types.ObjectId(req.query.budgetId);
        Budget.findOneAndUpdate(
          { title: title },
          { budget: budget},
          {spent : spent},
          req.body,
          { new: true },
          function (err, budget) {
            if (err) res.send(err);
            res.json(budget);
          }
        );
      };
    }) */
/*     .catch((connectionError) => {
      console.log(connectionError);
    }); */
});
app.listen(port, () => {
  console.log(`API served at http://localhost:${port}`);
});




