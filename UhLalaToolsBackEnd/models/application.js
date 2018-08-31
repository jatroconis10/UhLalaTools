var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var applicationSchema = new Schema({
    name: { type: String, required: true },
    description: String,
    browsers: [String],
    maxInstances: Number,
    commands:[Schema.Types.Mixed],
});

module.exports = mongoose.model('Application', applicationSchema);
