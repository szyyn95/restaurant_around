var middlewareCollection = {};
var Restaurant = require("../models/Restaurant");
var Comment = require("../models/Comment");
var User = require("../models/User");

middlewareCollection.is_logged_in = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First");
    res.redirect("/login");
}

middlewareCollection.restaurant_modification_user_match = function(req, res, next){
    if (req.isAuthenticated()){
        Restaurant.findById(req.params.rid, function(err, found) {
            if (err || !found){
                req.flash("error", "Unknow Error: restaurant_modification_user_match fails");
                res.redirect("/restaurants");
            }
            else if (found.author.id.equals(req.user._id)){
                next();
            }
            else{
                req.flash("error", "You Don't Have Permission for This");
                res.redirect("back");
            }
        });
    }
    else{
        req.flash("error", "Please Login First");
        res.redirect("/login");
    }
}

middlewareCollection.comment_modification_user_match = function(req, res, next){
    if (req.isAuthenticated()){
        Comment.findById(req.params.cid, function(err, found) {
            if (err || !found){
                req.flash("error", "Unknow Error: comment_modification_user_match fails");
                res.redirect("/restaurants");
            }
            else if (found.author.id.equals(req.user._id)){
                next();
            }
            else{
                req.flash("error", "You Don't Have Permission for This");
                res.redirect("back");
            }
        });
    }
    else{
        req.flash("error", "Please Login First");
        res.redirect("/login");
    }
}

middlewareCollection.password_match = function(req, res, next){
    if (req.body.password === req.body.password_confirm){
        next();
    }
    else{
        req.flash("error", "Please Re-confirm Your Password");
        res.redirect("/register");
    }
}

module.exports = middlewareCollection;