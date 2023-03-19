var mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose);
var Schema = mongoose.Schema;

var movieTheaterSchema = new Schema({
	'owner' : {type: String, required: true},
	'name' : {type: String, required: true},
	'coordinates': {
		'lat': {type: Number, required: true},
		'lng': {type: Number, required: true},
	},
	'rows': {type: Number, required: true},
	'columns': {type: Number, required: true},

}, { timestamps: true });

module.exports = {
	MovieTheaterModel: mongoose.model('MovieTheater', movieTheaterSchema),
	MovieTheaterJsonSchema: movieTheaterSchema.jsonSchema()
}
