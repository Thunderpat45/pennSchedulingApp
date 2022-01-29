const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const availabilitySchema = new Schema({
    coach: {type: Schema.Types.ObjectId, ref:'User'},
    admin:String,
    season:String,
    availability:{
        _id: false,
        Sun:[{startTime:Number, endTime:Number}],
        Mon:[{startTime:Number, endTime:Number}],
        Tue:[{startTime:Number, endTime:Number}],
        Wed:[{startTime:Number, endTime:Number}],
        Thu:[{startTime:Number, endTime:Number}],
        Fri:[{startTime:Number, enendTime:Number}],
        Sat:[{startTime:Number, endTime:Number}]
    } //does this make sense or should each request be its own object?
});

module.exports = mongoose.model('Availability', availabilitySchema);