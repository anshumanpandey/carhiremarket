const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const rootRoute = require('./routes/root');
const rightCarsRoute = require('./routes/right-cars');

app.use(bodyParser.urlencoded({    // to support URL-encoded bodies
  extended: true
}));
console.log('----- Working ------');
app.get('/test', (req,res) => {
  return res.send({success: true});
})
app.use('/', rootRoute);
app.use('/', rightCarsRoute);


let port = process.env.PORT || 3029;
app.listen(port, () => console.log('App listening on port ' + port))
