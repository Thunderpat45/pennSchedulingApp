const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const availabilitySchema = new Schema({
    coach: {type: Schema.Types.ObjectId, ref:'User'},
    admin:Boolean,
    season:String,
    day:String,
    availability:{startTime: String, endTime: String} //does this make sense or should each request be its own object?
});

module.exports = mongoose.model('Availability', availabilitySchema);