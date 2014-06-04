var mongoose = require('mongoose'),
    autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: { type: String, required: true },
});

var Article = mongoose.model('Article', ArticleSchema);