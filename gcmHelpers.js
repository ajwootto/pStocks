var gcm = require('node-gcm');

var sender = new gcm.Sender('AIzaSyAS69XB59u8lPtxrpYWfuDjkSzvGz43xP8');
var registrationIds = [];

exports.sendChanged = function(devices) {
	var message = new gcm.Message();
	message.addData('message', 'update');
	sender.send(message, devices, 4, function(err, result) {
		console.log(result);
	})
};

exports.sendId = function(id, sendId) {
	var idMessage = new gcm.Message();
	idMessage.addData('message', id);
	sender.send(idMessage, sendId, 4, function(err, result) {
		console.log(result);
	});
};

exports.sendStocks = function(stocks, sendId) {
	var stockMessage = new gcm.Message();
	stockMessage.addData('stocks', stocks);
	sender.send(stockMessage, sendId, 4, function(err, result) {
		console.log(result);
	});
};