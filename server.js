var express = require('express');
var app = express();
var mongoose = require('mongoose');
var MONGODBURL = 'mongodb://localhost/test';

var kittySchema = require('./models/kitty');

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.get('/', function(req,res) {
	res.sendFile(__dirname + '/public/index.html');  // serve static files
});

app.get('/new', function(req,res) {
	res.sendFile(__dirname + '/public/new.html');  // serve static files
});

app.get('/show', function(req,res) {
	res.sendFile(__dirname + '/public/search.html');  // serve static files
});

app.get('/newKitty', function(req,res) {
	var newKitten = {name: "", age: 0};
	newKitten.name = req.query.name;
	newKitten.age = req.query.age;

	mongoose.connect(MONGODBURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Kitten = mongoose.model('kitten', kittySchema);
		var k = new Kitten(newKitten);
		k.save(function(err) {
			res.write('<html><body>');
			if (err) {
				res.write('<p>'+err.message+'</p>');
			}
			else {
				res.write('<h1>Create Succeed</h1>');
				console.log('Created: ',k._id);
			}
			res.write('<br><a href="/">Go Home</a></body></html>');
			res.end();
			db.close();
		});
	});
});

app.get('/searchKitty',function(req,res) {
	//console.log(req.query.name);
	mongoose.connect(MONGODBURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Kitten = mongoose.model('Kitten', kittySchema);
		var criteria = {};
		if (req.query.name) {criteria.name = req.query.name}
		if (req.query.age)  {criteria.age = req.query.age}
		Kitten.find(criteria, function(err,results) {
			if (err) {
				console.log("Error: " + err.message);
				res.write(err.message);
			}
			else {
				console.log('Found: ',results.length);
				res.render('showKitten_t3',{kittens: results});
			}
			res.end();
			db.close();
		});
	});
});


app.get('/deleteKitty',function(req,res) {
	//console.log(req.query.name);
	mongoose.connect(MONGODBURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Kitten = mongoose.model('Kitten', kittySchema);
		var criteria = {};

		if (Array.isArray(req.query.id)) {
			
		}else if(req.query.id){
			criteria.id = req.query.id;
			Kitten.find(criteria).remove(function(err,results) {
			if (err) {
				console.log("Error: " + err.message);
				res.write(err.message);
			}
			else {	
				console.log(criteria);
				console.log('Deleted: ',results.id);
				res.end();
				db.close();
			}
			
		});
		}else{
			res.end();
			db.close();
		}
			
		
	});
});

app.listen(process.env.PORT || 8099);
