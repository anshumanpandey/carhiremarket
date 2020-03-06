//FOR POLYFILLING REQUIRE.JS
//See response for more details.
const define = function(name, empty_array = [], fn) {
  return fn();
};

module.exports.extractCars = function(script) {
 try {
	// console.log("hello 1");
  let resultObject = eval(script);
  //let resultObject = JSON.parse(script);
  //console.log("hello 2");
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
    cars.push(car);
  }
  let parsed = { scrape : {'vehicles' : cars, 'details' : details}};
  return parsed;
 }
 catch(e) {
   if (e instanceof SyntaxError) {
     let parsed = {scrape : {'details' : { status : 'Request caught by the server.', error: e.toString() }}};
   	 return parsed;
   }
   else if(e instanceof TypeError) {
     let parsed = {scrape : {'details' : { status : 'Possibly bad query.', error: e.toString(), response: script }}};
     return parsed;
   }
 }
}

