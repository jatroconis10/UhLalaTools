var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var testSchema = Schema({
	application: {
		type: Schema.Types.ObjectId,
		ref: 'Application'
	},
	name: {
		type: String,
		required: true
	},
	description: String,
	type: String,
	commands: [Schema.Types.Mixed],
});

module.exports = mongoose.model('Test', testSchema);
