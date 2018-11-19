const path = require('path');
const fs = require('fs');
const shell = require('shelljs');

const reports = path.normalize(`${process.cwd()}/reports`);

const public = {}

public.createReportDir = (appId, type) => {
    const reportDir = path.normalize(`${reports}/${appId}/${type}/${Date.now()}`);
    shell.mkdir('-p', reportDir);
    shell.mkdir('-p', path.join(reportDir, 'screenshots'))
    return reportDir;
}

public.writeReport = (dir, report) => {

    const fileName  = `report.json`;
    const reportPath = path.join(dir, fileName);

    fs.writeFile(reportPath, JSON.stringify(report), function(err) {
        if(err) {
            console.log(err);
        }
        console.log(reportPath + " was saved!");
    });
}

public.getAvailableReports = (appId, type) => {
    return shell.ls(path.normalize(`${reports}/${appId}/${type}`))
}

public.getReport = (appId, type, timestampId) => {
    const result = {
        error: undefined,
        report: undefined
    }
    const reportPath = path.normalize(`${reports}/${appId}/${type}/${timestampId}/report.json`);
    if(shell.test('-f', reportPath)) {
        result.report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    } else {
        result.error = {message: 'There is no report, maybe the tests are running or you forgot to run them'}
    }
    return result;
}

module.exports = public