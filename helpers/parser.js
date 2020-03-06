//FOR POLYFILLING REQUIRE.JS
//See response for more details.
const define = function(name, empty_array = [], fn) {
  return fn();
};

module.exports.extractCars = function(script) {
 try {
  console.log("hello");
  let resultObject = eval(script);
  
  let cars = [];
  let details = { 'pickup' : {}, 'dropoff' : {}};
  details.pickup.location = resultObject.adTargetingData.d[0];
  details.pickup.datetime = resultObject.adTargetingData.ets
  details.dropoff.location = resultObject.adTargetingData.d[0];
  details.dropoff.datetime = resultObject.adTargetingData.ete
  for (var i = 0; i < resultObject.offers.length; i++) {
    let offer = resultObject.offers[i];
    let car = {vehicle : {}};
    car.vehicle.name = offer.vehicle.exampleMakeModel;
    car.vehicle.seats = offer.vehicle.passengerCapacity.end;
    car.vehicle.data_sipp = offer.vehicle.classification.code + offer.vehicle.transmission[0];
    car.vehicle.doors = offer.vehicle.doorCount.end;
    car.vehicle.bag = offer.vehicle.luggageCapacity.end;
    car.vehicle.transmission = offer.vehicle.transmission;
    car.vehicle.price = offer.fare.total.formattedValue;
    car.vehicle.company = offer.vendor.name;
    car.vehicle.CWD = 0;
	console.log("Car name:: " + car.vehicle.name);
	console.log("Car price:: " + car.vehicle.price);
    cars.push(car);
  }
  let parsed = { scrape : {'vehicles' : cars, 'details' : details}};
  return parsed;
 }
 catch(e) {
        console.log(e);
	let parsed = {scrape : {'details' : { status : 'failed', error: e.toString()}}};
	return parsed;
 }
}
