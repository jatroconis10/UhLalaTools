/* jshint esversion: 6 */

const express = require('express');
const shell = require('shelljs');
const path = require('path');

const emulatorUtils = require('../utils/emulatorUtils');

const emulator = path.normalize(`${process.env.ANDROID_HOME}/emulator/emulator`);
const adb = path.normalize(`${process.env.ANDROID_HOME}/platform-tools/adb`);

var router = express.Router();
var emulatorRunning = false;

router.post('/run', (req, res) => {
    const {
        avd
    } = req.body;
    const result = emulatorUtils.runEmulator(avd)
    if (result.error) {
        res.status(500).json({error: result.error})
    } else {
        res.json({serial:result.serial})
    }
});

router.post('/stop', (req, res) => {
    const { avd } = req.body;

    const result = emulatorUtils.stopEmulator(avd);
    if (result.error) {
        res.status(500).json({error: result.error})
    } else {
        res.json({serial:result.serial})
    }
});

router.get('/status', (req, res) => {
    res.json(emulatorRunning);
});

module.exports = router;