//FOR POLYFILLING REQUIRE.JS
//See response for more details.
const define = function (name, empty_array = [], fn) {
  return fn();
};

const ResponseError = require('../utils/ResponseError')


module.exports.extractCars = function (script, q) {
  try {
    let resultObject = JSON.parse(script);
    if (resultObject.error) {
      throw new ResponseError(resultObject.error);
    }
    let cars = [];
    let details = { 'pickup': {}, 'dropoff': {} };
    details.pickup.location = q.puDate;
    details.pickup.datetime = q.puTime
    details.dropoff.location = q.location
    details.dropoff.datetime = q.doDate

    const results = resultObject.results;
    for (var i = 0; i < results.length; i++) {
      let offer = results[i];
      let car = { vehicle: {} };
      car.vehicle.name = offer.car.vehicle.name;
      car.vehicle.seats = offer.car.passengers;
      car.vehicle.data_sipp = `${offer.car.revisedCategory} ${offer.car.isAutomatic ? 'Automatic' : 'Manual'}`;
      car.vehicle.doors = offer.car.doors;
      car.vehicle.bag = offer.car.bags;
      car.vehicle.transmission = offer.car.isAutomatic ? 'Automatic' : 'Manual';
      car.vehicle.price = `${offer.price.preferred.amount} ${offer.price.preferred.currency}`;
      car.vehicle.company = offer.vendor.name;
      car.vehicle.acriss = offer.car.vehicle.acriss;
      const cdw = offer.info.inclusions.info.find(i => i.code === 'CDW');
      let cdwTag = ''
      
      if (cdw.excess === null && cdw.reimbursedExcess === true) {
        cdwTag = 0;
      }

      if (cdw.excess !== null ) {
        if (cdw.excess.hasOwnProperty('amount') ) {
          cdwTag = 0;
        }

        if (cdw.excess.hasOwnProperty('unknown') && cdw.reimbursedExcess === true) {
          cdwTag = 2;
        }
      }

      if (!cdw.reimbursedExcess) {
        cdwTag = 1;
      }

      car.vehicle.CDW = cdwTag;
      
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
      let parsed = { scrape: { 'details': { status: 'Possibly bad query.', error: e.toString(), response: script } } };
      return parsed;
    } else if (e instanceof SyntaxError) {
      let parsed = { scrape: { 'details': { status: 'Possibly bad query.', error: e.toString(), response: script } } };
      return parsed;
    }
  }
}

