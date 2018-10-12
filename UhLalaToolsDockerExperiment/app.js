'use strict';

require('dotenv').load();

const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');

(async () => {
    const s3 = new AWS.S3({ accessKeyId: process.env.AWS_ACCESS_KEY, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY });
    const appId = process.env.APP_ID;

    function copyTests() {
        return s3.listObjectsV2({ Bucket: process.env.AWS_BUCKET, Delimiter: '/', Prefix: `tests/${appId}/`}).promise().then((data) => {
            const promises = data.Contents.filter((file) => !file.Key.endsWith('/')).map((file) => {
                const filenameSplit = file.Key.split('/');
                const filename = filenameSplit[filenameSplit.length - 1];
                const fileDestination = fs.createWriteStream(`./tests/${filename}`);
                return new Promise((resolve) => {
                    s3.getObject({ Bucket: process.env.AWS_BUCKET, Key: file.Key }).createReadStream().pipe(fileDestination).on('finish', resolve);
                });
            });
            return Promise.all(promises);
        });
    }

    const copyTestsPromise = copyTests();
    await copyTestsPromise;

    const testsDirectory = 'tests'
    const reportsDirectory = './tests/reports';
    shell.mkdir(reportsDirectory);
    if (shell.test('-d', testsDirectory) && shell.ls(testsDirectory).length !== 0) {
        const wdio = path.normalize('./node_modules/.bin/wdio');
        const conf = path.normalize(`${testsDirectory}/wdio.conf.js`);

        shell.exec(`${wdio} ${conf}`);
        fs.readdir(reportsDirectory, (_, files) => {
            if (files) {
                const reportsFolderPath = path.join(__dirname, reportsDirectory);
                files.forEach(file => {
                    const filePath = path.join(reportsFolderPath, file);
                    if (!fs.lstatSync(filePath).isDirectory()) {
                        fs.readFile(filePath, (_, fileContent) => {
                            s3.putObject({ Bucket: process.env.AWS_BUCKET, Key: `tests/${appId}/reports/${file}`, Body: fileContent });
                        });
                    }
                });
            }
        });
    }

    // TODO Reportar ejecución al test suite.
})();
