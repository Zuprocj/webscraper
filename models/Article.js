const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ArticleSchema = new Schema ({
    title:{
        type: String,
        requried: true
    },
    link: {
        type: String,
        requried: true
    },
    note: 
        {
        type: Schema.Types.ObjectId,
        ref: "Comment"
        }
});

const Article = mongoose.model("Article", ArticleSchema)
module.exports - Article;