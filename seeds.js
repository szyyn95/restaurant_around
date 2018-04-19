var mongoose = require("mongoose");
var Restaurant = require("./models/Restaurant");
var Comment = require("./models/Comment");
 
var data = [
    {
        name: "Xi'an Famous Foods", 
        image: "https://s3-media2.fl.yelpcdn.com/bphoto/F3KLTt7FJrQZ8vMbRoeo7Q/o.jpg",
        tag: "Chinese",
        description: "Xi’an Famous Foods began as a 200 square foot basement stall in the Golden Shopping Mall in Flushing, N.Y. The original location, established in late 2005, was the first restaurant to bring the little-known cuisine of Xi’an to the United States, with signature hand-ripped noodles, secret spice mixes, and Xi’an “burgers” with housemade flatbread. Since then, we’ve expanded to nine locations in Manhattan, one in Brooklyn and two in Queens in total. As a family-owned business, we hope to reintroduce the world to the unique cuisine of our hometown: liangpi “cold skin” noodles, lamb pao mo soup, and wide hand-pulled “biang biang” noodles, all in its most authentic form."
    },
    {
        name: "The Milling Room", 
        image: "https://s3-media2.fl.yelpcdn.com/bphoto/Q18v3L-xoa9j-J8sjGA1QQ/o.jpg",
        tag: "American",
        description: "The Milling Room opened in November 2014 and occupies the space which was originally built in 1890 as the luxurious Endicott Hotel. When the original hotel opened, it was described as 'in all respects, the finest and best appointed in this part of the city.' Designed by Edward Angell, who also designed several other prominent buildings on the Upper West Side, and build by Charles A. Fuller, the hotel was crafted of Pompeian brick and terracotta, including a glass-roofed Palm Room where today in its place is The Milling Room. The building sits between 81st and 82nd St. on Columbus Avenue, diagonal from the American Museum of Natural History."
    },
    {
        name: "Kefi", 
        image: "http://michaelpsilakis.com/wp-content/uploads/2012/02/compilation2.jpg",
        tag: "Greek",
        description: "Prepare to be transported to a bustling Greek taverna, where the flavors are big and the value is high. A folkloric concept, “kefi” – or the bliss that accompanies bacchanalia – is a word deeply tied to the cultural ethos of Greece. The menu of favorites, straight from owner Michael Psilakis’ childhood, consists of homestyle dishes like Grilled Octopus, YiaYia’s Meatballs, Braised Rabbit over Pasta and Roasted Lemon Chicken. From the spacious bar, an extensive list of well-priced Greek wines and ouzos are available to complement each meal. Most importantly, however, Kefi brings you Chef Psilakis’ award-winning Greek cuisine at reasonable prices and with neighborhood charm."
    }
]
 
function purgeAndSeed(){
   //Remove all campgrounds
   Restaurant.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed restaurants!");
         //add a few campgrounds
        data.forEach(function(seed){
            Restaurant.create(seed, function(err, restaurant){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a restaurant");
                    //create a comment
                    Comment.create(
                        {
                            content: "Impressive restaurant, would be here again",
                            author: "Handsome_Jack"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                restaurant.comments.push(comment);
                                restaurant.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
    //add a few comments
}
 
module.exports = purgeAndSeed;