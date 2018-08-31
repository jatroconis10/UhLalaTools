var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var applicationSchema = new Schema({
    name: { type: String, required: true },
    description: String,
    browsers: [String],
    maxInstances: Number,
});

module.exports = mongoose.model('Application', applicationSchema);
