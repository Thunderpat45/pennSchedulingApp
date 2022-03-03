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
        allAvailabilityDataStable = userData.availabilityTimeBlocks;
        createAvailabilityDeepCopy(allAvailabilityDataMutable, allAvailabilityDataStable);
    }

    function createAvailabilityDeepCopy(newObj, copyObj){
        for(let prop in newObj){
            delete newObj[prop]
        }

        for(let day in copyObj){
            newObj[day] = [];
            copyObj[day].forEach(function(timeBlock){ //edit
                const {admin, day, season, _id, coach} = timeBlock
                const timeBlockCopy = Object.assign({}, {admin, day, season, _id, coach});
                timeBlockCopy.availability = Object.assign({}, timeBlock.availability)
                newObj[day].push(timeBlockCopy);
                

            });
        }
    }

    function editAvailabilityBlock(timeBlockObj){
        const {day, _id} = timeBlockObj;
        const block = allAvailabilityDataMutable[day].filter(function(timeBlock){
            return timeBlock._id == _id;
        })[0]

        events.publish("availabilityBlockEditRequested", block); //add publish that sends to form, need _id/day?
    }

    function deleteAvailabilityBlock(timeBlockObj){
        events.publish("availabilityBlockDeleteRequested", timeBlockObj); //send this to database, change to deleteRequested?
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
		
        createAvailabilityDeepCopy(allAvailabilityDataStable, allAvailabilityDataMutable);
		events.publish("renderUpdatedAvailabilityBlockData", {day: blockData.day, blocks: allAvailabilityDataMutable[blockData.day]})
    }

    function setDataBlockDataDeleted(blockData){
        const {day, _id} = blockData
		const newBlocksList = allAvailabilityDataMutable[day].filter(function(block){
			return _id != block._id
		})

		allAvailabilityDataMutable[day] = newBlocksList;
		createAvailabilityDeepCopy(allAvailabilityDataStable, allAvailabilityDataMutable);
		events.publish("renderUpdatedAvailabilityBlockData", {day, blocks: allAvailabilityDataMutable[day]})
	}

})()

export {allAvailabilityDataModel}