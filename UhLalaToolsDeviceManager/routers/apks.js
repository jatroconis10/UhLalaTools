/* jshint esversion: 6 */

const express = require('express');
const shell = require('shelljs');
const path = require('path');

const apks = path.normalize(`${process.cwd()}/apks`);

var router = express.Router();

if (shell.test('-d', apks)) {
    shell.mkdir(apks);
}

router.get('/', (req, res) => {
    let localApks = shell.ls(apks);
    res.json(localApks);
});

module.exports = router;