var express = require("express");
var router = express.Router({mergeParams: true});
var Restaurant = require("../models/Restaurant");
var Comment = require("../models/Comment");
var middlewareCollection = require("../middleware/index");

router.get("/new", middlewareCollection.is_logged_in, function(req, res){
    Restaurant.findById(req.params.rid, function(err, restaurant){
        if (err){
            req.flash("error", err.message);
            res.redirect("/restaurants");
        }
        else{
            res.render("comments/new.ejs", {restaurant: restaurant});
        }
    });
});

router.post("/", middlewareCollection.is_logged_in, function(req, res){
    Restaurant.findById(req.params.rid, function(err, restaurant){
        if (err){
            req.flash("error", err.message);
            res.redirect("/restaurants");
        }
        else{
            Comment.create(req.body.comment, function(err, comment){
                if (err){
                    req.flash("error", err.message);
                    res.redirect("/restaurants");
                }
                else{
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    comment.save();
                    restaurant.comments.push(comment);
                    restaurant.save();
                    req.flash("success", "Your Comment Has Been Recorded")
                    res.redirect("/restaurants/" + req.params.rid);
                }
            });
        }
    });
});

router.get("/:cid/edit", middlewareCollection.comment_modification_user_match, function(req, res){
    Comment.findById(req.params.cid, function(err, found){
        if (err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            res.render("comments/edit.ejs", {restaurant_id: req.params.rid, comment: found});
        }
    });
});

router.put("/:cid", middlewareCollection.comment_modification_user_match, function(req, res){
    Comment.findByIdAndUpdate(req.params.cid, req.body.comment, function(err, updated){
        if (err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            req.flash("success", "Comment Updated");
            res.redirect("/restaurants/" + req.params.rid);
        }
    });
});

router.delete("/:cid", middlewareCollection.comment_modification_user_match, function(req, res){
    Comment.findByIdAndRemove(req.params.cid, function(err){
        if (err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            req.flash("info", "Comment Removed");
            res.redirect("/restaurants/" + req.params.rid);
        }
    });
});

module.exports = router;