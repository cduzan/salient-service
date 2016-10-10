var _ = require('lodash');
var jsonServer = require('json-server')
var express = require('express');
var server = jsonServer.create() // Returns an Express server
var router = jsonServer.router('db.json') // Returns an Express router
var app = express();

server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});

require("./routes/image")(server);

//server.use(jsonServer.defaults) // logger, static and cors middlewares
//server.use(router) // Mount router on '/'
//server.listen(5005);

