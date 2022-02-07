import {events} from "../events"


/*purpose: dataModel for displaying availabilityDOM and modifying userAvailability content 

availability object is modeled as such:

obj = {
    
    day: 
    [
        {start, stop, admin}, 
        {start, stop, admin}
    ], 
    day: 
    [
        {etc}, 
        {etc},
    ]

}

publishes:
    availabilityModel FOR availabilityPageDOM, availabilityValidator, and database updates

subscribes to: 
    edit availabilityData requests FROM mainPageDOM
    add/delete/update availabilityData requests FROM availabilityPageDOM
    successful validations from availabilityValidator
*/

const availabilityModel = (function(){
    //no obvious issues, find subscriber for database updates
    let availabilityModel;
    let availabilityModelCopy;
    let timeBlockDefault = {
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
        availabilityModel = userAvailability.availability
    }

    function setAvailabilityModelCopy(){
        availabilityModelCopy = Object.assign({}, availabilityModel);
        for(let day in availabilityModel){
            availabilityModelCopy[day] = availabilityModel[day].concat();
            availabilityModel[day].forEach(function(timeBlock){
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
        availabilityModelCopy[rowObj.day].splice(blockIndex, 1);

        events.publish("availabilityModelModified", availabilityModelCopy);
    }

    function modifyAvailabilityValue(rowObj){
        const blockIndex = rowObj.blockNumber;
        availabilityModelCopy[rowObj.day][blockIndex][rowObj.selector] = rowObj.value
    }

    function validateAvailability(){
        events.publish("userAvailabilityValidationRequested", availabilityModelCopy)
    }

    function updateAvailability(){
        events.publish("availabilityDataUpdated", availabilityModelCopy)
    }

})()

export {availabilityModel}