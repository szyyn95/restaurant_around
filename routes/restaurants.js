var express = require("express");
var router = express.Router();
var Restaurant = require("../models/Restaurant");
var middlewareCollection = require("../middleware/index");

router.get("/", function(req, res){
    Restaurant.find({}, function(err, all_restaurants){
        if (err){
            req.flash("error", err.message);
            res.redirect("/");
        }
        else{
            res.render("restaurants/index.ejs", {restaurants: all_restaurants, cur_user: req.user});
        }
    });
});

router.post("/", middlewareCollection.is_logged_in, function(req, res){
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var new_restaurant = {name: req.body.name, image: req.body.image, tag: req.body.tag, price: req.body.price, description: req.body.description, author: author};
    Restaurant.create(new_restaurant, function(err, newly_created){
         if (err){
             req.flash("error", err.message);
             res.redirect("/");
         }
         else{
             req.flash("success", "New Reataurant Added");
             res.redirect("/restaurants");
         }
     });
});

router.get("/new", middlewareCollection.is_logged_in, function(req, res){
    res.render("restaurants/new.ejs");
});

router.get("/:rid", function(req, res){
    Restaurant.findById(req.params.rid).populate("comments").exec(function(err, found){
        if (err){
            req.flash("error", err.message);
            res.redirect("/restaurants");
        }
        else{
            res.render("restaurants/show.ejs", {restaurant: found});
        }
    });
});

router.get("/:rid/edit", middlewareCollection.restaurant_modification_user_match, function(req, res){
    Restaurant.findById(req.params.rid, function(err, found){
        if (err){
            req.flash("error", err.message);
            res.redirect("/restaurants");
        }
        else{
            res.render("restaurants/edit.ejs", {restaurant: found});
        }
    });
});

router.put("/:rid", middlewareCollection.restaurant_modification_user_match, function(req, res){
    Restaurant.findByIdAndUpdate(req.params.rid, {name: req.body.name, image: req.body.image, tag: req.body.tag, price: req.body.price, description: req.body.description}, function(err, updated){
        if (err){
            req.flash("error", err.message);
            res.redirect("/restaurants");
        }
        else{
            req.flash("success", "Update Completed");
            res.redirect("/restaurants/" + req.params.rid);
        }
    });
});

router.delete("/:rid", middlewareCollection.restaurant_modification_user_match, function(req, res){
    Restaurant.findByIdAndRemove(req.params.rid, function(err){
        if (err){
            req.flash("error", err.message);
            res.redirect("/restaurants");
        }
        else{
            req.flash("info", "Reataurant Removed");
            res.redirect("/restaurants");
        }
    });
});

module.exports = router;