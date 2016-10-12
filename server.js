var natsOptions = {
    url: "nats://oriondev.commandbridge.com:4222",
    reconnect: true,
    maxReconnectAttempts: 5,
    reconnectTimeWait: 1000
};

var nats = require('nats').connect(natsOptions);
var base64 = require('node-base64-image');

nats.on('error', function(e) {
    console.log('Error [' + nats.options.url + ']: ' + e);
    process.exit();
});

nats.on('close', function() {
    console.log('CLOSED');
    process.exit();
});

nats.subscribe('‌getSalientSnapshot', function(request, replyTo) {
    console.log('Received "' + request + '"');
    console.log('From "' + replyTo + '"');

    var req = JSON.parse(request);

    getSalientSnapshot(req.endpoint, function(err, results) {
        console.log('getSalientSnapshot');
        console.log(results);

        var msg = {
            imageSrc: 'data:image/jpeg;base64,' + results
        };

        nats.publish(replyTo, JSON.stringify(msg));
    });
});
console.log('Subscribe to: getSalientSnapshot');

function getSalientSnapshot(endpoint, callback) {

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

    //var authHeader = basic(username, password);

    /*request
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
     .pipe(res);*/


    base64.encode(endpoint, {string: true}, function(err, result) {
        if (err) {
            console.log(err);
            return callback(err);
        }
        return callback(err, result);
    });
}