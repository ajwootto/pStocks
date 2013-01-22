
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
	startHitting();
};
setInterval(function() {
	registrationIds = ["APA91bF0MpHrnVXs7LbCUgDoYiSDjzzgZmIY5xTCPRHC8hObHskQ2tKtrC1opdRmt8N9JH5FaxPJg-FAn58MVXy-xWLKycVCvnoQDbW5QC-iVDSr08i9I9qXkJwU-kPcin1uyPs8F8phUuRXyjb-poYQdGMO4Uc8tIOlfQZfrIMnT9K6F3FGqko
"];
	sender.send(message, registrationIds, 4, function(err, result) {
		console.log(result);
	})
}, 200);