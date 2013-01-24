
/*
 * GET home page.
 */
var randomstring = require('randomstring')
	,gcmHelpers = require('../gcmHelpers.js')
	,mongoose = require('mongoose');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.register = function(req, res) {
	//var devices = mongoose.model('device');
	//devices.set('devices', devices.get('devices').push({deviceId: randomstring.generate(), registrationId: res.body['regId'], stocks: "RIMM"}));
	//devices.save();
	var deviceModel = mongoose.model('Device');
	if (req.body['genId'] != "") {
		deviceModel.update({deviceId: req.body['genId']}, {registrationId: req.body['regId']});
		gcmHelpers.sendId(req.body['genId'], [req.body['regId']]);
	} else {
		var newId = randomstring.generate();
		var newDevice = new deviceModel({deviceId: newId, registrationId: req.body['regId'], stock: ""});
		newDevice.save();
		gcmHelpers.sendId(newId, [req.body['regId']]);
	}
	//if (typeof res.body != 'undefined' && res.body){
	//}
		
	res.send('sup');
};
exports.updateStock = function(req,res) {
	var deviceModel = mongoose.model('Device');
	var stockModel = mongoose.model('Stock');
	deviceModel.findOne({deviceId: req.body["genId"]}, function(err, device) {
		stockModel.findOne({stock: device.stock}, function(err, stock){
			if (stock) {
				res.send(JSON.stringify({price: stock.price, percent: stock.percent, change: stock.change}));
			} else {
				res.send("no data");
			}
		});
	});
};
exports.update = function(req, res) {
	var deviceModel = mongoose.model('Device');
	var stockModel = mongoose.model('Stock');
	deviceModel.update({deviceId: req.body['genId']}, {stock: req.body['tickerName']});
	stockModel.find({stock: req.body['tickerName']}, function(err, stocks) {
		if (stocks.length < 1 && req.body['tickerName'] != "") {
			var stock = new stockModel({stock: req.body['tickerName'], price: "0"});
			stock.save();
		};
	});
	console.log("Updated", req.body['genId']);
	deviceModel.findOne({'genId': req.body['genId']}, function(err, doc) {
		if (doc) {
			gcmHelpers.sendChanged([doc.registrationId]);
		};
	});
};