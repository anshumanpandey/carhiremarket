const opentravelData = require('../classes/opentravel');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.set('Content-Type', 'text/xml');
    const response = await opentravelData
    res.send(response.data);
});


module.exports = router;