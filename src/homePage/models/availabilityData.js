import {events} from "../../../src/events"

const availabilityData = (function(){
    
    let availabilityModelStable;
    let availabilityModelMutable;
    const timeBlockDefault = {
        startTime:"default",
        endTime:"default",
        admin: "no"
    };

    events.subscribe("mainPageModelBuilt", setAvailabilityModel); 
    events.subscribe("availabilityModelRequested", publishAvailabilityModel)
    events.subscribe("deleteTimeBlockClicked", deleteAvailabilityRow);
    events.subscribe("addTimeBlockClicked", addAvailabilityRow);
    events.subscribe("modifyAvailabilitySelectorValues", modifyAvailabilityValue);
    events.subscribe("updateAvailabilityClicked", validateAvailability);
    events.subscribe("userAvailabilityDataValidated", updateAvailability)

    
    function setAvailabilityModel(userAvailability){
        availabilityModelStable = userAvailability.availability
    }

    function setAvailabilityModelCopy(){
        availabilityModelMutable = Object.assign({}, availabilityModelStable);
        for(let day in availabilityModelStable){
            availabilityModelMutable[day] = availabilityModelStable[day].concat();
            availabilityModelStable[day].forEach(function(timeBlock){
                availabilityModelMutable[day][timeBlock] = Object.assign({}, availabilityModelStable[day][timeBlock])
            });
        }
    }

    function publishAvailabilityModel(){
        setAvailabilityModelCopy();
        events.publish("availabilityDOMPageRequested", availabilityModelMutable)
    }


    function addAvailabilityRow(day){
        availabilityModelMutable[day].push(Object.assign({}, timeBlockDefault));

        events.publish("availabilityModelModified", availabilityModelMutable);
    }

    function deleteAvailabilityRow(rowObj){
        const blockIndex = rowObj.blockNumber;
        availabilityModelMutable[rowObj.day].splice(blockIndex, 1);

        events.publish("availabilityModelModified", availabilityModelMutable);
    }

    function modifyAvailabilityValue(rowObj){
        const blockIndex = rowObj.blockNumber;
        availabilityModelMutable[rowObj.day][blockIndex][rowObj.selector] = rowObj.value
    }

    function validateAvailability(){
        events.publish("userAvailabilityValidationRequested", availabilityModelMutable)
    }

    function updateAvailability(){
        events.publish("availabilityDataUpdated", availabilityModelMutable)
    }

})()

export {availabilityData}