/* jshint esversion: 6 */

const express = require('express');
const shell = require('shelljs');
const path = require('path');
const multer = require('multer');
const unzip = require('unzip');
const archiver = require('archiver');
const fs = require('fs');

const mutationUtils = require('../../utils/mutantUtils');
const reportutils = require('../../utils/reportUtils');

const apps = path.normalize(`${process.cwd()}/appsSources`);
const mutants = path.normalize(`${process.cwd()}/mutants`);

var router = express.Router();

router.get('/:appId/version/:version/mutants', (req, res) => {
    const {appId, version } = req.params;
    
    let currentMutants = mutationUtils.getMutants(appId, version);
    res.json(currentMutants)
})

router.get('/:appId/version/:version/reports', (req, res) => {
    const {appId, version} = req.params;

    let reports = reportutils.getAvailableReports(appId, version, 'mutants')
    res.json(reports)
})

router.get('/:appId/version/:version/reports/:timestampId', (req, res) => {
    const { appId, version, timestampId } = req.params;
    
    let report = reportutils.getReport(appId, version, 'mutants', timestampId)
    if(!report.error) {
        res.json(report)
    } else {
        res.status(404).json(report.error)
    }
})

router.get('/:appId/version/:version/mutants/:name', (req, res) => {
    const {appId, version} = req.params;
    const name = req.params.name;
    let specificMutant = path.normalize(`${mutants}/${appId}/${version}/mainSources/${name}`)

    res.setHeader('Content-Type', 'application/zip');
    res.attachment(`${name}.zip`)
    const zip = archiver('zip')
    zip.on('error', (err) => {
        throw err;
    });
    zip.pipe(res);
    zip.directory(specificMutant, `/`).finalize();
})

router.post('/:appId/version/:version/mutate', (req, res) => {
    const {appId, version} = req.params;
    let { package, gitUrl } = req.body

    mutationUtils.mutate(appId, version, package, gitUrl)
        .then(result => console.log('Mutantion finished'))
    res.json({message: 'Mutating ' + package })
})


router.post('/:appId/version/:version/run', async (req, res) => {
    const { avds } = req.body;
    const {appId, version} = req.params;

    res.json({message: 'Running mutants'});
    const results = await mutationUtils.runMutants(appId, version, avds);
})

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { appId, version } = req.params;
        const appPath = path.normalize(`${apps}/${appId}/${version}`)
        shell.mkdir('-p', appPath)
        cb(null, appPath);
    },
    filename: function (req, file, cb) {
        cb(null, `${req.params.version}.zip`);
    }
});

var upload = multer({
    storage: storage
});

router.post('/:appId/version/:version', upload.single('app'), (req, res) => {
    const {appId, version} = req.params;
    const appPath = path.normalize(`${apps}/${appId}/${version}`)
    const testZip = path.normalize(`${appPath}/${version}.zip`)
    fs.createReadStream(testZip).pipe(unzip.Extract({ path: appPath }));
    shell.rm(testZip);
    res.send('File uploaded');
});

module.exports = router