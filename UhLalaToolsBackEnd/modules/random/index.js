var express = require('express');
var shell = require('shelljs');
var path = require('path')
var Application = require('../../models/application');
var RandomTest = require('./models/random-test');
var scriptManager = require('./scriptManager');

var ObjectId = require('mongoose').Types.ObjectId

var router = express.Router()

router.get('/:testId', function(req, res) {
    var id = req.params.testId;
    RandomTest.findById(id, function(err, test) {
        if (err || !test) {
            res.status(404).json({message:'Couldn\'t find the random test'})
        } else {
            var response = {
                _id: test._id,
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
    RandomTest.findByIdAndRemove(id, function(err, test) {
        if(err || !test){
            res.status(404).json({message:'Couldn\'t find the random test'})
        } else {
            res.json({message:'Deleted correctly the test'})
        }
    })
})

router.post('/generateScripts/:appId', function(req, res) {
    var appId = req.params.appId
    console.log( new ObjectId(appId))
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

router.post('/runScripts/:appId', function(req, res) {
    var appId = req.params.appId
    if(scriptManager.runScripts(appId)) {
        res.json({message: 'Scripts run'})
    } else {
        res.status(404).json({message: 'Can\'t run tests for this app'})
    }
})

module.exports = router