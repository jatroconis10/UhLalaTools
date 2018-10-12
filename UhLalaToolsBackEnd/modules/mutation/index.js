var express = require('express');
var shell = require('shelljs');
var path = require('path');
var MutationTest = require('./models/mutation-test');
var scriptManager = require('./scriptManager');

var ObjectId = require('mongoose').Types.ObjectId;

var router = express.Router();

router.get('/:testId', function (req, res) {
    var id = req.params.testId;
    MutationTest.findById(id, function (err, test) {
        if (err || !test) {
            res.status(404).json({
                message: 'Couldn\'t find the mutation test'
            });
        } else {
            var response = {
                _id: test._id,
                dir: test.dir,
                files: test.files,
                mutate: test.mutate,
                mutator: test.mutator,
                reporters: test.reporters,
                testRunner: test.testRunner,
                testFramework: test.testFramework,
                configFile: test.configFile
            };
            res.json(response);
        }
    });
});

router.delete('/:testId', function (req, res) {
    var id = req.params.testId;
    MutationTest.findByIdAndRemove(id, function (err, test) {
        if (err || !test) {
            res.status(404).json({
                message: 'Couldn\'t find the mutation test'
            });
        } else {
            res.json({
                message: 'Deleted correctly the test'
            });
        }
    });
});

router.post('/create', function (req, res) {
    var testBody = req.body;
    var mutationTest = new MutationTest({
        dir: testBody.dir,
        files: testBody.files,
        mutate: testBody.mutate,
        mutator: testBody.mutator,
        reporters: testBody.reporters,
        testRunner: testBody.testRunner,
        testFramework: testBody.testFramework,
        configFile: testBody.configFile,
    });
    mutationTest.save(function (error, savedTest) {
        if (error) return res.status(500).send(error);
        res.json(savedTest);
    });
});

router.post('/generateStrykerConf/:testId', function (req, res) {
    var testId = req.params.testId;
    MutationTest.findById(testId, function (err, test) {
        if (err || !test) {
            res.status(404).json({
                message: 'There isn\'t any test with this id'
            });
        } else {
            scriptManager.testTranslate(test);
            res.json({
                message: "Archivo conf generado"
            });
        }
    });
});

router.get('/report/:appId', function (req, res) {
    var appId = req.params.appId;
    if (shell.test('-e', `tests/e2e/${appId}/reports/wdio-report.html`)) {
        res.sendFile(path.resolve(`tests/e2e/${appId}/reports/wdio-report.html`));
    } else {
        res.status(404).json({
            message: 'No puede acceder a ese reporte'
        });
    }
});

router.post('/runTests/:testId', async function (req, res) {
    var testId = req.params.testId;
    MutationTest.findById(testId, function (err, test) {
        if (err || !test) {
            res.status(404).json({
                message: 'Can\'t run tests'
            });
        } else {
            scriptManager.runTests(test);
            res.json({
                message: 'Scripts run'
            });
        }
    })
});

module.exports = router;