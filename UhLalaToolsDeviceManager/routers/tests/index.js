const express = require('express');

const random = require('./random')
const bdd = require('./bdd');

var router = express.Router();

router.use('/random', random);
router.use('/bdd', bdd);

module.exports = router;