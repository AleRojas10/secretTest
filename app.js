//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const md5 = require('md5');

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
  const user = new User({
    email: req.body.username,
    password: md5(req.body.password)
  })

  user.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
    }
  })
});

app.post("/login", function(req, res){
  const username = req.body.username
  const password = md5(req.body.password);

  User.findOne({email: username}, function(err, foundList) {
    if (err) {
      console.log(err);
    }else{
      if (foundList) {
        if (foundList.password === password) {
          res.render("secrets");
        }else{
          res.send("Contraseña incorrecta");
        }
      }else{
        res.send("Usuario no existe");
      }
    }
  });
});


app.listen("3000", function(req, res){
  console.log("The server started on port 3000");
});
