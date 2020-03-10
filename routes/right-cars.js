const jsonxml = require('json2xml');
const express = require('express');
const router = express.Router();

const RightCars = require('../classes/RightCarsClass');

router.get('/right-cars', async (req, res) => {
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
    const urlToScrap = `https://www.right-cars.com/mobile/search-vehicle.php`;
    console.time('right-cars')
    const dataArray = await Promise.all(Array(30).fill(0).map(() => {
        return RightCars.Fetcher(urlToScrap, {
            pickuplocation: "DBVA01",
            pickup_date: q.puDate.replace(/\//g, '-'),
            pickuptime: q.puTime,
            dropoff_date: q.doDate.replace(/\//g, '-'),
            dropofftime: q.doTime,
        });
    }));
    if (!dataArray.filter(i => i === undefined || i === null).length < 0) {
        res.write('Failed to get the response from right-cars.com');
        res.end();
        return false;
    }
    const parsedValues = dataArray.map((d) => RightCars.Parser(d, q));
    let parsed = parsedValues.reduce((prev, next) => {
        if (prev === null) return next;
        next.scrape.vehicles = [ ...prev.scrape.vehicles, ...next.scrape.vehicles] 
        return next;
    }, null);
    res.set('Content-Type', 'text/xml');

    res.write('<?xml version="1.0" encoding="UTF-8"?>' + jsonxml(parsed));
    res.end();
    console.timeEnd('right-cars')
    return true;
});

module.exports = router;