var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mockarooSchema = new Schema({
    application: {
        type: Schema.Types.ObjectId,
        ref: 'Application'
    },
    fields: [Schema.Types.Mixed]
});

module.exports = mongoose.model('MockarooSchema', mockarooSchema);
