const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    password: String,
    privilegeLevel: {type: Boolean, default: false},
    lastVerified: String,
    color: String,  
    teams: [{type: Schema.Types.ObjectId, ref:'Team'}],
    availability:{
        Sun:[{type: Schema.Types.ObjectId, ref: 'Availability'}],
        Mon:[{type: Schema.Types.ObjectId, ref: 'Availability'}],
        Tue:[{type: Schema.Types.ObjectId, ref: 'Availability'}],
        Wed:[{type: Schema.Types.ObjectId, ref: 'Availability'}],
        Thu:[{type: Schema.Types.ObjectId, ref: 'Availability'}],
        Fri:[{type: Schema.Types.ObjectId, ref: 'Availability'}],
        Sat:[{type: Schema.Types.ObjectId, ref: 'Availability'}],
    }
});

module.exports = mongoose.model('User', userSchema);