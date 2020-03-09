const express = require('express');
const router = express.Router();
const convert = require('xml-js');
// const jsonxml = require('json2xml');

const opentravelData = require('../classes/opentravel');

router.get('/', async (req, res) => {
    console.time('opentravel')
    const responses = await Promise.all(Array(30).fill(1).map(() => opentravelData))
    console.timeEnd('opentravel')

    const jsons = responses
    .map(j => convert.xml2json(j.data))
    .map(j => JSON.parse(j))
    .reduce((prev, next) => {
        if (prev === null) return next
        next.elements[0].elements.find(e => e.name === 'VehVendorAvails').elements[0].elements = [
            ...next.elements[0].elements.find(e => e.name === 'VehVendorAvails').elements[0].elements,
            ...prev.elements[0].elements.find(e => e.name === 'VehVendorAvails').elements[0].elements
        ]
        return next;
    }, null);

    

    res.set('Content-Type', 'text/xml');
    res.send(convert.json2xml(jsons));
});

module.exports = router;