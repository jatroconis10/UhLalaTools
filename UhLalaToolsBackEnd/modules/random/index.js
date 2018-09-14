var express = require('express');
var Application = require('../../models/application');
var RandomTest = require('./models/random-test').RandomTest;
var scriptManager = require('./scriptManager');

var ObjectId = require('mongoose').Types.ObjectId

var router = express.Router()

router.get('/random/:testId', function(req, res) {
    var id = req.params.testId;
    RandomTest.findById(id, function(err, test) {
        if (err || !test) {
            res.status(404).json({message:'Couldn\'t find the random test'})
        } else {
            res.json(test)
        }
    })
})

router.delete('/random/:testId', function(req, res) {
    var id = req.params.testId;
    RandomTest.findByIdAndRemove(id, function(err, test) {
        if(err || !test){
            res.status(404).json({message:'Couldn\'t find the random test'})
        } else {
            res.json({message:'Deleted correctly the test'})
        }
    })
})

router.post('/applications/:appId/random', function(req, res) {
    var appId = req.params.appId
    Application.findById(appId, function(error, app){
        if(app){
            var testBody = req.body
            var randomTest = new RandomTest({
                application: appId,
                name: testBody.name,
                startUrl: testBody.startUrl || app.url,
                description: testBody.description,
                numRuns: testBody.numRuns,
                numGremlins: testBody.numGremlins
            })
            randomTest.save(function(error, savedTest) {
                if (error) return res.status(500).send(error);
                res.json(savedTest);
            });
        } else {
            res.status(404).json({message: 'There isn\'t any app with this id'})
        }
    })
})

router.post('/applications/:appId/random/generateScripts', function(req, res) {
    var appId = req.params.appId
    Application.findById(appId, function(error, app){
        if(app){
            RandomTest.find({application: new ObjectId(appId)})
            .then( (tests) => {
                if (tests.length != 0) {
                    scriptManager.testsToScripts(app, tests)
                    res.json({message: "Scripts generados"})
                } else {
                    res.status(404).json({message: 'There aren\'t any tests for this app'})
                }
            })
        } else {
            res.status(404).json({message: 'There isn\'t any app with this id'})
        }
    })
})

router.post('/applications/:appId/random/runScripts', function(req, res) {
    var appId = req.params.appId
    if(scriptManager.runScripts(appId)) {
        res.json({message: 'Scripts run'})
    } else {
        res.status(404).json({message: 'Can\'t run tests for this app'})
    }
})

router.post('/applications/:appId/random/run', function(req, res) {
    var appId = req.params.appId
    Application.findById(appId, function(error, app){
        if(app){
            RandomTest.find({application: new ObjectId(appId)})
                .then((tests) => {
                    scriptManager.runTests(app, tests)
                    res.json({message: 'Scripts run'})
                })
            
        } else {
            res.status(404).json({message: 'There isn\'t any app with this id'})
        }
    })
})

module.exports = router