
/*
 * GET home page.
 */
var gcm = require('node-gcm')
	, randomstring = require('randomstring');
var message = new gcm.Message();
message.addData('key1', 'vicisdick');
var sender = new gcm.Sender('AIzaSyAS69XB59u8lPtxrpYWfuDjkSzvGz43xP8');
var registrationIds = [];
var mongoose = require('mongoose');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.register = function(req, res) {
	//var devices = mongoose.model('device');
	//devices.set('devices', devices.get('devices').push({deviceId: randomstring.generate(), registrationId: res.body['regId'], stocks: "RIMM"}));
	//devices.save();
	sender.send(message, req.body['regId'], 4, function(err, result) {
		console.log(result);
	})
	res.send('sup');
};
