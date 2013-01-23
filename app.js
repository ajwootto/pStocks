
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , request = require("request")
  , gcmHelpers = require("./gcmHelpers.js");
var app = express();

var mongoose = require("mongoose");
mongoose.connect('mongodb://heroku_app11214650:2ep8aoos2jcjs8lovm9s7nqgh@ds049237.mongolab.com:49237/heroku_app11214650');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
  console.log('success');
});



var stock = new mongoose.Schema({stock: 'string', price: "string", percent: "string", change: "string"});
var Stock = mongoose.model('Stock', stock);

var deviceSchema = new mongoose.Schema({deviceId: "string", registrationId: "string", stocks: "array"});
var Device = mongoose.model('Device', deviceSchema);

var rim = new Stock({stock: "RIMM", price: "0"})

Stock.find({stock: "RIMM"}, function(err, docs){
  if (docs && docs.length < 1)
    rim.save(function(err) {
      if (err) {
        console.log(err);
      }
    });
  else {
    rim = docs[0];
    //rim.save();
  }
});

var request = require('request');
request("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22RIMM%22)%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json", function(err, response, body){
  var resp = JSON.parse(body).query.results ? JSON.parse(body).query.results.quote : null;
  Stock.findOne({stock: "RIMM"}, function(err, doc) {
    if (doc && resp && doc.price != resp.Ask) {
      var devices = Device.find({}, function(err, docs) {
        if (docs && docs.length > 0) {
          var devices = [];
          for (var i = 0; i < docs.length; i++) {
            devices.push(docs[i].registrationId);
          }
          gcmHelpers.sendChanged(devices);
        }
      })
    }
  })
  if (resp)
    rim.set('price', resp.Ask);
  rim.save();
});

var devices = Device.find({}, function(err, docs) {
  if (docs && docs.length > 0) {
    var devices = [];
    for (var i = 0; i < docs.length; i++) {
      devices.push(docs[i].registrationId);
    }
    gcmHelpers.sendChanged(devices);
  }
})

//var devices = Device.find({}, function(err, docs) {
//  if (docs && docs.length > 0) {
 //   var devices = [];
  //  for (var i = 0; i < docs.length; i++) {
 //     devices.push(docs[i].registrationId);
  //  }
    //gcmHelpers.sendChanged(["APA91bFO8ZprtNng7gRGR8q5Liq0Wtxabek1IIwFruBTTjY0yCpDFcNhCWIm8N3dk8APvylyc0MrVuWztQ5Jdy3_66drtf3g4dhGFQL-3vki7M7gJMcJwPOhtZ5mxL257_aunNaW2el2qFARuEOCowsZmfRvOT0iaw"])
//);
 // }
//});

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
