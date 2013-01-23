
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
	var deviceModel = mongoose.model('Device');
	if (typeof res.body != 'undefined' && res.body){
		var newDevice = new deviceModel({deviceId: newId, registrationId: res.body['regId'], stocks: 'RIMM'});
		newDevice.save();
		gcmHelpers.sendId(newId, req.body['regId']);
	}
		
	res.send('sup');
};
