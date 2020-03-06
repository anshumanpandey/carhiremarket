//FOR POLYFILLING REQUIRE.JS
//See response for more details.
const define = function(name, empty_array = [], fn) {
  return fn();
};

module.exports.extractCars = function(script, q) {
 try {
	// console.log("hello 1");
  // let resultObject = eval(script);
  let resultObject = JSON.parse(script);
  //console.log("hello 2");
  let cars = [];
  let details = { 'pickup' : {}, 'dropoff' : {}};
  details.pickup.location = q.puDate;
  details.pickup.datetime = q.puTime
  details.dropoff.location = q.location
  details.dropoff.datetime = q.doDate

  for (var i = 0; i < resultObject.results.length; i++) {
    let offer = resultObject.results[i];
    let car = {vehicle : {}};
    car.vehicle.name = offer.car.vehicle.name;
    car.vehicle.seats = offer.car.vehicle.passengers;
    car.vehicle.data_sipp = offer.car.revisedCategory + offer.car.vehicle.isAutomatic ? 'Automatic' : 'Manual';
    car.vehicle.doors = offer.car.vehicle.doors;
    car.vehicle.bag = offer.car.vehicle.bags;
    car.vehicle.transmission = offer.car.vehicle.isAutomatic ? 'Automatic' : 'Manual';
    car.vehicle.price = `${offer.price.standard.amount} ${offer.price.standard.currency}`;
    car.vehicle.company = offer.vendor.name;
    car.vehicle.CWD = offer.info.hasCdw ? 1 : 0;
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

