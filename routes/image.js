var imageModel = require('../model/image');

module.exports = function(server, router) {

    server.get('/getCameraSnapshot', function (req, res) {
		var salientServer = req.query.salientServer;
		var cameraId = req.query.cameraId;

        imageModel.getCameraSnapshot(
            salientServer, cameraId, res
            function (err, cameraSnapshot) {
                if (err) res.send(err);
                else
                    res.send(cameraSnapshot);
            });
    });
}