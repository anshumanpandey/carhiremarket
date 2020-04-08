const request = require('request');
const fs = require('fs');
const parser = require('../helpers/parser.js');
const UAs = require('../helpers/fakeua.js');

function Fetcher(opts) {
  console.log("Fetcher started-------------------------------------------------.");
}

Fetcher.prototype.getSearchResults = async function (q) {
  return new Promise((resolve, reject) => {
    let cookieJar = request.jar();
    let url = `https://carhiremarket-mobile.carhire-solutions.com/api/ota/search?currency=${q.c || 'USD'}&smarket=${q.country}&diata=${q.location}&dday=${q.doDate.split(/\//g)[0]}&dmonthyear=${q.doDate.split(/\//g)[1]}.${q.doDate.split(/\//g)[2]}&dtime=${q.doTime}&piata=${q.location}&pday=${q.puDate.split(/\//g)[0]}&pmonthyear=${q.puDate.split(/\//g)[1]}.${q.puDate.split(/\//g)[2]}&ptime=${q.puTime}`

    let options = {
      method: 'GET',
      uri: 'http://api.scraperapi.com/?api_key=1bc5dab9592c5fa13890a548d4f82445&url=' + encodeURIComponent(url),

      headers: {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US;q=0.9,en;q=0.7,he;q=0.6,ru;q=0.5',
        'authority': 'www.expedia.com',
        'cache-control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'pragma': 'no-cache',
        'upgrade-insecure-requests': '1',
        'user-agent': UAs.next(),
        'origin': 'https://www.expedia.com'
      },
      jar: cookieJar,
      //proxy : 'http://lum-customer-hl_36d73268-zone-zone1:f9qe8ja064ff@zproxy.lum-superproxy.io:22225',
      gzip: true
    };
    //console.log("Requesting page: " + options.uri);
    request(options, function (error, response, body) {
      if (error) {
        resolve(false);
      }
      resolve(body);
      //console.log(response);
    });
  });
};

module.exports = Fetcher;
