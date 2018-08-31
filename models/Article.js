var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ArticleSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true,
    trim: true
  },
  link: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  comments: [
  {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
]
});
var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;