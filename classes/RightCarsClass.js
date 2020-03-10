const axios = require('axios').default
const querystring = require('querystring');
const ResponseError = require('../utils/ResponseError')

/**
   * Get response from url making a post request
   * @param {string} url URL to scrap
   * @param {Object} body Data to send in the body of the request
   */
function getSearchResults(url, body) {
  return axios({
    method: 'POST',
    url: url,
    data: querystring.stringify(body),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  })
    .then(r => r.data)
    .catch(r => console.log(r));
}

function Parser(data, q) {
  try {
    if (data.error) {
      throw new ResponseError(data.error);
    }
    let cars = [];
    let details = { 'pickup': {}, 'dropoff': {} };
    details.pickup.location = q.puDate;
    details.pickup.datetime = q.puTime
    details.dropoff.location = q.location
    details.dropoff.datetime = q.doDate

    for (var i = 0; i < data.length; i++) {
      let offer = data[i];
      let car = { vehicle: {} };
      car.vehicle.name = offer.veh_name;
      car.vehicle.doors = offer.cardoor;
      car.vehicle.transmission = offer.cartrans;
      car.vehicle.price = `${offer.carprice} ${offer.currency}`;
      car.vehicle.acriss = offer.acriss;
      cars.push(car);
    }
    let parsed = { scrape: { 'vehicles': cars, 'details': details } };

    return parsed;
  }
  catch (e) {
    if (e instanceof ResponseError) {
      let parsed = { scrape: { 'details': { status: 'API request responded with error.', error: e.message } } };
      return parsed;
    }
    else if (e instanceof TypeError) {
      let parsed = { scrape: { 'details': { status: 'Possibly bad query.', error: e.toString(), response: data } } };
      return parsed;
    } else if (e instanceof SyntaxError) {
      let parsed = { scrape: { 'details': { status: 'Possibly bad query.', error: e.toString(), response: data } } };
      return parsed;
    }
  }
}

module.exports = {
  Fetcher: getSearchResults,
  Parser
};