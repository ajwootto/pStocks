
/*
 * GET home page.
 */
var gcm = require('node-gcm');
var message = new gcm.Message();
message.addData('key1', 'vicisdick');
var sender = new gcm.Sender('AIzaSyAS69XB59u8lPtxrpYWfuDjkSzvGz43xP8');
var registrationIds = [];
var startHitting = function() {
	
}

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.register = function(req, res) {
	registrationIds.push[req.body['regId']];
	sender.send(message, registrationIds, 4, function(err, result) {
		console.log(result);
	})
	res.send('sup');
};
setInterval(function() {
	registrationIds = ["APA91bFO8ZprtNng7gRGR8q5Liq0Wtxabek1IIwFruBTTjY0yCpDFcNhCWIm8N3dk8APvylyc0MrVuWztQ5Jdy3_66drtf3g4dhGFQL-3vki7M7gJMcJwPOhtZ5mxL257_aunNaW2el2qFARuEOCowsZmfRvOT0iaw
"];
	sender.send(message, registrationIds, 4, function(err, result) {
		console.log(result);
	})
}, 1000);