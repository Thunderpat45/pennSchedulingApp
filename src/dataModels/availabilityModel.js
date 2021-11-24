import {events} from "../events"

/*
actions: stores current availability, makes modifications on a copy

publishes: 
    availability data + changes to:
        availabilityPageDOM
        database module (?)
    
subscribes to: 
    requests to display/add/delete/modify/update availability data

    {coachName: {day: [{start, stop}, {start, stop}], day: [{start, stop}, {start, stop}]}, coachName2...}

*/

const availabilityModel = (function(){

    //availabilityModel is immutable current data reflecting database, Copy is mutable, unstable version until published to database
    let availabilityModel;
    let availabilityModelCopy;
    let timeBlockDefault = { //issue with default vs null?
        start:"default",
        end:"default",
        admin: "no"
    };

    events.subscribe("mainPageModelBuilt", setAvailabilityModel); 
    events.subscribe("availabilityModelRequested", publishAvailabilityModel)
    events.subscribe("deleteTimeBlockClicked", deleteAvailabilityRow);
    events.subscribe("addTimeBlockClicked", addAvailabilityRow);
    events.subscribe("modifyAvailabilitySelectorValues", modifyAvailabilityValue);
    events.subscribe("updateAvailabilityClicked", updateAvailability);

    
    function setAvailabilityModel(userAvailability){
        availabilityModel = userAvailability.availability
    }

    function setAvailabilityModelCopy(){
        availabilityModelCopy = Object.assign({}, availabilityModel);
        for(let day in availabilityModel){
            availabilityModelCopy[day] = availabilityModel[day].concat();
            day.forEach(function(timeBlock){
                availabilityModelCopy[day][timeBlock] = Object.assign({}, availabilityModel[day][timeBlock])
            });
        }
    }

    function publishAvailabilityModel(){
        setAvailabilityModelCopy();
        events.publish("availabilityDOMPageRequested", availabilityModelCopy) 
    }


    function addAvailabilityRow(day){
        availabilityModelCopy[day].push(Object.assign({}, timeBlockDefault));

        events.publish("availabilityModelModified", availabilityModelCopy);
    }

    function deleteAvailabilityRow(rowObj){
        const blockIndex = rowObj.blockNumber;
        const timeBlock = availabilityModelCopy[rowObj.day][blockIndex];
        availabilityModelCopy[rowObj.day].splice(timeBlock, 1);

        events.publish("availabilityModelModified", availabilityModelCopy);
    }

    function modifyAvailabilityValue(rowObj){
        const blockIndex = rowObj.blockNumber;
        availabilityModelCopy[rowObj.day][blockIndex][rowObj.selector] = rowObj.value
    }

    function updateAvailability(){ //listener is not yet specified, should be module that updates the DB
        events.publish("availabilityDataUpdated", availabilityModelCopy)
    }

})()

export {availabilityModel}