import {events} from "../../../src/events"
import { timeValueConverter } from "../../timeConverter";

const allAdminMainPageAdminTimeBlockModel = (function(){
   
    let allAdminAvailabilityDataStable = {};
    let allAdminAvailabilityDataMutable = {};
    
    events.subscribe("adminDataFetched", setDataNewPageRender);
    events.subscribe("updateAllAdminBlocksModel", setDataNewDatabasePost)
    events.subscribe("editAdminAvailabilityClicked", editAdminAvailabilityBlock)
    events.subscribe("deleteAdminAvailabilityClicked", deleteAdminAvailabilityBlock);
    events.subscribe("facilityDataAvailabiltyUpdateComparisonRequested", renderAllDays)
    events.subscribe('adminBlockDataDeleted', setDataBlockDataDeleted)

    function setDataNewPageRender(adminData){
        allAdminAvailabilityDataStable = structuredClone(adminData.adminTimeBlocks);
        allAdminAvailabilityDataMutable= structuredClone(allAdminAvailabilityDataStable);
    }

    function editAdminAvailabilityBlock(timeBlockObj){
        const {day, _id} = timeBlockObj;
        const block = allAdminAvailabilityDataMutable[day].filter(function(timeBlock){
            return timeBlock._id == _id;
        })[0]

        events.publish("adminAvailabilityBlockEditRequested", block); //add publish that sends to form, need _id/day?
    }

    function deleteAdminAvailabilityBlock(timeBlockObj){
        const {day, _id} = timeBlockObj;
        const block = allAdminAvailabilityDataMutable[day].filter(function(timeBlock){
            return timeBlock._id == _id;
        })[0];

        events.publish("adminBlockDeleteRequested", block); //send this to database, change to deleteRequested?
    }

    function setDataNewDatabasePost(blockData){
		const thisBlockIndex = allAdminAvailabilityDataMutable[blockData.day].findIndex(function(block){
			return block._id == blockData._id
		});
		if(thisBlockIndex != -1){
			allAdminAvailabilityDataMutable[blockData.day][thisBlockIndex] = blockData
		}else{
			allAdminAvailabilityDataMutable[blockData.day].push(blockData);
		}
		
        allAdminAvailabilityDataStable= structuredClone(allAdminAvailabilityDataMutable);
		events.publish("renderUpdatedAdminBlockData", {day: blockData.day, blocks: allAdminAvailabilityDataMutable[blockData.day]})
    }

    function renderAllDays(facilityData){
        const tempObj = structuredClone(allAdminAvailabilityDataMutable)
        for(let day in tempObj){
            tempObj[day].forEach(function(timeBlock){
                const index = tempObj[day].indexOf(timeBlock)
                if((timeBlock.availability.startTime < facilityData.facilityOpen || 
                    timeBlock.availability.startTime > facilityData.facilityClose)&&
                    (timeBlock.availability.endTime < facilityData.facilityOpen || 
                        timeBlock.availability.endTime > facilityData.facilityClose)){
                        tempObj[day][index].availability.startTime = `Start time ${timeValueConverter.runConvertTotalMinutesToTime( tempObj[day][index].availability.startTime)} is outside facility hours. Speak to supervisor about time changes.`
                        tempObj[day][index].availability.endTime = `End time ${timeValueConverter.runConvertTotalMinutesToTime( tempObj[day][index].availability.endTime)} is outside facility hours. Speak to supervisor about time changes.`
                }else if(timeBlock.availability.startTime < facilityData.facilityOpen || 
                    timeBlock.availability.startTime > facilityData.facilityClose){
                        tempObj[day][index].availability.startTime = `Start time ${timeValueConverter.runConvertTotalMinutesToTime( tempObj[day][index].availability.startTime)} is outside facility hours. Speak to supervisor about time changes.`
                }else if(timeBlock.availability.endTime < facilityData.facilityOpen || 
                        timeBlock.availability.endTime > facilityData.facilityClose){
                            tempObj[day][index].availability.endTime = `End time ${timeValueConverter.runConvertTotalMinutesToTime( tempObj[day][index].availability.endTime)} is outside facility hours. Speak to supervisor about time changes.`
                }     
            })

            events.publish("renderUpdatedAdminBlockData", {day, blocks: tempObj[day]})
        }
    }
    function setDataBlockDataDeleted(blockData){
        const {day, _id} = blockData
		const newBlocksList = allAdminAvailabilityDataMutable[day].filter(function(block){
			return _id != block._id
		})

		allAdminAvailabilityDataMutable[day] = newBlocksList;
		allAdminAvailabilityDataStable= structuredClone(allAdminAvailabilityDataMutable);
		events.publish("renderUpdatedAdminBlockData", {day, blocks: allAdminAvailabilityDataMutable[day]})
	}

})()

export {allAdminMainPageAdminTimeBlockModel}