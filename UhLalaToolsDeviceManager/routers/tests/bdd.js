/* jshint esversion: 6 */

const express = require('express');
const shell = require('shelljs');
const path = require('path');
const multer = require('multer');
const unzip = require('unzip');
const fs = require('fs');

const bddUtils = require('../../utils/bddUtils')
const reportutils = require('../../utils/reportUtils');

const apks = path.normalize(`${process.cwd()}/apks`);
const tests = path.normalize(`${process.cwd()}/tests`);

var router = express.Router();

router.get('/:appId/version/:version/reports', (req, res) => {
    const { appId, version } = req.params;

    let reports = reportutils.getAvailableReports(appId, version, 'bdd')
    res.json(reports)
})

router.get('/:appId/version/:version/reports/:timestampId', (req, res) => {
    const { appId, timestampId, version } = req.params;
    
    let report = reportutils.getReport(appId, version, 'bdd', timestampId)
    if(!report.error) {
        res.json(report)
    } else {
        res.status(404).json(report.error)
    }
})

router.post('/:appId/version/:version/run', async (req, res) => {
    let { appId, version } = req.params;
    const { avds } = req.body
    res.json({message:'Starting calabash'});
    await bddUtils.runBDD( { appId, version } , avds)
    console.log(`Finsished running bdd tests for app: ${appId}`)
});

router.get('/:appId/run', (req, res) => {
    const { appId } = req.params

    const isRunning = bddUtils.getRunningBdd(appId)

    res.json({isRunning: isRunning})
});

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const appTestPath = path.normalize(`${tests}/${req.params.appId}/${req.params.version}`)
        shell.mkdir('-p', appTestPath)
        cb(null, appTestPath);
    },
    filename: function (req, file, cb) {
        cb(null, `${req.params.version}.zip`);
    }
});

var upload = multer({
    storage: storage
});

router.post('/:appId/version/:version', upload.single('test'), (req, res) => {
    const appTestPath = path.normalize(`${tests}/${req.params.appId}/${req.params.version}`)
    const testZip = path.normalize(`${appTestPath}/${req.params.version}.zip`)
    fs.createReadStream(testZip).pipe(unzip.Extract({ path: appTestPath }));
    shell.rm(testZip);
    res.send('File uploaded');
});

module.exports = router;