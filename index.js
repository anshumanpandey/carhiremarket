const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const rootRoute = require('./routes/root');

app.use(bodyParser.urlencoded({    // to support URL-encoded bodies
  extended: true
}));
console.log('----- Working ------');
app.get('/test', (req,res) => {
  return res.send({success: true});
})
app.use('/', rootRoute);


let port = process.env.PORT || 3002;
app.listen(port, () => console.log('App listening on port ' + port))
