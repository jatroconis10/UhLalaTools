var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var express = require('express');
var cors = require("cors");
var app = express();
var fs = require('fs');
var shell = require('shelljs');
var Mockaroo = require('mockaroo');
const resemble = require("resemblejs");
const git = require('simple-git/promise');
var path = require('path');

var Schema = mongoose.Schema;

var e2e = require('./modules/e2e');
var random = require('./modules/random');
var bdd = require('./modules/bdd');
var mutation = require('./modules/mutation');
var chaosMonkey = require('./modules/chaosMonkeys');

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/uhlala-api');

app.use(cors());

var Application = require('./models/application');
var Test = require('./models/test');
var MockarooSchema = require('./models/mockarooSchema');

var E2ETest = require('./modules/e2e/models/e2e-test');
var RandomTest = require('./modules/random/models/random-test');

var client = new Mockaroo.Client({
    apiKey: 'ae45bad0'
})

app.get('/', function (req, res) {
    res.send('api uhlala tools');
});

app.get('/applications', function (req, res) {
    Application.find({}, function (error, applications) {
        if (error) return res.status(500).send(error);
        res.json(applications);
    });
});

app.get('/applications/:id/e2e', function (req, res) {
    var id = new mongoose.Types.ObjectId(req.params.id);
    E2ETest.find({
            application: id
        })
        .then(function (tests) {
            res.json(tests.map(function (test) {
                return {
                    _id: test._id,
                    commands: test.commands,
                    generated: test.generated,
                    executed: test.executed,
                    test: {
                        name: test.name,
                        description: test.description
                    }
                };
            }));
        });
});

app.get('/applications/:id/random', function (req, res) {
    var id = new mongoose.Types.ObjectId(req.params.id);
    RandomTest.find({
            application: id
        })
        .then(function (tests) {
            res.json(tests.map(function (test) {
                return {
                    _id: test._id,
                    startUrl: test.startUrl,
                    description: test.description,
                    numRuns: test.numRuns,
                    numGremlins: test.numGremlins,
                    test: {
                        name: test.name,
                        description: test.description
                    }
                };
            }));
        });
});

app.post('/applications/:id/e2e', function (req, res) {
    var appId = new mongoose.Types.ObjectId(req.params.id);
    var testBody = req.body;

    var e2eTest = new E2ETest({
        application: appId,
        name: testBody.test.name,
        description: testBody.test.description,
        generated: testBody.generated,
        executed: testBody.executed,
        commands: testBody.commands
    });
    e2eTest.save(function (error, savedApp) {
        if (error) return res.status(500).send(error);
        res.json(savedApp);
    });
});



app.get('/applications/:id', function (req, res) {
    Application.findById(req.params.id, function (error, application) {
        if (error) return res.status(500).send(error);
        res.json(application);
    });
});

app.post('/applications', function (req, res) {
    var application = new Application();
    application.name = req.body.name;
    application.description = req.body.description || 'No hay descripcion';
    application.url = req.body.url;
    application.platform = req.body.platform;
    application.maxInstances = req.body.maxInstances;
    application.browsers = req.body.browsers;
    application.apkPackage = req.body.apkPackage;
    application.git = req.body.git;

    application.save(function (error, savedApp) {
        if (error) return res.status(500).send(error);
        res.json(savedApp);
    });
});

app.delete('/applications/:id', function (req, res) {
    Application.findById(req.params.id, function (error, application) {
        if (error) return res.status(500).send(error);

        application.remove(function (removingError) {
            if (removingError) return res.status(500).send({
                error: removingError
            });

            res.json({
                message: "Aplicacion removida exitosamente"
            });
        });
    });
});

app.get('/tests', function (req, res) {
    Test.find({}, function (error, tests) {
        if (error) return res.status(500).send(error);
        res.json(tests);
    });
});

