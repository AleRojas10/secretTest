//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static('public'));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema =  new mongoose.Schema({
  email: String,
  password: String
});


const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const user = new User({
      email: req.body.username,
      password: hash
    });

    user.save(function(err){
      if(err){
        console.log(err);
      }else{
        res.render("secrets");
      }
    })
  });
});

app.post("/login", function(req, res){
  const username = req.body.username
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundList) {
    if (err) {
      console.log(err);
    }else{
      if (foundList) {
        bcrypt.compare(password, foundList.password, function(err, result) {
          if(err){
            console.log(err);
          }else{
            if (result) {
              res.render("secrets");
            }else{
              res.send("Contraseña incorrecta");
            }
          }
        });
      }else{
        res.send("El usuario ingresado no existe");
      }
    }
  });
});


app.listen("3000", function(req, res){
  console.log("The server started on port 3000");
});
