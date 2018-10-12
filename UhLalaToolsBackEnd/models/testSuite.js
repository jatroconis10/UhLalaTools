var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var testSuiteSchema = Schema({
	application: {
        type: Schema.Types.ObjectId,
        ref: 'Application'
    },
    name: {
        type: String,
        required: true
    },
    description: String
});

module.exports = mongoose.model('TestSuite', testSuiteSchema);