app.post('/tests/:applicationId', function (req, res) {
    var test = new Test({
        application: req.params.applicationId,
        name: req.body.name,
        description: req.body.description,
        type: req.body.type
    });
    test.save(function (error, savedTest) {
        if (error) return res.status(500).send(error);
        res.json(savedTest);
    });
});

app.post('/applications/browsers/:applicationId', function (req, res) {
    Application.findById(req.param.applicationId, function (error, app) {
        app.browsers.push(req.body.browser);
        app.save(function (error1, savedApp) {
            if (error1) return res.status(500).send(error1);
            res.json(savedApp);
        });
    });
});

app.post('/applications/maxInstances/:applicationId', function (req, res) {
    Application.findById(req.param.applicationId, function (error, app) {
        app.maxInstances = req.body.maxInstances;
        app.save(function (error1, savedApp) {
            if (error1) return res.status(500).send(error1);
            res.json(savedApp);
        });
    });
});

app.get('/applications/browsers/:applicationId', function (req, res) {
    Application.findById(req.param.applicationId, function (error, app) {
        res.json(savedApp.browsers);
    });
});

app.get('/applications/maxInstances/:applicationId', function (req, res) {
    Application.findById(req.param.applicationId, function (error, app) {
        res.json(savedApp.maxInstances);
    });
});

app.get('/applications/maxInstances/:applicationId', function (req, res) {
    Application.findById(req.param.applicationId, function (error, app) {
        res.json(savedApp.maxInstances);
    });
});

app.get('/tests/:id', function (req, res) {
    Test.findById(req.params.id, function (error, test) {
        if (error) return res.status(500).send(error);
        res.json(test);
    });
});

app.get('/applications/:applicationId/tests', function (req, res) {
    Test.find({
        'application': req.params.applicationId
    }, function (error, tests) {
        if (error) return res.status(500).send(error);
        res.json(tests);
    });
});

app.delete('/tests/:id', function (req, res) {
    Test.findById(req.params.id, function (error, test) {
        if (error) return res.status(500).send(error);

        test.remove(function (removingError) {
            if (removingError) return res.status(500).send({
                error: removingError
            });

            res.json({
                message: "Test removido exitosamente"
            });
        });
    });
});

app.post('/mockarooSchema/:applicationId', function (req, res) {
    console.log(req.body.fields);
    var schema = new MockarooSchema({
        application: req.params.applicationId,
        fields: req.body.fields
    });
    schema.save(function (error, savedSchema) {
        if (error) return res.status(500).send(error);
        res.json(savedSchema);
    });
})

app.post('/generateData/:schemaId/:numRecords', function (req, res) {
    MockarooSchema.findById(req.params.schemaId, function (error, schema) {
        if (error) return res.status(500).send(error);

        client.generate({
            count: req.params.numRecords,
            fields: schema.fields
        }).then(function(records) {
            var csv = convertToCSV(records);
            var dir = `tests/generatedData/${schema.application}`;
            if(!shell.test('-d', dir)) shell.mkdir('-p', dir);
            fs.writeFileSync(dir + `/${req.params.schemaId}.csv`, csv);
            res.send(csv);
        });
    });
})

