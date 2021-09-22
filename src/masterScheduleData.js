import {events} from "../events"

const masterScheduleData = (function(){
    
    events.subscribe("SOMETHINGABOUTLOADINGVALUES", setAdjustedOptionRanges);
    events.subscribe("SOMETHINGABOUTLOADINGCOACHPREFERENCES", setCoachPreferences);
    events.subscribe("SOMETHINGABOUTADJUSTINGADMINOPTIONS", function publishAdminOptionRanges(){
        events.publish("SOMETHINGABOUTPUBLISHINGADMINOPTIONRANGES", adminOptionRanges)
    })
    events.subscribe("SOMETHINGABOUTVALUESLOADED", function publishScheduleBuilderInfo(){
        events.publish("SOMETHINGABOUTSCHEDULEDATALOADED", adjustedOptions, coachPreferences)
    })

    let adjustedOptions
    let coachPreferences = {} //{coachName: {day: [{start, stop}, {start, stop}], day: [{start, stop}, {start, stop}]}, coachName2...}

    const adminOptionRanges = {
        days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        openTime: 0, 
        closeTime: 1440, 
        slots: [1, null] //make this input?
    }

    const defaultOptionRanges = { //make this default in database for first load, before admin edits
        days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        openTime: 360, 
        closeTime: 1200, 
        slots: [1, 6] 
    }

    function setAdjustedOptionRanges(databaseOptionRanges){
        for(let prop in databaseOptionRanges){
            adjustedOptions[prop] = databaseOptionRanges[prop]
            events.publish()
        }
    }

    function setCoachPreferences(mongoDBStuff){//is all this nesting necessary, or can I just use JSON object as is?
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

