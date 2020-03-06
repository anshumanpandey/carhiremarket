const fs = require('fs');
const express = require('express');
const app = express();
const jsonxml = require('json2xml');
const bodyParser = require('body-parser');

const Fetcher = require('./classes/Fetcher');
const parser = require('./helpers/parser2.js');

let fetcher = new Fetcher();

app.use(bodyParser.urlencoded({    // to support URL-encoded bodies
  extended: true
}));
console.log('----- Working ------');
app.get('/test', (req,res) => {
  return res.send({success: true});
})
app.get('/', async (req, res) => {
  let reqTime = Date.now();
  let query = req.query;
  if(!req.query.location) {
    res.send("Bad query.");
    return true;
  }
  let q = {
      location: query.location,
      puDate: query.puDate,
      puTime: query.puTime,
      doDate: query.doDate,
      doTime: query.doTime
  };
  //res.write('Ahead of calling get search results');
  let script = await fetcher.getSearchResults(q);
   //console.log(script);
  if(!script) {
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

let port = process.env.PORT || 3002;
app.listen(port, () => console.log('App listening on port ' + port))