app.get('/vrt/compare/:applicationId/:version1/:version2', async function(req, res) {
    var img;
    var text;
    E2ETest.find({
        'application': req.params.applicationId
    }, function (error, tests) {
        if (error) return res.status(500).send(error);
        if(!shell.test('-d', `tests/e2e/${req.params.applicationId}/screenshots/${tests[0]._id}/${req.params.version1}`)) return res.status(500).send(`No existen registros para la version ${req.params.version1}`);
        if(!shell.test('-d', `tests/e2e/${req.params.applicationId}/screenshots/${tests[0]._id}/${req.params.version2}`)) return res.status(500).send(`No existen registros para la version ${req.params.version2}`);
        var comp = [];
        var newLine = '\n';
        var html = `<h1>VRT Report versions ${req.params.version1} & ${req.params.version2}</h1>` + newLine;
        html+='<br><table>' + newLine;
        html+=`<tr><th>Versión ${req.params.version1}</th><th>Versión ${req.params.version2}</th><th>Diferences</th><th>Important information</th></tr>` + newLine;
        
        
        tests.forEach(test=>{
            for(var i = 0; i < test.commands.length; i++) {
                var diff = resemble(`tests/e2e/${req.params.applicationId}/screenshots/${test._id}/${req.params.version1}/test${i}.png`)
                .compareTo(`tests/e2e/${req.params.applicationId}/screenshots/${test._id}/${req.params.version2}/test${i}.png`)
                .ignoreLess()
                .onComplete(function(data) {
                    console.log(data);
                    text = data;
                    img = data.getImageDataUrl();
                    html+='<tr>' + newLine;
                    html+=`<td><img src="../screenshots/${test._id}/${req.params.version1}/test${i}.png" style="height: 174px; width: 272px"></td>` + newLine;
                    html+=`<td><img src="../screenshots/${test._id}/${req.params.version2}/test${i}.png" style="height: 174px; width: 272px"></td>` + newLine;
                    html+='<td><img src="'+img+'" style="height: 174px; width: 272px"></td>' + newLine;
                    html+=`<td><h4>test: ${test._id}<br> command: ${commandToWebDriver(test.commands[i])}<br> misMatchPercentage: `+text.misMatchPercentage+'<br>isSameDimensions:'+text.isSameDimensions+'<br>dimensionDifference:{width:'+text.dimensionDifference.width+', height:'+text.dimensionDifference.height+'}</h4></td>' + newLine;
                    html+='</tr>' + newLine;
                });
            }
        });
        html+='</table>';
        if(!shell.test('-d', `tests/e2e/${req.params.applicationId}/reports`)) shell.mkdir('-p', dir);
        fs.writeFileSync(`tests/e2e/${req.params.applicationId}/reports/vrt-report-versions-${req.params.version1}-${req.params.version2}.html`, html);
        res.json('Reporte generado');
    });    
});

app.get('/cloneproject/:applicationId/:version', async function(req, res) {
    Application.findById(req.params.applicationId, function (error, application) {
        if (error) return res.status(500).send(error);
        var dir = `apps-code/${application.name}/${req.params.version}`;
        if (!shell.test('-d', dir)) shell.mkdir('-p', dir);
        git(dir).silent(true)
          .clone(application.git,{'--branch':req.params.version})
          .then(() => res.send('Repositorio clonado'))
          .catch((err) => console.error('failed: ', err));   
    });
});

function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    if(array.length > 0) str = Object.keys(array[0]).join(';') + '\r\n';
    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ';'

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function commandToWebDriver(command) {
    var result = '';
    switch (command.type) {
        case 'goTo':
            result = `browser.url('${command.selector}')`;
            break;
        case 'click':
            result = `browser.click('${command.selector}')`;
            break;
        case 'keys':
            result = `$('${command.selector}').keys('${command.value}')`;
            break;
        case 'selectByText':
            result = `browser.selectByVisibleText('${command.selector}', '${command.value}')`;
            break;
        case 'waitVisible':
            var timeout = command.value || 500;
            result = `browser.waitForVisible('${command.selector}', ${timeout})`;
            break;
        case 'assertExists':
            result = `expect($('${command.selector}')).toBeDefined()`;
            break;
        case 'assertTextMatches':
            var getText = `$('${command.selector}').getText()`;
            result = `expect(${getText}).toBe('${command.value}')`;
            break;
    }
    return result;
}

app.use('/e2e', e2e);
app.use('/', random);
app.use('/', bdd);
app.use('/mutation', mutation);
app.use('/chaosMonkeys', chaosMonkey);

mongoose.connection.once('Connected', function () {
    console.log('Database connected');
});

app.listen(3000, function () {
    console.log('Escuchando en el puerto 3000');
});