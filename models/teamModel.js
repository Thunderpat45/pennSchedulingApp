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
    // color: {type: Schema.Types.ObjectId, ref:'User'},
    enabled: Boolean,
    //overlapTolerance?
    allOpts: 
        [
            [
                {
                    dayOfWeek: String,
                    startTime: Number,
                    endTime:Number,
                    inWeiss: String,
                    _id: false
                    //overlapTolerance?
                }
            ]
        ]
});

module.exports = mongoose.model('Team', teamSchema);