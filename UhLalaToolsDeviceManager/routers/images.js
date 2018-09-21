/* jshint esversion: 6 */

var express = require('express');
var shell = require('shelljs');
var path = require('path');

const sdkmanager = path.normalize(`${process.env.ANDROID_HOME}/tools/bin/sdkmanager`);
const images = path.normalize(`${process.env.ANDROID_HOME}/system-images/`);

var router = express.Router();

router.get('/', (req, res) => {
    let installedImages = shell.ls(images);
    res.json(installedImages);
});

router.post('/:version', (req, res) => {
    const androidVersion = `android-${req.params.version}`;
    shell.exec(`${sdkmanager} "system-images;${androidVersion};google_apis;x86"`, (code, stdout, stderr) => {
        console.log('Exit code:', code);
        console.log('Program output:', stdout);
        console.log('Program stderr:', stderr);
    });
    res.json({
        message: `Trying to install: ${androidVersion}`
    });
});

module.exports = router;