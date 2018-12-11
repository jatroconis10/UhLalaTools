const shell = require('shelljs'),
    path = require('path'),
    fs = require('fs');

const bdd = require('./bddUtils'),
    random = require('./monkeyUtils'),
    mutant = require('./mutantUtils');

const strategiesPath = path.join(process.cwd(), 'strategies');

const public = {};

/* 
{
    appId: Number // Id of the app in the device manager
    appVersion: Number // Number of the app version that this startegy applies to
    name: String,
    description: String,
    package: String,
    avds: [String] //Array with the names of the avds you want to run the tests on
    tests: {
        bdd: {
            enabled: Boolean //If you will run this tests in the following execution
        },
        random: {
            enabled: Boolean //If you will run this tests in the following execution
            executions: Number  // Number of executions per avd 
            events: Number // Number of events per execution
        },
        mutant: {
            enabled: Boolean //If you will run this tests in the following execution
        }
    }
}
*/
public.saveStrategy = (appId, appVersion, strategy) => {
    strategy.appVersion = appVersion;
    strategy.appId = appId;
    const strategyString = JSON.stringify(strategy);
    const strategyPath = path.join(strategiesPath, appId, appVersion);
    shell.mkdir('-p', strategyPath);
    fs.writeFileSync(path.join(strategyPath, 'strategy.json'), strategyString);
}

public.runStrategy = async (appId, appVersion) => {
    const strategy = await getStrategy(appId, appVersion);
    if(!strategy) return;

    const tests = strategy.tests

    const finalReport = {}

    if(tests.bdd && tests.bdd.enabled) {
        const bddReportDir = await bdd.runBDD( {appId, version: appVersion}, strategy.avds )
        finalReport.bdd = bddReportDir
    }

    if(tests.random && tests.random.enabled) {
        const randomReportDir = await random.runMonkey(appId, strategy.package, tests.random.events, tests.random.executions, strategy.avds, appVersion);
        finalReport.random = randomReportDir;
    }

    if(tests.mutant && tests.mutant.enabled) {
        const mutantReportDir = await mutant.runMutants(appId, appVersion, strategy.avds);
        finalReport.mutant = mutantReportDir;
    }

    const strategyReportPath = path.join(strategiesPath, appId, appVersion, 'strategy-report.json');
    fs.writeFileSync(strategyReportPath, JSON.stringify(finalReport))    
}

function getStrategy(appId, appVersion) {
    const strategyPath = path.join(strategiesPath, appId, appVersion, 'strategy.json');
    return new Promise((resolve, reject) => {
        if(!shell.test('-f', strategyPath)) return;
        fs.readFile(strategyPath, (err, data) => {
            if(err) {
                reject(err);
            }
            resolve(JSON.parse(data));
        })
    })
}

module.exports = public