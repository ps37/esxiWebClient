"use strict";

let express = require("express");
let fs = require("fs");
let httpProxy = require("http-proxy");
let https = require("https");
let path = require("path");

let proxy = httpProxy.createProxyServer({
    secure: process.env.NODE_TLS_REJECT_UNAUTHORIZED !== "0"
});

proxy.on("error", function(err, req, res) {
    res.status(500).end();
});

let app = express();

app.use(function(req, res, next) {

    //console.log(req);

    if (/xsd|wsdl/.test(req.url) || /post/i.test(req.method)) {

        //console.log('in express if: ', req);

        req.url = req.originalUrl;
        proxy.web(req, res, {
            target: req.headers["vsphere-target"]
        });
    } else {

        //console.log('in express else: ', req);

        return next();
    }
});

app.use("/vsphere.js", express.static(path.join(__dirname, "/dist/vsphere.js")));

app.use("/node_modules", express.static(path.join(__dirname, "/node_modules")));

app.use(express.static(path.join(__dirname, "")));

let options = {
    pfx: fs.readFileSync(path.join(__dirname, "/sample.pfx"))
};

https.createServer(options, app).listen(4443);

console.log("The app is now available at https://localhost:4443");
