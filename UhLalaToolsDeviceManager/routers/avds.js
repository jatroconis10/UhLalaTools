/* jshint esversion: 6 */

const express = require('express');
const shell = require('shelljs');
const path = require('path');

const avdmanager = path.normalize(`${process.env.ANDROID_HOME}/tools/bin/avdmanager`);

var router = express.Router();


router.get('/', (req, res) => {
    const rawAvds = shell.exec(`${avdmanager} list avd -c`).stdout;
    //Parse output
    const avds = parseOutput(rawAvds);
    res.json(avds);
});

router.get('/devices', (req, res) => {
    const rawDevices = shell.exec(`${avdmanager} list devices -c`).stdout;
    //Parse output
    const devices = parseOutput(rawDevices);
    res.json(devices);
});

router.post('/', (req, res) => {
    const {
        name,
        level,
        device
    } = req.body;
    const image = `"system-images;android-${level};google_apis;x86`;
    console.log(`${avdmanager} create avd -n "${name}" -d "${device}" -k ${image}`);
    shell.exec(`${avdmanager} create avd -n "${name}" -d "${device}" -k ${image}`, (code, stdout, stderr) => {
        if (code == 0) {
            res.json({
                message: "Device created"
            });
        } else {
            res.json({
                error: stderr
            });
        }
    });
});

function parseOutput(stdout) {
    const devices = stdout.split('\n');
    devices[0] = devices[0].split('xml').pop();
    devices.pop();
    return devices;
}

module.exports = router;