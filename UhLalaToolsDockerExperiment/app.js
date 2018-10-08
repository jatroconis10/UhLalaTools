/* jslint node: true */

'use strict';

require('dotenv').load();

var shell = require('shelljs');

function copyTestsFiles() {
    var fs = require('fs');
    var AWS = require('aws-sdk');
    var s3 = new AWS.S3({ accessKeyId: process.env.AWS_ACCESS_KEY, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY });
    var appId = process.env.APP_ID;
    var s3params = { Bucket: process.env.AWS_BUCKET, Delimiter: '/', Prefix: 'tests/' + appId + '/' };

    s3.listObjectsV2(s3params, function (_, data) {
        data.Contents.forEach(function(file) {
            if (!file.Key.endsWith('/')) {
                var filenameSplit = file.Key.split('/');
                var filename = filenameSplit[filenameSplit.length - 1];
                var fileDestination = fs.createWriteStream('./tests/' + filename);
                s3.getObject({ Bucket: process.env.AWS_BUCKET, Key: file.Key }).createReadStream().pipe(fileDestination);
            }
        });
    });
}
copyTestsFiles();

var mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL);

var db = mongoose.connection;

// TODO Cambiar APP ID por ID de suite de pruebas


