import {events} from "../events"

/*purpose: dataModel for modifying/saving adminTimeBlock content for adminMainPage

database object is modeled as such:

obj = {
    day: [
        {startTime, stopTime, admin}, {startTime, stopTime, admin}
    ],
    day: [
        {startTime, stopTime, admin}, {startTime, stopTime, admin}
    ]
}

publishes:
    adminTimeBlockDOM renders FOR adminMainPageDOM
    save requests FOR database
   
subscribes to: 
    adminMainPageModel builds FROM adminMainPageModel
    add timeBlock, deleteTimeBlock, and time modification changes FROM adminMainPageDOM
    save change and cancel change requests FROM adminMainPageDOM
*/

const adminMainPageAdminTimeBlockModel = (function(){
    //find subscriber to databse update
    //updates here would need to pushed to all users, should this publish to allUsers here, or do this on backEnd before DB save? Look at Node/Mongo scripts to determine how viable this is one way or another
    let adminAvailabilityDataStable;
    let adminAvailabilityDataMutable;
    
    let timeBlockDefault = {
        startTime:"default",
        endTime:"default",
        admin:"yes"
    };

    events.subscribe("adminDataFetched", setDataNewPageRender); //change event prompt
    events.subscribe("", setDataNewDatabasePost) //add event prompt about successful database post

    events.subscribe("editAdminAvailabilityClicked", editAdminAvailabilityBlock)
    events.subscribe("deleteAdminTimeBlockClicked", deleteAdminAvailabilityBlock);
    events.subscribe("addAdminTimeBlockClicked", addAdminAvailabilityBlock);
    events.subscribe("modifyAdminTimeBlockSelectorValue", modifyAdminAvailabilityValue);
    events.subscribe("updateAdminAvailabilityClicked", validateAdminAvailability);
    events.subscribe("adminAvailabilityDataValidated", updateAdminAvailability)
    events.subscribe("cancelAdminAvailabilityChangesClicked", cancelAdminAvailabilityChanges)

    function setDataNewPageRender(adminData){
        adminAvailabilityDataStable = adminData.adminTimeBlocks; //make sure this is correct property for database initial database fetch
        createAdminAvailabilityDeepCopy(adminAvailabilityDataMutable, adminAvailabilityDataStable)
    }

    function setDataNewDatabasePost(){
        createAdminAvailabilityDeepCopy(adminAvailabilityDataStable, adminAvailabilityDataMutable);
    }

    function createAdminAvailabilityDeepCopy(newObj, copyObj){
        newObj = Object.assign({}, copyObj);
        for(let day in newObj){
            newObj[day] = copyObj[day].concat();
            copyObj[day].forEach(function(timeBlock){
                newObj[day][timeBlock] = Object.assign({}, copyObj[day][timeBlock])
            });
        }
    }

    function editAdminAvailabilityBlock(timeBlockObj){
        const {day, _id} = timeBlockObj;
        const block = adminAvailabilityDataMutable[day].filter(function(timeBlock){
            return timeBlock._id == _id;
        })[0]
        events.publish("adminAvailabilityBlockEditRequested", {day, block, _id}); //add publish that sends to form
    }

    function deleteAdminAvailabilityBlock(timeBlockObj){
        const {day, _id} = timeBlockObj;
        const block = adminAvailabilityDataMutable[day].filter(function(timeBlock){
            return timeBlock._id == _id;
        })[0];

        events.publish("adminAvailabilityBlockDeleted", {day, block, _id}); //send this to database, change to deleteRequested?
    }

    function addAdminAvailabilityBlock(day){
        events.publish("adminAvailabilityBlockAddRequested", {day, timeBlockDefault}); //add publish that sends to form
    }

    function modifyAdminAvailabilityValue(timeBlockObj){
        const {day, _id, modifiedSelector, value} = timeBlockObj;
        const block = adminAvailabilityDataMutable[day].filter(function(timeBlock){
            return timeBlock._id == _id;
        })[0];
        
        block[modifiedSelector] = value
    }

    function validateAdminAvailability(){
        events.publish("adminAvailabilityValidationRequested", adminAvailabilityDataMutable)
    }


    function updateAdminAvailability(timeBlockObj){
        events.publish("adminAvailabilityDataUpdated", timeBlockObj) //send this to database, change to updateRequested?
    }

    function cancelAdminAvailabilityChanges(){
        createAdminAvailabilityDeepCopy(adminAvailabilityDataMutable, adminAvailabilityDataStable);
    }
})()

export {adminMainPageAdminTimeBlockModel}