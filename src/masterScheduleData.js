import {events} from "../events"

const masterScheduleData = (function(){
    
    events.subscribe("SOMETHINGABOUTLOADINGVALUES", loadAdjustedOptions);
    events.subscribe("SOMETHINGABOUTLOADINGCOACHPREFERENCES", loadCoachPreferences);
    events.subscribe("SOMETHINGABOUTADJUSTINGADMINOPTIONS", function publishDefaultOptions(){
        events.publish("SOMETHINGABOUTPUBLISHINGDEFAULTOPTIONS", defaultOptions)
    })

    const defaultOptions = {
        days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        openTime: 0, //12am
        closeTime: 1425, //11:45pm
        slots: [1, null] // is null the right value?
    }

    /* adjustedOptions  loadFROMDATABASE?*/
    
    const adjustedOptions = {
        days: [],
        openTime: null, 
        closeTime: null, 
        slots: [1, null]
    }

    let coachPreferences = {}

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

