const express = require('express');

const strategyUtils = require('../../utils/testStrategyUtils')

var router = express.Router();

router.post('/:appId/version/:versionNum', async (req, res) => {
    const { appId, versionNum } = req.params
    const strategy = req.body;
    strategyUtils.saveStrategy(appId, versionNum, strategy)
    res.json({message: 'Saved succesfully your testing strategy'})
});

router.post('/:appId/version/:versionNum/execute', async (req, res) => {
    const { appId, versionNum } = req.params
    res.json({message:'Starting Running Testing Strategy'});
    await strategyUtils.runStrategy(appId, versionNum)
    console.log('Finished strategy')
});

module.exports = router; 