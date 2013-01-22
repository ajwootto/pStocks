
/*
 * GET home page.
 */
 var gcm = require('node-gcm');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
exports.register = function(req, res) {
	var message = new gcm.Message();
	var sender = new gcm.Sender('AIzaSyAS69XB59u8lPtxrpYWfuDjkSzvGz43xP8');
	var registrationIds = [req.body['regId']];
	sender.send(message, registrationIds,4,function(err, result) {
		console.log(result);
	})
}