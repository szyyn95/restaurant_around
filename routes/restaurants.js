var express = require("express");
var router = express.Router();
var Restaurant = require("../models/Restaurant");
var middlewareCollection = require("../middleware/index");
// Add  Google Geocoder
var NodeGeocoder = require('node-geocoder');
 
var options = {
    provider: "google",
    httpAdapter: "https",
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};
 
var geocoder = NodeGeocoder(options);

// Go to the restaurant index page
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

// Post a new restaurant
router.post("/", middlewareCollection.is_logged_in, function(req, res){
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location, function(err, data){
        if (err || !data.length){
            req.flash("error", "Invalid Address");
            return res.redirect("/");
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var new_restaurant = {name: req.body.name, image: req.body.image, location: location, lat: lat, lng: lng, tag: req.body.tag, price: req.body.price, description: req.body.description, author: author};
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
});

// Create a new restaurant
router.get("/new", middlewareCollection.is_logged_in, function(req, res){
    res.render("restaurants/new.ejs");
});

// Get to a specific restaurant
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

// Edit a restaurant
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

// Update the editted restaurant
router.put("/:rid", middlewareCollection.restaurant_modification_user_match, function(req, res){
    geocoder.geocode(req.body.restaurant.location, function (err, data) {
        if (err || !data.length) {
            req.flash('error', 'Invalid Address');
            return res.redirect('back');
        }
        req.body.restaurant.lat = data[0].latitude;
        req.body.restaurant.lng = data[0].longitude;
        req.body.restaurant.location = data[0].formattedAddress;
        Restaurant.findByIdAndUpdate(req.params.rid, req.body.restaurant, function(err, restaurant){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } 
            else {
                req.flash("success", "Restaurant Info Successfully Updated");
                res.redirect("/restaurants/" + restaurant._id);
            }
        });
    });
});

// Delete a restaurant
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