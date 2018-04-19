var express = require("express");
var bodyParser = require("body-parser");
var passport = require("passport");
var localStrategy = require("passport-local");
var methodOverride = require("method-override");
var mongoose = require("mongoose");
var flash = require("connect-flash");

var User = require("./models/User");
var restaurantRoutes = require("./routes/restaurants");
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");

var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

mongoose.connect("mongodb://localhost/restaurant_around");

/*
var Restaurant = require("./models/Restaurant");
Restaurant.remove({}, function(err){
    if (err){
        console.log(err);
    }
});
*/

// Purge database and fill with seed data
var reboot = false;
if (reboot){
    var purgeAndSeed = require("./seeds");
    purgeAndSeed();
}

app.use(require("express-session")({
    secret: "This is a sentence used in info encoding and decoding",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// A middleware to pass req.user to all routes
app.use(function(req, res, next){
    res.locals.cur_user = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.info = req.flash("info");
    next();
});

app.use("/restaurants", restaurantRoutes);
app.use("/restaurants/:rid/comments", commentRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server initiated");
});                                                                 