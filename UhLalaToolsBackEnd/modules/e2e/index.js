var express = require('express');
var shell = require('shelljs');
var path = require('path')
var Application = require('../../models/application');
var E2ETest = require('./models/e2e-test');
var scriptManager = require('./scriptManager');

var ObjectId = require('mongoose').Types.ObjectId

var router = express.Router()

router.get('/:testId', function(req, res) {
    var id = req.params.testId;
    E2ETest.findById(id, function(err, test) {
        if (err || !test) {
            res.status(404).json({message:'Couldn\'t find the e2e test'})
        } else {
            var response = {
                _id: test._id,
                commands: test.commands,
                test: {
                    name: test.name,
                    description: test.description
                }
            }
            res.json(response)
        }
    })
})

router.delete('/:testId', function(req, res) {
    var id = req.params.testId;
    E2ETest.findByIdAndRemove(id, function(err, test) {
        if(err || !test){
            res.status(404).json({message:'Couldn\'t find the e2e test'})
        } else {
            res.json({message:'Deleted correctly the test'})
        }
    })
})

router.post('/generateScripts/:appId', function(req, res) {
    var appId = req.params.appId
    console.log( new ObjectId(appId))
    E2ETest.find({application: new ObjectId(appId)})
        .then( (tests) => {
            if (tests.length != 0) {
                scriptManager.testsToScripts(appId, tests)
                res.json({message: "Scripts generados"})
            } else {
                res.status(404).json({message: 'There aren\'t any tests for this app'})
            }
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