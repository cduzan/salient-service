var _ = require('lodash');
var request = require('request');
var proxy = require('../lib/remote-proxy')({});
var basic = require('basic-authorization-header');

function _getCameraSnapshot(salientServer, cameraId, res, callback) {
		
	/* http://192.168.250.202:8080/cameras/2/media?accept=image/jpeg */
	var username = "admin";
	var password = "popb111";
	
	/*request({
        url: 'http://' + salientServer + ':8080/cameras/' + cameraId + '/media?accept=image/jpeg',
        method: 'GET'
    }, function(error, response, body){
        if(error) return callback(error);
        else callback(null, response);
    });*/
	
	var authHeader = basic("admin", "popb111");

    request
        .get({
            url: 'http://' + salientServer + ':8080/cameras/' + cameraId + '/media?accept=image/jpeg',
            method: 'GET',
			headers: {
			  'Authorization': authHeader
			}
        })
        .on('error', function(err) {
            callback(err);
        })
        .pipe(res);
}

exports.getCameraSnapshot = proxy.register("getCameraSnapshot", _getCameraSnapshot);
