const shell = require('shelljs');
const path = require('path');
const fs = require('fs');

const emulatorUtils = require('./emulatorUtils');
const adbUtils = require('./adbUtils');
const gitUtils = require('./gitUtils');

const apps = path.normalize(`${process.cwd()}/appsSources`);
const mutants = path.normalize(`${process.cwd()}/mutants`);
const mdroid = path.normalize(`${process.cwd()}/mdroid`);

const public = {}

public.getMutants = getMutants

public.mutate = async (appId, package, repoUrl) => {
    const mutantOutput = path.normalize(`${mutants}/${appId}/mainSources`);

    //If the repo url is given then clone it
    if(repoUrl) await gitUtils.getSources(appId, repoUrl)

    const appMainSources = path.normalize(`${apps}/${appId}/app/src/main`)
    shell.mkdir('-p', mutantOutput);
    const mdroidRun = path.normalize(`java -jar ${mdroid}/MDroidPlus-1.0.0.jar ${mdroid}/libs4ast ${appMainSources} ${package} ${mutantOutput} ${mdroid} true`)
    
    const result = await execPromise(mdroidRun);
    return result;
}

public.runMutants = async (appId, avds) => {
    shell.cd(process.cwd())
    const results = [];

    const originalApp = path.normalize(`${apps}/${appId}/`)

    const baseApp = path.normalize(`${mutants}/${appId}/base/`)
    const baseMainSources = path.normalize(`${baseApp}/app/src/main/`)

    shell.mkdir('-p', baseApp);
    shell.cp('-R', originalApp + '*', baseApp);

    await asyncForEach(avds, async avd => {
        const avd_results = {};
        const aliveMutants = []

        emulatorUtils.runEmulator(avd);
        await adbUtils.waitForEmulator()

        const appMutants = getMutants(appId).filter(mutant => !mutant.includes('.log'))
        await asyncForEach(appMutants, async mutant => {
            const mutantPath = path.normalize(`${mutants}/${appId}/mainSources/${mutant}/`)
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
    const reportPath = path.normalize(`${mutants}/${appId}/report.json`)
    fs.writeFile(reportPath, JSON.stringify(results), function(err) {
        if(err) {
            console.log(err);
        }

        console.log("Mutant report was saved!");
    }); 
    return results;
}

public.getAppReport = (appId) => {
    const result = {
        error: undefined,
        report: undefined
    }
    const reportPath = path.normalize(`${mutants}/${appId}/report.json`);
    if(shell.test('-f', reportPath)) {
        result.report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    } else {
        result.error = {message: 'There is no report, maybe the tests are running or you forgot to run them'}
    }
    return result;
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

function getMutants(appId) {
    return shell.ls(path.normalize(`${mutants}/${appId}/mainSources`))
}


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array)
    }
  }

module.exports = public;