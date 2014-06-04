var db = require('./db');
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');

var Article = mongoose.model('Article');
//var Article = db.Article;

var URL = 'http://www.appledaily.com.tw/realtimenews/section/new/';
var Domain = 'http://www.appledaily.com.tw/';
var Data = {};

var maxTag;
var maxNumber=0;
var JSONArray = [];
var fs = require('fs');



recursiveSolve(URL,1,5,showResult);

function recursiveSolve(PrefixURL,from,max,callback)
{

	if(from > max) 
	{
		callback();
	}
	else
	{
		console.log("page:"+from);
		var nowURL = URL+from;
		solve(nowURL,function()
		{

			recursiveSolve(PrefixURL,++from,max,callback);

		});
	}

}

function solve(targetURL,callback)
{

request(targetURL, function (error, response, html) {
  if (!error && response.statusCode == 200) {
    //console.log(html);

   var $ = cheerio.load(html);


$('ul.rtddd>li').each(function(i, element){
      var a = $(this).prev();
      //console.log(a.text());

      var category = a.find('a>h2').text();
      var title = a.find('a>h1').text();
      var url = Domain+a.find('a').attr('href');
      var time = a.find('a>time').text();
      var video;

      var ccccc = new Article({title:title});
      //ccccc.title = title;
      ccccc.save();

      if(a.hasClass('hsv')) video = true;
      else video =false;


      var item = {'title':title,'url':url,'time':time,'video':video};

//console.log(item);
		/*console.log(category);
		console.log(title);
		console.log(url);
		console.log(time);
		console.log(video);*/

		var targetCategory = {};

		if(Data[category])
		{
			targetCategory = Data[category];
		}
		else
		{
			targetCategory = {};
			Data[category] = targetCategory;

			targetCategory['news_count']=0;
			targetCategory['category']=category;
			targetCategory['news']=[];
		}

		targetCategory['news_count']++;
		targetCategory['news'].push(item);
    });

  }

callback();


});
};



function showResult()
{

delete(Data['']);


  for (var k in Data){


    var item = Data[k];
    if(item['news_count']>maxNumber)
    	{
    		maxTag = k;
    		maxNumber = item['news_count'];
    	}

    JSONArray.push(item);

}


var textData = JSON.stringify(JSONArray);

fs.writeFile('appledaily.json', textData, function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log("[save] path = 'appledaily.json'");
});



var date = new Date();

console.log(date.getFullYear()+'/'+date.getMonth()+'/'+date.getDay()+" "+date.getHours()+":"+date.getMinutes() +"新聞數量最多的分類為為 ["+maxTag+"] ，共有 "+maxNumber+" 則新聞");
}