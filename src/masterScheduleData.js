import {events} from "../events"

const masterScheduleData = (function(){
    
    events.subscribe("SOMETHINGABOUTLOADINGVALUES", loadAdjustedOptions);
    events.subscribe("SOMETHINGABOUTLOADINGCOACHPREFERENCES", loadCoachPreferences);
    events.subscribe("SOMETHINGABOUTADJUSTINGADMINOPTIONS", function publishAdminOptionRanges(){
        events.publish("SOMETHINGABOUTPUBLISHINGADMINOPTIONRANGES", adminOptionRanges)
    })
    events.subscribe("SOMETHINGABOUTVALUESLOADED", function publishScheduleBuilderInfo(){
        events.publish("SOMETHINGABOUTSCHEDULEDATALOADED", adjustedOptions, coachPreferences)
    })

    const adminOptionRanges = {
        days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        openTime: 0, 
        closeTime: 1440, 
        slots: [1, null] //make this input?
    }

   //set default adjustedOptions in the database
    
    const adjustedOptions = {
        days: [],
        openTime: null, 
        closeTime: null, 
        slots: [1, null] //make this input?
    }

    let coachPreferences = {} //{coachName: {day: {start, stop, reason}, {start, stop, reason}}}

    

    function loadAdjustedOptions(mongoDBStuff){
        for(let prop in mongoDBStuff){
            adjustedOptions[prop] = mongoDBStuff[prop]
        }
    }

    function loadCoachPreferences(mongoDBStuff){//is all this nesting necessary, or can I just use JSON object as is?
        coachPreferences = {}
        for(let coach in mongoDBStuff){
            coachPreferences[coach] = mongoDBStuff[coach];
            for(let day in coach){
                coachPreferences[coach][day] = mongoDBStuff[coach][day]
                for(let timeRange in day){
                    coachPreferences[coach][day][timeRange] = mongoDBStuff[coach][day][timeRange]
                }
            }
        }
    }

    //import converter functions for both directions

})();

export{masterScheduleData}

