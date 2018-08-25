var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var express = require('express');
const cors = require("cors");
var app = express();
var Schema = mongoose.Schema;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/uhlala-api');

app.use(cors());

var applicationSchema = new Schema({
    endToEndTestsSchema: [endToEndTestSchema],
    name: { type: String, required: true },
    description: String
});

var endToEndTestSchema = Schema({
	application: { type: Schema.Types.ObjectId, ref: 'Application' },
  	name: { type: String, required: true },
  	description: String,
  	type: String
});

var Application = mongoose.model('Application', applicationSchema);
var EndToEndTest = mongoose.model('EndToEndTest', endToEndTestSchema);

app.get('/', function(req, res) {
    res.send('api uhlala tools');
});

app.get('/applications', function(req, res) {
    Application.find({}, function(error, applications) {
       if (error) return res.status(500).send(error);
       res.json(applications);
    });
});

app.get('/applications/:id', function(req, res) {
    Application.findById(req.params.id, function(error, application) {
       if (error) return res.status(500).send(error);
       res.json(application);
    });
});

app.post('/applications', function(req, res) {
	var application = new Application();
    application.name = req.body.name;
    application.description = req.body.description;

    application.save(function(error, savedApp) {
        if (error) return res.status(500).send(error);
        res.json(savedApp);
    });
});

app.delete('/applications/:id', function(req, res) {
    Application.findById(req.params.id, function(error, application) {
        if (error) return res.status(500).send(error);
        application.remove(function(removingError) {
           if (removingError) return res.status(500).send({ error: removingError });
           res.json({ message: "Aplicacion removida exitosamente" });
        });
    });
});

app.post('/applications/:applicationId/end-to-end-tests', function(req, res) {
	var test = new EndToEndTest({application: req.params.applicationId, name: req.body.name, description: req.body.description, type: req.body.type});
    test.save(function(error, savedTest) {
   		if (error) return res.status(500).send(error);
        res.json(savedApp);
    });
});

app.get('/applications/:applicationId/end-to-end-tests', function(req, res) {
    EndToEndTest.find({'application': req.params.applicationId}, function(error, tests) {
       if (error) return res.status(500).send(error);
       res.json(tests);
    });
});

app.delete('/end-to-end-tests/:id', function(req, res) {
    EndToEndTest.findById(req.params.id, function(error, test) {
        if (error) return res.status(500).send(error);
        test.remove(function(removingError) {
           if (removingError) return res.status(500).send({ error: removingError });
           res.json({ message: "Test removido exitosamente" });
        });
    });
});

mongoose.connection.once('Connected', function() {
    console.log('Database connected')
})

app.listen(3000, function() {
    console.log('Escuchando en el puerto 3000');
});