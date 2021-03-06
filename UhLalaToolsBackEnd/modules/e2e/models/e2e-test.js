var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var e2eTestSchema = Schema({
	application: {
		type: Schema.Types.ObjectId,
		ref: 'Application'
	},
	name: {
		type: String,
		required: true
	},
	description: String,
	generated: {
		type: Boolean,
		default: false
	},
	executed: {
		type: Boolean,
		default: false
	},
	commands: [Schema.Types.Mixed]
});

module.exports = mongoose.model('E2E_Test', e2eTestSchema);