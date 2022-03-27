import {events} from "../../../src/events"

const singleAdminTimeBlockModel = (function(){

    let adminAvailabilityDataStable 
    let adminAvailabilityDataMutable 

    const timeBlockDefault = {
        admin:true,
        season:null,
        day:null,
        availability:{startTime: "default", endTime: "default"}
    };
    
    events.subscribe('adminDataFetched', setSeason)
    events.subscribe("addAdminTimeBlockClicked", addAdminAvailabilityBlock);
    events.subscribe("modifyAdminTimeBlockSelectorValue", modifyAdminAvailabilityValue);
    events.subscribe("adminAvailabilityBlockEditRequested", setAdminAvailabilityDataEditRequest);
    events.subscribe("cancelAdminBlockChangesClicked", setAdminAvailabilityDataCancelRequest);
    events.subscribe("updateAdminBlockClicked", validateChanges);
    events.subscribe("adminAvailabilityDataValidated", updateBlockData);
    events.subscribe("adminAvailabilityDataValidationFailed", renderBlockValidationErrors);
    events.subscribe("editAdminBlockDataSaved", publishBlockUpdatesToAllBlocks);
    events.subscribe("newAdminBlockDataSaved", addBlockDataToAllBlocks);
    
    function setSeason(adminData){
        timeBlockDefault.season = adminData.season
    }

    function addAdminAvailabilityBlock(day){
        adminAvailabilityDataStable = structuredClone(timeBlockDefault);
        adminAvailabilityDataMutable = structuredClone(adminAvailabilityDataStable);
        adminAvailabilityDataMutable.day = day

        events.publish("adminAvailabilityBlockAddRequested", {timeBlock: adminAvailabilityDataMutable, origin: "add"});
    }

    function setAdminAvailabilityDataEditRequest(timeBlock){
        adminAvailabilityDataStable = structuredClone(timeBlock);
        adminAvailabilityDataMutable = structuredClone(adminAvailabilityDataStable)

        events.publish("adminBlockDataLoaded", {timeBlock: adminAvailabilityDataMutable, origin:"edit"})
    }

    function setAdminAvailabilityDataCancelRequest(){
        adminAvailabilityDataStable = {};

        events.publish("adminAvailabilityDataChangesCancelled")
    }

    function modifyAdminAvailabilityValue(timeBlockObj){
        const {modifiedSelector, value} = timeBlockObj;
        
        adminAvailabilityDataMutable.availability[modifiedSelector] = value;
    }

    function validateChanges(origin){
        events.publish("adminBlockDataValidationRequested", {timeBlock: adminAvailabilityDataMutable, origin})
    }

    function updateBlockData(validatedBlockData){
		if(validatedBlockData.origin == "edit"){
			events.publish("adminBlockUpdateRequested", validatedBlockData.timeBlock) 
		}else{
			events.publish("newAdminBlockAdditionRequested", validatedBlockData.timeBlock)
		}
	}

    function renderBlockValidationErrors(validationErrorData){
        const {errors, origin} = validationErrorData
        events.publish("renderAdminBlockValidationErrors", {timeBlock: adminAvailabilityDataMutable, errors, origin})
    }

    function publishBlockUpdatesToAllBlocks(){
        events.publish("updateAllAdminBlocksModel", adminAvailabilityDataMutable)
    }

    function addBlockDataToAllBlocks(_id){
        adminAvailabilityDataMutable._id = _id;
        events.publish("updateAllAdminBlocksModel", adminAvailabilityDataMutable);
    }

})()

export {singleAdminTimeBlockModel}