//FOR POLYFILLING REQUIRE.JS
//See response for more details.
const define = function (name, empty_array = [], fn) {
  return fn();
};

const ResponseError = require('../utils/ResponseError')

function resolveCdw(cdw) {
  /*
  reimbursedExcess == false ? CDW = 2 and exit
  reimbursedExcess == true ? CDW = 0 and exit
  excess.amount OR excess.unknown ? CDW = 1 and exit
  otherwise CDW = 2 and exit
  */

  const result = {
    cdwTag: 2,
    excess: `reimbursedExcess === false`
  }

  if (cdw.reimbursedExcess == false) {
    return result
  }

  if (cdw.reimbursedExcess === true) {
    result.cdwTag = 0;
    result.excess = `cdw.reimbursedExcess === true`
    return result
  }

  if (cdw.excess !== null) {
    if (cdw.excess.hasOwnProperty('amount')) {
      result.cdwTag = 1;
      result.excess = `amount: ${cdw.excess.amount}`
    }

    if (cdw.excess.hasOwnProperty('unknown')) {
      result.cdwTag = 1;
      result.excess = 'unknown'
    }
    return result;
  }

  return result;

}


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
      const resolved = resolveCdw(cdw)
      car.vehicle.CDW = resolved.cdwTag;
      car.vehicle.excess = resolved.excess

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

