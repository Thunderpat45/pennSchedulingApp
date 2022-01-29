const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const facilitySettingsSchema = new Schema({
    facilityOpen: Number,
    facilityClose:Number,
    facilityMaxCapacity: Number
});

module.exports = mongoose.model('facilitySettings', facilitySettingsSchema);