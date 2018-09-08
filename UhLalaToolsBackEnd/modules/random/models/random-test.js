var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var randomTestSchema = Schema({
	application: { type: Schema.Types.ObjectId, ref: 'Application' },
  	name: { type: String, required: true },
  	description: String,
  	seed: String,
  	numGremlins: Number,
});

module.exports = mongoose.model('Random_Test', randomTestSchema);