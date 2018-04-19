var mongoose = require("mongoose");

var restaurantsSchema = new mongoose.Schema({
    name: String,
    image: String,
    tag: String,
    price: String,
    description: String,
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Restaurant", restaurantsSchema);