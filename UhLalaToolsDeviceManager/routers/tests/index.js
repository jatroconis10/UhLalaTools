/* jshint esversion: 6 */

const express = require('express');

const random = require('./random');
const bdd = require('./bdd');
const mutation = require('./mutation');

var router = express.Router();

router.use('/random', random);
router.use('/bdd', bdd);
router.use('/mutation', mutation);

module.exports = router;