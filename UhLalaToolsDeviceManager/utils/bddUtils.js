const shell = require('shelljs');
const path = require('path');

const emulatorUtils = require('./emulatorUtils');
const adbUtils = require('./adbUtils');
const reportUtils = require('./reportUtils');
const gitUtils = require('./gitUtils');

const apks = path.normalize(`${process.cwd()}/apks`);
const tests = path.normalize(`${process.cwd()}/tests`);

const runningTasks = {}

const public = {}

public.runBDD = async ({appId, version, repoUrl}, avds) => {

    if (runningTasks[appId] !== undefined) return
    else runningTasks[appId] = true

    const reportDir = reportUtils.createReportDir(appId, version, 'bdd')
    const results = [];

    shell.cd(`${tests}/${appId}/${version}`);

    //Get from function (opportunity to use git to gather sources and generating APK)
    const apkPath = path.normalize(`${apks}/${appId}/${version}.apk`)

    await execPromise(`bundle install`)

    await asyncForEach(avds, async avd => {
        const avd_results = {};

        const serial = emulatorUtils.runEmulator(avd).serial;
        console.log(serial)
        process.env.ADB_DEVICE_ARG = serial;
        await adbUtils.waitForEmulator()

        process.env.SCREENSHOT_PATH = path.join(reportDir, `screenshots/${avd}-`);
        const bddHtmlReport = path.join(reportDir, 'bdd-report.html')
        const result = await runDeviceBDD(apkPath, serial, bddHtmlReport)

        emulatorUtils.stopEmulator()

        avd_results.name = avd;
        avd_results.reportDir = bddHtmlReport
        results.push(avd_results);
    });

    shell.cd('../../..');
    reportUtils.writeReport(reportDir, results)

    delete runningTasks[appId]

    return reportDir;
}

public.getRunningBdd = (appId) => {
    return runningTasks[appId] !== undefined
}

async function runDeviceBDD(apkPath, deviceSerial, reportOutput) {
    apkPath = path.normalize(`${apkPath}`)
    await execPromise(`bundle exec calabash-android resign "${apkPath}"`);
    const result = await execPromise(`bundle exec calabash-android run "${apkPath}" --format html --out ${reportOutput} ADB_DEVICE_ARG=${deviceSerial}`);
    return result;
}

function execPromise(command) {
    return new Promise((resolve, reject) =>{
        shell.exec(command, (code, stdout, stderr) => resolve({code, stdout, stderr}))
    }) 
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
}

module.exports = public;