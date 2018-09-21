const express = require('express');
const shell = require('shelljs');
const path = require('path');

const apks = path.normalize(`${process.cwd()}/apks`);
const tests = path.normalize(`${process.cwd()}/tests`);

var router = express.Router();

router.post('/run', (req, res) => {
    let {apk} = req.body
    res.json({message:'Starting calabash'})
    shell.cd(`${tests}/${apk}`)
    const install = shell.exec(`bundle install`).code
    const calabash = shell.exec(`bundle exec calabash-android run "${apks}/${apk}"`).code
    shell.cd('../..');
    
})

module.exports = router;