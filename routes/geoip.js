"use strict";

let express = require('express'),
    router = express.Router(),
    geoip = require('geoip-lite'),
    requestIp = require('request-ip');

router.use(requestIp.mw());
router.use(function(req, res) {
    // on localhost you'll see 127.0.0.1 if you're using IPv4
    // or ::1, ::ffff:127.0.0.1 if you're using IPv6
    var ip = req.clientIp;
    var geo = geoip.lookup(ip);
    res.json({ip: ip, geo:geo});
});

module.exports = router;
