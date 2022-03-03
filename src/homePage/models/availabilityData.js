import {events} from "../../../src/events"

const availabilityData = (function(){
    
    let availabilityModelStable;
    let availabilityModelMutable;

    const timeBlockDefault = {
        admin:false,
        season:null,
        day:null,
        availability:{startTime: "default", endTime: "default"}
    };

    events.subscribe('userDataFetched', setSeason)
    events.subscribe("addAvailabilityTimeBlockClicked", addAvailabilityBlock);
    events.subscribe("modifyAvailabilitySelectorValues", modifyAvailabilityValue);
    events.subscribe('availabilityBlockEditRequested', setAvailabilityDataEditRequest)
    events.subscribe('cancelAvailabilityBlockChangesClicked', setAvailabilityDataCancelRequest)
    events.subscribe("updateAvailabilityClicked", validateChanges);
    events.subscribe("userAvailabilityDataValidated", updateAvailabilityData)
    events.subscribe("userAvailabilityValidationFailed", renderBlockValidationErrors);
    events.subscribe("editAvailabilityBlockDataSaved", publishBlockUpdatesToAllBlocks);
    events.subscribe("newAvailabilityBlockDataSaved", addBlockDataToAllBlocks);

    function setSeason(userData){
        timeBlockDefault.season = userData.season
    } 

    function setAvailabilityDataEditRequest(timeBlock){
        availabilityModelStable =  timeBlock;
        availabilityModelMutable = Object.assign({}, availabilityModelStable)
        availabilityModelMutable.availability = Object.assign({}, availabilityModelStable.availability)

        events.publish("availabilityBlockDataLoaded", {timeBlock: availabilityModelMutable, origin:"edit"})
    }

    function setAvailabilityDataCancelRequest(){
        availabilityModelStable = {};

        events.publish("availabilityDataChangesCancelled") 
    }

    function addAvailabilityBlock(day){
        availabilityModelStable = Object.assign({}, timeBlockDefault);
        availabilityModelStable.day = day;

        availabilityModelMutable = Object.assign({}, availabilityModelStable);
        availabilityModelMutable.availability = Object.assign({}, availabilityModelStable.availability)

        events.publish("availabilityBlockAddRequested", {timeBlock: availabilityModelMutable, origin: "add"});
    }

    function modifyAvailabilityValue(timeBlockObj){ //make sure this is sent this way
        const {modifiedSelector, value} = timeBlockObj
        availabilityModelMutable.availability[modifiedSelector] = value
    }

    function validateChanges(origin){
        events.publish("availabilityValidationRequested", {timeBlock: availabilityModelMutable, origin})
    }

    function updateAvailabilityData(validatedBlockData){
        if(validatedBlockData.origin == "edit"){
			events.publish("availabilityBlockUpdateRequested", validatedBlockData.timeBlock) 
		}else{
			events.publish("newAvailabilityBlockAdditionRequested", validatedBlockData.timeBlock)
		}
    }

    function renderBlockValidationErrors(validationErrorData){
        const {errors, origin} = validationErrorData
        events.publish("renderAvailabilityBlockValidationErrors", {timeBlock: availabilityModelMutable, errors, origin})
    }

    function publishBlockUpdatesToAllBlocks(){
        events.publish("updateAllAvailabilityBlocksModel", availabilityModelMutable)
    }

    function addBlockDataToAllBlocks(_id){
        availabilityModelMutable._id = _id;
        events.publish("updateAllAvailabilityBlocksModel", availabilityModelMutable);
    }

})()

export {availabilityData}