var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/User");
var middlewareCollection = require("../middleware/index");

router.get("/", function(req, res){
    res.render("homepage.ejs");
});

router.get("/register", function(req, res){
    res.render("register.ejs");
});

router.post("/register", middlewareCollection.password_match, function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, usr){
        if (err){
            req.flash("error", err.message);
            res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to Restaurant Around " + req.body.username);
                res.redirect("/restaurants");
            });
        }
    });
});

router.get("/login", function(req, res){
    res.render("login.ejs");
});

router.post("/login", passport.authenticate("local", {
        successRedirect: "/restaurants",
        failureRedirect: "/login"
    }), function(req, res){
});

router.get("/logout", function(req, res){
    req.logout();
    req.flash("info", "Successfully Logged Out");
    res.redirect("/restaurants");
});

module.exports = router;