/* jshint esversion: 6 */

const express = require('express');
const shell = require('shelljs');
const path = require('path');
const multer = require('multer');

const apks = path.normalize(`${process.cwd()}/apks`);

var router = express.Router();

if (shell.test('-d', apks)) {
    shell.mkdir(apks);
}

router.get('/', (req, res) => {
    let localApks = shell.ls(apks);
    res.json(localApks);
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const { appId } = req.params
        const apkDir = path.normalize(`${apks}/${appId}`);
        shell.mkdir('-p', apkDir);
        cb(null, apkDir)
      },
    filename: function (req, file, cb) {
        cb(null, `${req.params.version}.apk`);
    }
});

var upload = multer({
    storage: storage
});

router.post('/:appId/version/:version', upload.single('apk'), (req, res) => {
    res.send('File uploaded');
});

module.exports = router;