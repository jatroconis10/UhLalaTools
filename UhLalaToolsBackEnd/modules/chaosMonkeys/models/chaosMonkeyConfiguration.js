var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chaosMonkeyConfigurationSchema = new Schema({
    application: { type: Schema.Types.ObjectId, ref: 'Application', required: true },
    autoScalingGroup: { type: String, required: true },
    awsAccessKey: { type: String, required: true },
    awsSecretAccessKey: { type: String, required: true },
    awsRegion: { type: String, required: true },
    notificationEmail: { type: String, required: true }
});

module.exports = mongoose.model('ChaosMonkeyConfiguration', chaosMonkeyConfigurationSchema);
