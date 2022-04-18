import {events} from "../../../src/events"
import { timeValueConverter } from "../../timeConverter";

const allAvailabilityDataModel = (function(){
    
    let allAvailabilityDataStable = {};
    let allAvailabilityDataMutable = {};
    
    events.subscribe("userDataFetched", setDataNewPageRender);
    events.subscribe("updateAllAvailabilityBlocksModel", setDataNewDatabasePost)
    events.subscribe("editAvailabilityClicked", editAvailabilityBlock)
    events.subscribe("deleteAvailabilityClicked", deleteAvailabilityBlock);
    events.subscribe('availabilityBlockDataDeleted', setDataBlockDataDeleted)

    function setDataNewPageRender(userData){
        allAvailabilityDataStable = structuredClone(userData.availabilityTimeBlocks);
        allAvailabilityDataMutable = structuredClone(allAvailabilityDataStable);
    }

    function editAvailabilityBlock(timeBlockObj){
        const {day, _id} = timeBlockObj;
        const block = allAvailabilityDataMutable[day].filter(function(timeBlock){
            return timeBlock._id == _id;
        })[0]

        events.publish("availabilityBlockEditRequested", block); 
    }

    function deleteAvailabilityBlock(timeBlockObj){
        events.publish("availabilityBlockDeleteRequested", timeBlockObj);
    }

    function setDataNewDatabasePost(blockData){
		const thisBlockIndex = allAvailabilityDataMutable[blockData.day].findIndex(function(block){
			return block._id == blockData._id
		});
		if(thisBlockIndex != -1){
			allAvailabilityDataMutable[blockData.day][thisBlockIndex] = blockData
		}else{
			allAvailabilityDataMutable[blockData.day].push(blockData);
		}
		
        allAvailabilityDataStable= structuredClone(allAvailabilityDataMutable);
		events.publish("renderUpdatedAvailabilityBlockData", {day: blockData.day, blocks: allAvailabilityDataMutable[blockData.day]})
    }

    function setDataBlockDataDeleted(blockData){
        const {day, _id} = blockData
		const newBlocksList = allAvailabilityDataMutable[day].filter(function(block){
			return _id != block._id
		})

		allAvailabilityDataMutable[day] = newBlocksList;
		allAvailabilityDataStable = structuredClone(allAvailabilityDataMutable);
		events.publish("renderUpdatedAvailabilityBlockData", {day, blocks: allAvailabilityDataMutable[day]})
	}

})()

export {allAvailabilityDataModel}