
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



var stockSchema = new mongoose.Schema({stock: 'string', price: "string", percent: "string", change: "string"});
var Stock = mongoose.model('Stock', stockSchema);

var deviceSchema = new mongoose.Schema({deviceId: "string", registrationId: "string", stocks: "array"});
var Device = mongoose.model('Device', deviceSchema);



setInterval(function() {
  Stock.find({}, function(err, stocks) {
    if (stocks.length > 0) {
      console.log(stocks.length)
      for(var i = 0; i < stocks.length; i++) {
        console.log('checking', stocks[i].stock)
        this.stock = stocks[i]
        var that = this;
        var resp = request("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22" + stocks[i].stock + "%22)%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json", function(err, response, body){
          var resp = (JSON.parse(body) && JSON.parse(body).query.results) ? JSON.parse(body).query.results.quote : null;
          console.log("stock", that.stock);
          if (resp){ //&& that.stock.price != resp.Ask) {
            var devices = Device.find({stocks: [that.stock.stock]}, function(err, docs) {
              if (docs && docs.length > 0) {
                var devices = [];
                for (var i = 0; i < docs.length; i++) {
                  devices.push(docs[i].registrationId);
                };
                gcmHelpers.sendChanged(devices);
              };
            });
          };
          if (resp) {
            that.stock.price = resp.Ask;
            that.stock.percent = resp.ChangeinPercent;
            that.stock.change = resp.Change;
          }
          that.stock.save();
        });
      }
    }
  })
}, 10000)



//setInterval(function() {

//}, 1000);


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

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.post('/update', routes.update);
app.post('/updateStock', routes.updateStock);
app.post('/register', routes.register);



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
