const fs = require('fs');
const jsonxml = require('json2xml');
const express = require('express');
const router = express.Router();

const Fetcher = require('../classes/Fetcher');
const parser = require('../helpers/parser2.js');

let fetcher = new Fetcher();

router.get('/carhiremarket', async (req, res) => {
    let reqTime = Date.now();
    let query = req.query;
    if (!req.query.location) {
        res.send("Bad query.");
        return true;
    }
    let q = {
        location: query.location,
        puDate: query.puDate,
        puTime: query.puTime,
        doDate: query.doDate,
        doTime: query.doTime,
        currency: query.currency,
        country: query.country,
    };
    //res.write('Ahead of calling get search results');
    let script = await fetcher.getSearchResults(q);
    //console.log(script);
    if (!script) {
        res.write('Failed to get the response from expedia');
        res.end();
        return false;
    }
    //console.log("calling parser class");
    let parsed = parser.extractCars(script, q);
    res.set('Content-Type', 'text/xml');
    //res.write(parsed)
    res.write('<?xml version="1.0" encoding="UTF-8"?>' + jsonxml(parsed));
    res.end();
    //res.send(parsed);
    return true;
});

module.exports = router;