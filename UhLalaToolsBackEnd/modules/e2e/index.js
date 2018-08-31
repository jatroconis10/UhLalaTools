var express = require('express');
var shell = require('shelljs');
var path = require('path')
var Application = require('../../models/application');
var Test = require('../../models/test');
var scriptManager = require('./scriptManager');

var router = express.Router()

router.post('/generateScripts/:appId', function(req, res) {
    var appId = req.params.appId
    Test.find({application: appId, type: 'e2e'})
        .then( (tests) => {
            scriptManager.testsToScripts(appId, tests)
            res.json({message: "Scripts generados"})
        })
})

router.post('/runScripts/:appId', function(req, res) {
    var appId = req.params.appId
    if(scriptManager.runScripts(appId)) {
        res.json({message: 'Scripts run'})
    } else {
        res.status(404).json({message: 'Can\t run tests for this app'})
    }
})

router.get('/report/:appId', function(req, res) {
    var appId = req.params.appId;
    if(shell.test('-e', `tests/e2e/${appId}/reports/wdio-report.html`)) {
        res.sendFile(path.resolve(`tests/e2e/${appId}/reports/wdio-report.html`));
    } else {
        res.status(404).json({message: 'No puede acceder a ese reporte'})
    }
})

module.exports = router