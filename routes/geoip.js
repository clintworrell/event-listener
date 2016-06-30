"use strict";

let express = require('express'),
    router = express.Router(),
    geoip = require('geoip-lite'),
    requestIp = require('request-ip');

router.use(requestIp.mw());
router.use(function(req, res, next){
  var ip = req.clientIp;
  var geo = geoip.lookup(ip);
  res.locals.location = {
    city: geo.city,
    state: geo.region,
    country: geo.country
  };

  res.json({ip: ip, geo:geo});
});

module.exports = router;
