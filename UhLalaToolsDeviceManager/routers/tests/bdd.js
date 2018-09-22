/* jshint esversion: 6 */

const express = require('express');
const shell = require('shelljs');
const path = require('path');
const multer = require('multer');
const unzip = require('unzip');
const fs = require('fs');

const apks = path.normalize(`${process.cwd()}/apks`);
const tests = path.normalize(`${process.cwd()}/tests`);

var router = express.Router();

router.post('/run', (req, res) => {
    let {id} = req.body;
    res.json({message:'Starting calabash'});
    shell.cd(`${tests}/${id}`);
    const install = shell.exec(`bundle install`).code;
    const calabash = shell.exec(`bundle exec calabash-android run "${apks}/${id}.apk"`).code;
    shell.cd('../..');
});

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const appTestPath = path.normalize(`${tests}/${req.params.appId}`)
        shell.mkdir('-p', appTestPath)
        cb(null, appTestPath);
    },
    filename: function (req, file, cb) {
        cb(null, `${req.params.appId}.zip`);
    }
});

var upload = multer({
    storage: storage
});

router.post('/:appId', upload.single('test'), (req, res) => {
    const appTestPath = path.normalize(`${tests}/${req.params.appId}`)
    const testZip = path.normalize(`${appTestPath}/${req.params.appId}.zip`)
    fs.createReadStream(testZip).pipe(unzip.Extract({ path: appTestPath }));
    shell.rm(testZip);
    res.send('File uploaded');
});

module.exports = router;