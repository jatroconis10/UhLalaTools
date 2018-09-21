const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')

const images = require('./routers/images');
const avds = require('./routers/avds');
const emulator = require('./routers/emulator');
const apks = require('./routers/apks');
const tests = require('./routers/tests');

const app = express();

app.use(bodyParser.json());

process.env.ANDROID_SDK_HOME = path.normalize(process.cwd())

// console.log(process.env.ANDROID_HOME)
// const emulator = path.normalize(`${process.env.ANDROID_HOME}/tools/emulator`)
// const avdmanager = path.normalize(`${process.env.ANDROID_HOME}/tools/bin/avdmanager`)
// shell.exec(`${emulator} -list-avds`)
// shell.exec(`${avdmanager} list devices -c`)
// console.log(process.env.ANDROID_SDK_HOME)
// shell.exec(`${avdmanager} list devices -c`)

app.use('/images', images);
app.use('/avds', avds);
app.use('/emulators', emulator);
app.use('/apks', apks);

app.use('/tests', tests);

const port = process.env.PORT || 3001
app.listen(port, () => console.log('Device manager started'))