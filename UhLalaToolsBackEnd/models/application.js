var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var applicationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        required: true
    },
    description: String,
    browsers: [String],
    maxInstances: Number,
    url: String,
    apkPackage: String,
    apkUploaded: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Application', applicationSchema);
