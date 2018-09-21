const express = require('express');
const shell = require('shelljs');
const path = require('path');

const emulator = path.normalize(`${process.env.ANDROID_HOME}/emulator/emulator`)
const adb = path.normalize(`${process.env.ANDROID_HOME}/platform-tools/adb`)

var router = express.Router();
var emulatorRunning = false;

router.post('/run', (req, res) => {
    if (emulatorRunning) return res.status(401).json({error:'Emulator already running'})
    const {avd} = req.body;
    res.json({message:'Starting emulator'})
    shell.exec(`${emulator} -avd ${avd}`, (code) => {
        console.log(`Finished emulator with code: ${code}`)
        emulatorRunning = false;
    })
    emulatorRunning = true;
})

router.post('/stop', (req, res) => {
    if(!emulatorRunning) {
        res.status(404).json({error: 'There is no emulator running'})
    } else {
        shell.exec(`${adb} emu kill`)
        res.json({message: 'Stopped the emulator'})
    }

})

router.get('/status', (req, res) => {
    res.json(emulatorRunning);
})

module.exports = router;