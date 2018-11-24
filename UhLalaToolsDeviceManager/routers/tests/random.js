/* jshint esversion: 6 */

const express = require('express');
const shell = require('shelljs');
const path = require('path');

const monkeyUtils = require('../../utils/monkeyUtils');

const apks = path.normalize(`${process.cwd()}/apks`);
const adb = path.normalize(`${process.env.ANDROID_HOME}/platform-tools/adb`);

var router = express.Router();

router.post('/:appId/version/:versionNum/run', async (req, res) => {
    const { appId, versionNum } = req.params
    let {package, events, executions, avds} = req.body;
    res.json({message:'Starting monkey'});
    
    const results = await monkeyUtils.runMonkey(appId, package, events, executions, avds, versionNum);
    console.log(results);
});

module.exports = router; 