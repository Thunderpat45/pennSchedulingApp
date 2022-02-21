import {events} from "../../../src/events"
import { timeValueConverter } from "../../timeConverter";

const allAdminMainPageAdminTimeBlockModel = (function(){
    //find subscriber to database update
    //updates here would need to pushed to all users, should this publish to allUsers here, or do this on backEnd before DB save? Look at Node/Mongo scripts to determine how viable this is one way or another
    let allAdminAvailabilityDataStable = {};
    let allAdminAvailabilityDataMutable = {};
    
    events.subscribe("adminDataFetched", setDataNewPageRender);
    events.subscribe("updateAllBlocksModel", setDataNewDatabasePost)
    events.subscribe("editAdminAvailabilityClicked", editAdminAvailabilityBlock)
    events.subscribe("deleteAdminAvailabilityClicked", deleteAdminAvailabilityBlock);
    events.subscribe("facilityDataAvailabiltyUpdateComparisonRequested", renderAllDays)
    events.subscribe('blockDataDeleted', setDataBlockDataDeleted)

    function setDataNewPageRender(adminData){
        allAdminAvailabilityDataStable = adminData.adminTimeBlocks;
        createAdminAvailabilityDeepCopy(allAdminAvailabilityDataMutable, allAdminAvailabilityDataStable);
    }

    function createAdminAvailabilityDeepCopy(newObj, copyObj){
        for(let prop in newObj){
            delete newObj[prop]
        }

        for(let day in copyObj){
            newObj[day] = [];
            copyObj[day].forEach(function(timeBlock){
                const {admin, day, season, _id} = timeBlock
                const timeBlockCopy = Object.assign({}, {admin, day, season, _id});
                timeBlockCopy.availability = Object.assign({}, timeBlock.availability)
                newObj[day].push(timeBlockCopy);
                

            });
        }
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
		
        createAdminAvailabilityDeepCopy(allAdminAvailabilityDataStable, allAdminAvailabilityDataMutable);
		events.publish("renderUpdatedBlockData", {day: blockData.day, blocks: allAdminAvailabilityDataMutable[blockData.day]})
    }

    function renderAllDays(facilityData){
        const tempObj = {};
        createAdminAvailabilityDeepCopy(tempObj, allAdminAvailabilityDataMutable)
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

            events.publish("renderUpdatedBlockData", {day, blocks: tempObj[day]})
        }
    }
    function setDataBlockDataDeleted(blockData){
        const {day, _id} = blockData
		const newBlocksList = allAdminAvailabilityDataMutable[day].filter(function(block){
			return _id != block._id
		})

		allAdminAvailabilityDataMutable[day] = newBlocksList;
		createAdminAvailabilityDeepCopy(allAdminAvailabilityDataStable, allAdminAvailabilityDataMutable);
		events.publish("renderUpdatedBlockData", {day, blocks: allAdminAvailabilityDataMutable[day]})
	}

})()

export {allAdminMainPageAdminTimeBlockModel}