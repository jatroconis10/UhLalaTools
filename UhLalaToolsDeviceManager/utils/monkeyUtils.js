const shell = require('shelljs');
const path = require('path');

const emulatorUtils = require('./emulatorUtils');
const adbUtils = require('./adbUtils');
const reportUtils = require('./reportUtils');

const apks = path.normalize(`${process.cwd()}/apks`);
const adb = path.normalize(`${process.env.ANDROID_HOME}/platform-tools/adb`);

const maxSeed = 100000000000000000

const state = {
    running: false,
}

const public = {}

public.runMonkey = async (appId, package, events, executions, avds, version) => {

    const reportDir = reportUtils.createReportDir(appId, version, 'random')
    const results = [];

    executeMonkey = async function() {
        const seed = Math.floor(Math.random() * maxSeed)
        const apkPath = path.normalize(`${apks}/${appId}/${version}.apk`);
        await execPromise(`${adb} install -r -t ${apkPath}`)
        const monkeyResult = await execPromise(`${adb} shell monkey -p ${package} -v -s ${seed} ${events}`);
        if(monkeyResult.code !== 0) {
            return {
                seed: seed,
                stdout: monkeyResult.stdout,
                stderr: monkeyResult.stderr,
            }
        } else {
            return undefined
        }
    }

    await asyncForEach(avds, async avd => {
        const avd_results = {
            name: avd,
            failed: [],
        };

        emulatorUtils.runEmulator(avd);
        await adbUtils.waitForEmulator()

        await asyncForEach(new Array(executions), async i =>{
            const result = await executeMonkey()
            if (result) {
                avd_results.failed.push(result);
            }
        })

        emulatorUtils.stopEmulator(avd)
        
        results.push(avd_results);
    });

    reportUtils.writeReport(reportDir, results);
    return reportDir;
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