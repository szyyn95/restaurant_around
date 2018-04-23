var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/User");
var Restaurant = require("../models/Restaurant");
var Comment = require("../models/Comment");
var middlewareCollection = require("../middleware/index");

router.get("/", function(req, res){
    res.render("homepage.ejs");
});

router.get("/register", function(req, res){
    res.render("register.ejs");
});

router.post("/register", middlewareCollection.password_match, function(req, res){
    User.register(new User({username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email}), req.body.password, function(err, usr){
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

router.get("/users/:uid", function(req, res){
    User.findById(req.params.uid, function(err, found){
        if (err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            Restaurant.find().where("author.id").equals(found._id).exec(function(err, restaurants){
                if (err){
                    req.flash("error", err.message);
                    res.redirect("back");
                }
                else{
                    res.render("users/show.ejs", {user: found, cur_user: req.user, restaurants: restaurants});
                }
            });
        }
    });
});

router.get("/users/:uid/edit", middlewareCollection.userprofile_modification_user_match, function(req, res){
    User.findById(req.params.uid, function(err, found){
        if (err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            res.render("users/edit.ejs", {user: found});
        }
    });
});

router.put("/users/:uid", middlewareCollection.userprofile_modification_user_match, function(req, res){
    User.findByIdAndUpdate(req.params.uid, req.body.user, function(err, user){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } 
        else {
            req.flash("success", "Your Profile Has been Updated");
            res.redirect("/users/" + user._id);
        }
    });
});

module.exports = router;