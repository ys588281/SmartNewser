var mongoose = require('mongoose');
var User = mongoose.model('article');

exports.create = function(req, res){

  var user = new article(req.body);
  user.save(function (err, newarticle){
    if(err){
      console.error(err);
      res.json({error: err.name}, 500);
    };

    res.json(newarticle);
  });

};