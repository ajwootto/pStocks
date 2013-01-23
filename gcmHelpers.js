var gcm = require('node-gcm');
var message = new gcm.Message();
message.addData('changed', 'true');
var sender = new gcm.Sender('AIzaSyAS69XB59u8lPtxrpYWfuDjkSzvGz43xP8');
var registrationIds = [];

exports.sendChanged = function(devices) {
	
	sender.send(message, devices, 4, function(err, result) {
		console.log(result);
	})
};

exports.sendId = function(id, sendId) {
	var idMessage = new gcm.Message();
	idMessage.addData('id', id);
	sender.send(idMessage, sendId, 4, function(err, result) {
		console.log(result);
	});
};