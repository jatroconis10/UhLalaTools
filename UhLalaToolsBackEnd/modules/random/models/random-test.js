var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var randomTestSchema = Schema({
	application: { type: Schema.Types.ObjectId, ref: 'Application' },
  	name: { type: String, required: true },
	startUrl: String,  
	description: String,
	numRuns: Number,
  	numGremlins: Number,
});

var randomErrorsSchema = Schema({
	application: { type: Schema.Types.ObjectId, ref: 'Application' },
	test: { type: Schema.Types.ObjectId, ref: 'Random_Test'},
	seed: String,
})

module.exports = {
	RandomTest: mongoose.model('Random_Test', randomTestSchema),
	RandomTestError: mongoose.model('Random_Test_Error', randomErrorsSchema),
}