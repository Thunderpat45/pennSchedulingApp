import {events} from "../events"

/*
actions: loads user's availability from Mongo, updates data on modifications to availability

publishes: 
    availability model loads
    availability model changes to
        added/edited/deleted availabilities
    update data to db for availability changes
    
subscribes to: 
    requests to add/delete/modify availability block data
    requests to update availability in DB
*/

const availabilityModel = (function(){

    let availabilityModel;
    let timeBlockDefault = {
        start:null,
        end:null
    };

    events.subscribe("availabilityLoaded", populateAvailabilityModel); //get this from DB
    events.subscribe("availabilityModelRequested", publishAvailabilityModel)
    events.subscribe("deleteTimeBlockClicked", deleteAvailabilityRow);
    events.subscribe("addTimeBlockClicked", addAvailabilityRow);
    events.subscribe("modifyAvailabilitySelectorValues", modifyAvailabilityValue);
    events.subscribe("updateAvailabilityClicked", updateAvailability);

    function populateAvailabilityModel(userAvailability){
        availabilityModel = Object.assign({}, userAvailability);
        for(let day in availabilityModel){
            availabilityModel[day] = userAvailability[day].concat();
            day.forEach(function(timeBlock){
                availabilityModel[day][timeBlock] = Object.assign(userAvailability[day][timeBlock])
            });
        }
    }

    function publishAvailabilityModel(){
        events.publish("availabilityDOMPageRequested", availabilityModel)
    }

    function addAvailabilityRow(day){
        availabilityModel[day].push(Object.assign({}, timeBlockDefault));

        events.publish("availabilityModelModified", availabilityModel);
    }

    function deleteAvailabilityRow(obj){
        const blockIndex = obj.blockNumber -1;
        const timeBlock = availabilityModel[obj.day][blockIndex];
        availabilityModel[obj.day].splice(timeBlock, 1);

        events.publish("availabilityModelModified", availabilityModel);
    }

    function modifyAvailabilityValue(obj){
        const blockIndex = obj.blockNumber - 1;
        availabilityModel[obj.day][blockIndex][obj.selector] = obj.value
    }

    function updateAvailability(){
        events.publish("updateAvailabilityRequested", availabilityModel)
    }

})()

export {availabilityModel}