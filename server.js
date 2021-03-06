var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var logger = require('morgan');
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(express.static('public'));

//database
//mongoose.connect('mongodb://localhost/mongoosescraper');
var mongodbUri = 'mongodb://greg:12345@ds021343.mlab.com:21343/heroku_lh1cvw0w';

mongoose.connect(mongodbUri);
var db = mongoose.connection;

db.on('error', function (err) {
console.log('Mongoose Error: ', err);
});
db.once('open', function () {
console.log('Mongoose connection successful.');
});

//schemas
var Note = require('./models/note.js');
var Article = require('./models/article.js');

//routes
// app.get('/', function(req, res) {
//   res.send(index.html);
// });





app.get('/', function(req, res) {
  request('https://news.vice.com/', function(error, response, html) {
    var $ = cheerio.load(html);
    $('article').each(function(i, element) {

    	var title = $(this).children('h2').text().replace(/(\n|\t)/gm,"");
 		var	body = $(this).children('p').text().replace(/(\n|\t)/gm,"");
 		var	link = $(this).children('h2').children('a').attr('href');

	Article.findOne({
		'title': title
		}, function(err, res) {
	
		if(err) {
		console.log(err);
		}
	

//if there is no match
		if (res === null) {
		
				var entry = new Article ({

 				title: title,
 				body:  body,
 				link: link
 				});
 				

 				entry.save(function(err, doc) {
 				  if (err) {
 				    console.log(err);
 				  } else {
 				    console.log(doc);
 				  }
 				});


    };
  });
	});
});
  res.send(index.html);
});





app.get('/articles', function(req, res){
	Article.find({}, function(err, doc){
		if (err){
			console.log(err);
		} else {
			res.json(doc);
		}
	});
});

////////// Get Notes ///////////

app.get('/articles/:id', function(req, res){
	Article.findOne({'_id': req.params.id})
	.populate('note')
	.exec(function(err, doc){
		if (err){
			console.log(err);
		} else {
			res.json(doc);
		}
	});
});



///////////////////////////////

///////remove note //////////
app.post('/remove/:id', function(req, res){
	
	Note.find({ '_id': req.params.id }).remove().exec();
		
	});

//////////////////////////////


app.post('/articles/:id', function(req, res){
	var newNote = new Note(req.body);

	newNote.save(function(err, doc){
		if(err){
			console.log(err);
		} else {
			Article.findOneAndUpdate({'_id': req.params.id}, {'note':doc._id})
			.exec(function(err, doc){
				if (err){
					console.log(err);
				} else {
					res.send(doc);
				}
			});

		}
	});
});


//listen
app.listen(port, function() {
  console.log('App running on port ' + port);
});