var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bddTestSchema = Schema({
    application: {
        type: Schema.Types.ObjectId,
        ref: 'Application'
    },
    feature: {
        type: String,
        required: true
    },
    scenarios: [{
        description: String,
        given: [{
            command: String
        }],
        when: [{
            command: String
        }],
        then: [{
            command: String
        }],
    }],
    scenariosAlias: [{
        given: [{
            command: String,
            commandReference: [Number]
        }],
        when: [{
            command: String,
            commandReference: [Number]
        }],
        then: [{
            command: String,
            commandReference: [Number]
        }],
    }],
});

module.exports = mongoose.model('BDD_Test', bddTestSchema);
