const request = require('request');
const fs = require('fs');
const parser = require('../helpers/parser.js');
const UAs = require('../helpers/fakeua.js');

function Fetcher(opts) {
  console.log("Fetcher started-------------------------------------------------.");
}

Fetcher.prototype.getSearchResults = async function(q) {
  return new Promise((resolve,reject) => {
    let cookieJar = request.jar();
	//console.log("getSearchResults");
    //let url = `https://www.expedia.com/cars/api/pickup/list/results/script?dpln=${q.location}&date1=${q.doDate}&time1=${q.puTime}&date2=${q.doDate}&time2=${q.doTime}&age=30`
	//let url =`https://www.expedia.com/carsearch?locn=New+York%2C+NY+%28JFK-John+F.+Kennedy+Intl.%29&pickupIATACode=JFK&dpln=4933194&pickupCountryCode=US&loc2=Shelton%2C+Connecticut&returnIATACode=HVN&drid1=9795&returnCountryCode=US&date1=02%2F18%2F2020&time1=1030AM&date2=02%2F19%2F2020&time2=1030AM&dagv=1&subm=1&fdrp=0&ttyp=2&acop=2&rdus=10&rdct=1&styp=4&olat=40.644166&olong=-73.782548&dlat=41.303991&dlong=-73.137494`
    //let url = `https://www.imdb.com/title/tt8579674/?ref_=hm_fanfav_tt_1_pd_fp1`;
     let url = `https://www.expedia.com/cars/api/pickup/list/results/script?dpln=${q.location}&bt=45&ageInRange=true&date2=${q.doDate}&time2=${q.doTime}&date1=${q.puDate}&time1=${q.puTime}`
	 //let url = `https://www.expedia.com/cars/api/pickup/list/results/script?time1=1030AM&time2=1030AM&bt=52&ageInRange=true&dpln=5783884&date2=02%2F19%2F2020&date1=02%2F18%2F2020`
	 //let url = `https://www.expedia.com/cars/api/pickup/list/results/script?loc2=Shelton%2C%20Connecticut&retrieveUrgencyCount=true&dagv=1&pickupIATACode=LAX&returnIATACode=HVN&styp=4&time1=1030AM&time2=1030AM&bt=52&fdrp=0&dlong=-73.137494&dlat=41.303991&rdct=1&ageInRange=true&returnCountryCode=US&subm=1&locn=Los%20Angeles%2C%20CA%20%28LAX-Los%20Angeles%20Intl.%29&drid1=9795&dpln=5783884&ttyp=2&olat=33.94415&rdus=10&olong=-118.4032&pickupCountryCode=US&date2=02%2F19%2F2020&date1=02%2F18%2F2020&retrieveNeighborhoods=true&acop=2`
	 console.log('http://api.scraperapi.com/?api_key=1bc5dab9592c5fa13890a548d4f82445&url=' + encodeURIComponent(url));
    let options = {
        method: 'GET',
        uri: 'http://api.scraperapi.com/?api_key=1bc5dab9592c5fa13890a548d4f82445&url=' + encodeURIComponent(url),
        
		headers: {
           'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
           'accept-encoding': 'gzip, deflate, br',
           'accept-language': 'en-US;q=0.9,en;q=0.7,he;q=0.6,ru;q=0.5',
           'authority': 'www.expedia.com',
           'cache-control': 'no-cache',
           'Access-Control-Allow-Origin' : '*',
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
    request(options, function(error, response, body) {
        if(error) {
	  console.log(error);
          resolve(false);
        }
        resolve(body);
		//console.log(response);
    });
  });
};

module.exports = Fetcher;
