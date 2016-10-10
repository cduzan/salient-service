// Remote proxy is a prototype class to handle calls of registered methods remotely but transparent to the caller
// At this time it leverages NATS exclusively for msg exchange bu could consider making that adaptable
// -- Not a lot of error handling yet and it assumes that callers always use callbacks for async method calls
var nats = require("nats");
var proxyConfig = require("./proxy.json");

var natsOptions = {
	//172.22.204.133 - PBSO Orion
    url: "nats://oriondev.commandbrigde.com:4222",
    reconnect: true,
    maxReconnectAttempts: 5,
    reconnectTimeWait: 1000
    //user: "natsuser",
    //pass: "@SLv<ptg2S^B@+6M"
};

var _remoteProxy = null;
module.exports = function(options) {
    if(_remoteProxy == null)
        _remoteProxy = new RemoteProxy(options);
    return _remoteProxy;
};

function RemoteProxy(options) {
    // -- will always be nats for now
    var transport = proxyConfig.transports[proxyConfig.transport];
    natsOptions.url = transport.url || natsOptions.url;
    //natsOptions.user = transport.user || natsOptions.user;
    //natsOptions.pass = transport.pass || natsOptions.pass;

    this.methods = {};

    this.natsClient = new nats.connect(natsOptions);

    this.natsClient.on('close', function () {
        console.log("close NATS");
    });

    this.natsClient.on('disconnect', function () {
        console.log("disconnect NATS");
    });

    this.natsClient.on('reconnecting', function () {
        console.log("reconnecting NATS");
    });

    this.natsClient.on('error', function (err) {
        console.log(err);
    });
}

RemoteProxy.prototype.register = function(methodName, method) {
    var self = this;
    self.methods[methodName] = method;

    if(proxyConfig.mode == "proxy") {

        // -- modes should be local, proxy-local (for testing), proxy-remote
        // -- or local, maybe proxy-publisher, proxy-subscriber, proxy-both (for test)
        if(false) {
        self.natsClient.subscribe(methodName, function (msg, replyTo, subject) {
            console.log('request recieved for method: ' + subject);
            var args = JSON.parse(msg).args;
            // -- confirm args is an array (empty if no args)
            var f = self.methods[subject];
            var cb =
                function (err, result) {
                    self.natsClient.publish(replyTo, JSON.stringify(result));
                };
            args.push(cb);
            f.apply(null, args);
        });
        }

        return function () {
            // -- last arg will be callback so let's remove that and save because we wont need it
            // -- maybe check if last is callback (function) and use callback if available otherwise return
            var args = Array.from(arguments);
            var callback = args.pop();
            self.natsClient.request(methodName,
                JSON.stringify({"args": args}),
                {'max': 1},
                function (response) {
                    //console.log('Response: ' + response);
                    callback(null, JSON.parse(response));
                });
        };
    }
    else {
        return self.methods[methodName];
    }

}
