var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mutationTestSchema = Schema({
	dir: {
		type: String,
		required: true
	},
	files: [String],
	mutate: [String],
	mutator: String,
	reporters: [String],
	testRunner: String,
	testFramework: String,
	configFile: String
});

module.exports = mongoose.model('Mutation_Test', mutationTestSchema);
