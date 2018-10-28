var express = require('express');
var ChaosMonkeyConfiguration = require('./models/chaosMonkeyConfiguration');
var chaosMonkeyRunner = require('./chaosMonkeyDocker');

var router = express.Router();

router.get('/', function(req, res) {
    ChaosMonkeyConfiguration.find({}, function(err, chaosMonkeyConfigurations) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(chaosMonkeyConfigurations);
        }
    })
});

router.get('/:chaosMonkeyId', function(req, res) {
    var id = req.params.chaosMonkeyId;
    ChaosMonkeyConfiguration.findById(id, function (err, chaosMonkey) {
        if (err || !chaosMonkey) {
            res.status(404).json({ message: 'Could not find the chaos monkey' });
        } else {
            res.send(chaosMonkey);
        }
    });
});

router.patch('/:chaosMonkeyId/run', function(req, res) {
    var id = req.params.chaosMonkeyId;
    ChaosMonkeyConfiguration.findById(id, function(err, chaosMonkey) {
        if (err) {
            res.status(500).send(err);
        } else if (!chaosMonkey) {
            res.status(404).json({ message: 'Could not find the chaos monkey' });
        } else {
            chaosMonkeyRunner.runChaosMonkey(chaosMonkey);
            res.send({message: 'The chaos monkey was initiated'});
        }
    })
});

router.post('/', function(req, res) {
    var chaosMonkeyConfiguration = new ChaosMonkeyConfiguration(req.body);
    chaosMonkeyConfiguration.save(function (err, savedChaosMonkeyConfiguration) {
        if (err) {
            return res.status(500).send(err);
        } else {
            
        }
    });
});

router.delete('/:chaosMonkeyId', function (req, res) {
    var id = req.params.chaosMonkeyId;
    ChaosMonkeyConfiguration.findByIdAndRemove(id, function (err, chaosMonkey) {
        if (err || !chaosMonkey) {
            res.status(404).json({
                message: 'Couldn\'t find the chaos monkey'
            });
        } else {
            res.json({
                message: 'Deleted correctly chaos monkey'
            });
        }
    });
});

module.exports = router;
