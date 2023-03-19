var mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose);

var Schema = mongoose.Schema;

var bookingSchema = new Schema({
	'owner' : {type: String, required: true},
	'movieTheater': {type: Schema.Types.ObjectId, ref: 'MovieTheater', required: true},
	'movie': {type: Schema.Types.ObjectId, ref: 'Movie', required: true},
	'date': {type: Date, required: true},
	'time': {type: String, required: true},
	'seats': [
		{
			'row': {type: Number, required: true},
			'column': {type: Number, required: true}
		}
	]
}, { timestamps: true });

module.exports = {
	BookingModel: mongoose.model('Booking', bookingSchema),
	BookingJsonSchema: bookingSchema.jsonSchema()
};
