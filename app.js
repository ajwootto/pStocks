
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , request = require("request");
var app = express();

var mongoose = require("mongoose");
mongoose.connect('mongodb://heroku_app11214650:2ep8aoos2jcjs8lovm9s7nqgh@ds049237.mongolab.com:49237/heroku_app11214650');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
  console.log('success');
});



var stock = new mongoose.Schema({stock: 'string', value: "string"});
var deviceSchema = new mongoose.Schema({deviceId: "string", registrationId: "string", stocks: "array"});

mongoose.model('Device', deviceSchema);
var Stock = mongoose.model('Stock', stock);
var rim;
Stock.find({stock: "RIMM"}, function(err, docs){
  console.log(docs)
  if (docs.length < 1)
    rim = new Stock({stock: "RIMM", value: "0"});
  else 
    rim = docs[0];
  rim.save();
});

var request = require('request');
request("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22RIMM%22)%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json", function(err, response, body){
  var response = JSON.parse(body).query;
  Stock.findOne({stock: "RIMM"}, function(err, doc) {
    if (doc.value != response) {

    }
  })
  rim.set('stock', response);
  rim.save();
});


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});
var device = mongoose.Schema({device_id: "string"});
app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.post('/register', routes.register);



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
