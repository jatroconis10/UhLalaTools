var express = require('express');
var Application = require('../../models/application');
var BddTest = require('./models/bdd-test');

var ObjectId = require('mongoose').Types.ObjectId;

var router = express.Router();

router.get('/bdd/:featureId', function(req, res) {
    var id = req.params.featureId;
    BddTest.findById(id, function(err, test) {
        if (err || !test) {
            res.status(404).json({message:'Couldn\'t find the bdd test'})
        } else {
            res.json(test)
        }
    })
})

router.delete('/bdd/:featureId', function(req, res) {
    var id = req.params.featureId;
    BddTest.findByIdAndRemove(id, function(err, test) {
        if(err || !test){
            res.status(404).json({message:'Couldn\'t find the bdd test'})
        } else {
            res.json({message:'Deleted correctly the test'})
        }
    })
})

router.post('/applications/:appId/bdd', function(req, res) {
    var appId = req.params.appId
    Application.findById(appId, function(error, app){
        if(app){
            var testBody = req.body
            var bddTest = new BddTest({
                application: appId,
                feature: testBody.feature,
                scenarios: testBody.scenarios,
                scenariosAlias: testBody.scenariosAlias || [],
            })
            bddTest.save(function(error, savedTest) {
                if (error) return res.status(500).send(error);
                res.json(savedTest);
            });
        } else {
            res.status(404).json({message: 'There isn\'t any app with this id'})
        }
    })
})

router.post('/applications/:appId/bdd/:featureId/scenario/:scenarioId/alias', function(req, res) {
    var appId = req.params.appId;
    var featureId = req.params.featureId;

    BddTest.findById(featureId, function(err, test) {
        if(err) return res.status(500).send(err);
        if(!test) return res.status(404).json({message:'Couldn\'t find the bdd test'});
        if(!(test.application.equals(appId))) return res.status(404).json({message:'Test doesn\t belong to app'});

        var scenarioId = req.params.scenarioId
        var newAlias = req.body;

        //Add validation of incoming alias (it refers to valid commands)

        if(!test.scenariosAlias[scenarioId]) {
            test.scenariosAlias[scenarioId] = {}
        }

        var aliasType = newAlias.type;
        
        if(!test.scenariosAlias[scenarioId][aliasType]) {
            test.scenariosAlias[scenarioId][aliasType] = [] 
        }

        test.scenariosAlias[scenarioId][aliasType].push(newAlias.alias)
        test.save(function(updateErr, updatedTest) {
            if (updateErr) return res.status(500).send(updateErr);
            res.json(updatedTest);
        })
    })
})

module.exports = router