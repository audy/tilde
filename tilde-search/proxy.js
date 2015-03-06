#!/usr/bin/env node

var userpass = new Buffer("login:password", "ascii").toString("base64");

console.log(userpass);

var httpProxy = require('http-proxy'),
    http      = require('http');

var proxy = httpProxy.createProxyServer({});

var server = http.createServer(function (req, res) {

  req.headers.authorization = "Basic " + userpass;

  console.log(req);

  proxy.proxyRequest(req, res, {
    target: "http://tilde-3814253334.us-east-1.bonsai.io"
  });

})

server.listen(8000);
