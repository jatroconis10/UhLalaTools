const shell = require('shelljs');
const path = require('path');
const fs = require('fs');

const emulatorUtils = require('./emulatorUtils');
const adbUtils = require('./adbUtils');
const gitUtils = require('./gitUtils');
const reportUtils = require('./reportUtils');

const apps = path.normalize(`${process.cwd()}/appsSources`);
const mutants = path.normalize(`${process.cwd()}/mutants`);
const mdroid = path.normalize(`${process.cwd()}/mdroid`);

const runningTasks = {}

const public = {}

public.getMutants = getMutants

public.mutate = async (appId, version, package, repoUrl) => {
    const mutantOutput = path.normalize(`${mutants}/${appId}/${version}/mainSources`);

    //If the repo url is given then clone it
    if(repoUrl) await gitUtils.getSources(appId, version, repoUrl)

    const appMainSources = path.normalize(`${apps}/${appId}/${version}/app/src/main`)
    shell.mkdir('-p', mutantOutput);
    const mdroidRun = path.normalize(`java -jar ${mdroid}/MDroidPlus-1.0.0.jar ${mdroid}/libs4ast ${appMainSources} ${package} ${mutantOutput} ${mdroid} true`)
    
    const result = await execPromise(mdroidRun);
    return result;
}

public.runMutants = async (appId, version, avds) => {

    if (runningTasks[appId] !== undefined) return
    else runningTasks[appId] = true

    shell.cd(process.cwd())
    const results = [];

    const originalApp = path.normalize(`${apps}/${appId}/${version}/`)

    const baseApp = path.normalize(`${mutants}/${appId}/${version}/base/`)
    const baseMainSources = path.normalize(`${baseApp}/app/src/main/`)

    shell.mkdir('-p', baseApp);
    shell.cp('-R', originalApp + '*', baseApp);

    await asyncForEach(avds, async avd => {
        const avd_results = {};
        const aliveMutants = []

        emulatorUtils.runEmulator(avd);
        await adbUtils.waitForEmulator()

        const appMutants = getMutants(appId, version).filter(mutant => !mutant.includes('.log'))
        await asyncForEach(appMutants, async mutant => {
            const mutantPath = path.normalize(`${mutants}/${appId}/${version}/mainSources/${mutant}/`)
            shell.cp('-R', mutantPath + '*', baseMainSources)
            const mutantSurvived = await runMutant(baseApp)
            if (mutantSurvived) {
                aliveMutants.push(mutant)
            }
        })

        emulatorUtils.stopEmulator()

        avd_results.name = avd;
        avd_results.totalMutants = appMutants.length;
        avd_results.aliveMutants = aliveMutants;
        results.push(avd_results)
    });
    shell.rm('-rf', baseApp)

    const reportPath = reportUtils.createReportDir(appId, version, 'mutants');
    reportUtils.writeReport(reportPath, results);
    
    delete runningTasks[appId]

    return results;
}

async function runMutant(mutantPath) {
    shell.cd(mutantPath)
    const unitTests = path.normalize(`gradlew test`);
    const connectedAndroidTest = path.normalize(`gradlew connectedAndroidTest`)

    const unitTestExec = await execPromise(unitTests)
    const connectedTestExec = await execPromise(connectedAndroidTest)

    return unitTestExec.code === 0 && connectedTestExec.code === 0;

}

function execPromise(command) {
    return new Promise((resolve, reject) =>{
        shell.exec(command, (code, stdout, stderr) => resolve({code, stdout, stderr}))
    }) 
}

function getMutants(appId, version) {
    return shell.ls(path.normalize(`${mutants}/${appId}/${version}/mainSources`))
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }

module.exports = public;