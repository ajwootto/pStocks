
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
	var newId = randomstring.generate();
	//if (typeof res.body != 'undefined' && res.body){
	var deviceModel = mongoose.model('Device');
	var newDevice = new deviceModel({deviceId: newId, registrationId: req.body['regId'], stocks: 'RIMM'});
	newDevice.save();
	gcmHelpers.sendId(newId, [req.body['regId']]);
	//}
		
	res.send('sup');
};
exports.update = function(req,res) {
	var deviceModel = mongoose.model('Device');
	var stockModel = mongoose.model('Stock');
	var device = deviceModel.findOne({deviceId: req.body["genId"]});
	var stock = stockModel.findOne({stock: req.body['tickerName']});
	gcmHelpers.sendStocks({price: stock.price, percent: stock.percent, change: stock.change}, [device.registrationId]);
};