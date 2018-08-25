var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var express = require('express');
var app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/uhlala-api');

var mongoose = require('mongoose')

var applicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
});

var Application = mongoose.model('Application', applicationSchema);

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
    application.description = req.body.description || 'No hay descripcion';

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


app.listen(3000, function() {
    console.log('Escuchando en el puerto 3000');
});