/* jshint esversion: 6 */

const express = require('express');
const shell = require('shelljs');
const path = require('path');
const multer = require('multer');
const unzip = require('unzip');
const archiver = require('archiver');
const fs = require('fs');

const mutationUtils = require('../../utils/mutantUtils');

const apps = path.normalize(`${process.cwd()}/appsSources`);
const mutants = path.normalize(`${process.cwd()}/mutants`);

var router = express.Router();

router.get('/:appId/mutants', (req, res) => {
    const appId = req.params.appId;
    
    let currentMutants = mutationUtils.getMutants(appId);
    res.json(currentMutants)
})

router.get('/:appId/report', (req, res) => {
    const appId = req.params.appId;
    
    let report = mutationUtils.getAppReport(appId);
    if (report.error) {
        res.status(404).json(report.error)
    } else {
        res.json(report)
    }
})

router.get('/:appId/mutants/:name', (req, res) => {
    const appId = req.params.appId;
    const name = req.params.name;
    let specificMutant = path.normalize(`${mutants}/${appId}/mainSources/${name}`)

    res.setHeader('Content-Type', 'application/zip');
    res.attachment(`${name}.zip`)
    const zip = archiver('zip')
    zip.on('error', (err) => {
        throw err;
    });
    zip.pipe(res);
    zip.directory(specificMutant, `/`).finalize();
})

router.post('/:appId/mutate', (req, res) => {
    const appId = req.params.appId;
    let { package, gitUrl } = req.body

    mutationUtils.mutate(appId, package, gitUrl)
        .then(result => console.log('Mutantion finished'))
    res.json({message: 'Mutating ' + package })
})


router.post('/:appId/run', async (req, res) => {
    const { avds } = req.body;
    const appId = req.params.appId;

    res.json({message: 'Running mutants'});
    const results = await mutationUtils.runMutants(appId, avds);
})

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const appPath = path.normalize(`${apps}/${req.params.appId}`)
        shell.mkdir('-p', appPath)
        cb(null, appPath);
    },
    filename: function (req, file, cb) {
        cb(null, `${req.params.appId}.zip`);
    }
});

var upload = multer({
    storage: storage
});

router.post('/:appId', upload.single('app'), (req, res) => {
    const appPath = path.normalize(`${apps}/${req.params.appId}`)
    const testZip = path.normalize(`${appPath}/${req.params.appId}.zip`)
    fs.createReadStream(testZip).pipe(unzip.Extract({ path: appPath }));
    shell.rm(testZip);
    res.send('File uploaded');
});

module.exports = router