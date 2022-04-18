const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const teamSchema = new Schema({
    name: String,
    coach: {type: Schema.Types.ObjectId, ref:'User'},
    size: Number,
    season:String,
    rank:{
        myTeams: Number,
        allTeams: Number
    },
    lastVerified:String,
    enabled: Boolean,
    allOpts: 
        [
            [
                {
                    dayOfWeek: String,
                    startTime: Number,
                    endTime:Number,
                    inWeiss: String,
                    _id: false
                }
            ]
        ]
});

module.exports = mongoose.model('Team', teamSchema);