/* jshint esversion: 6 */

const express = require('express');
const shell = require('shelljs');
const path = require('path');

const apks = path.normalize(`${process.cwd()}/apks`);
const adb = path.normalize(`${process.env.ANDROID_HOME}/platform-tools/adb`);

var router = express.Router();

router.post('/run', (req, res) => {
    let {apk, package, events, seed} = req.body;
    seed = seed || 12345;
    res.json({message:'Starting monkey'});
    const install = shell.exec(`${adb} install -r -t ${apks}/${apk}`).code;
    const monkey = shell.exec(`${adb} shell monkey -p ${package} -v -s ${seed} ${events}`).code;
});

module.exports = router;