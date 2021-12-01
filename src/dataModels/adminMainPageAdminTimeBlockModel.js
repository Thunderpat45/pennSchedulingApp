import {events} from "../events"

/*purpose: dataModel for modifying/saving adminTimeBlock content for adminMainPage

database object is modeled as such:

obj = {
    day: [
        {start, stop, admin}, {start, stop, admin}
    ],
    day: [
        {start, stop, admin}, {start, stop, admin}
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
    let adminAvailabilityModel;
    let adminAvailabilityModelCopy;
    let timeBlockDefault = {
        start:"default",
        end:"default",
        admin:"yes"
    };

    events.subscribe("adminMainPageModelBuilt", setAdminAvailabilityModel);
    events.subscribe("deleteAdminTimeBlockClicked", deleteAdminAvailabilityRow);
    events.subscribe("addAdminTimeBlockClicked", addAdminAvailabilityRow);
    events.subscribe("modifyAdminTimeBlockSelectorValue", modifyAdminAvailabilityValue);
    events.subscribe("updateAdminAvailabilityClicked", validateAdminAvailability);
    events.subscribe("adminAvailabilityDataValidated", updateAdminAvailability)
    events.subscribe("cancelAdminAvailabilityChangesClicked", cancelAdminAvailabilityChanges)

    function setAdminAvailabilityModel(adminData){
        adminAvailabilityModel = adminData.adminTimeBlocks;
        setAdminAvailabilityModelCopy()
    }

    function setAdminAvailabilityModelCopy(){
        adminAvailabilityModelCopy = Object.assign({}, adminAvailabilityModel);
        for(let day in adminAvailabilityModelCopy){
            adminAvailabilityModelCopy[day] = adminAvailabilityModel[day].concat();
            day.forEach(function(timeBlock){
                adminAvailabilityModelCopy[day][timeBlock] = Object.assign({}, adminAvailabilityModel[day][timeBlock])
            });
        }
    }

    function addAdminAvailabilityRow(obj){
        adminAvailabilityModelCopy[obj.day].push(Object.assign({}, timeBlockDefault));

        events.publish("adminAvailabilityModelModified", {adminTimeBlockDiv : obj.adminTimeBlockDiv, adminMainPageData: adminAvailabilityModelCopy});
    }

    function deleteAdminAvailabilityRow(rowObj){
        const blockIndex = rowObj.blockNumber;
        const timeBlock = adminAvailabilityModelCopy[rowObj.day][blockIndex];
        adminAvailabilityModelCopy[rowObj.day].splice(timeBlock, 1);

        events.publish("adminAvailabilityModelModified", {adminTimeBlockDiv: rowObj.adminTimeBlockDiv, adminMainPageData: adminAvailabilityModelCopy});
    }

    function modifyAdminAvailabilityValue(rowObj){
        const blockIndex = rowObj.blockNumber;
        adminAvailabilityModelCopy[rowObj.day][blockIndex][rowObj.selector] = rowObj.value
    }

    function validateAdminAvailability(){
        events.publish("adminAvailabilityValidationRequested", adminAvailabilityModelCopy)
    }

    function updateAdminAvailability(){
        events.publish("adminAvailabilityDataUpdated", adminAvailabilityModelCopy) //find subscriber 
    }

    function cancelAdminAvailabilityChanges(adminTimeBlockDiv){
        setAdminAvailabilityModelCopy();
        events.publish("adminAvailabilityModelModified", {adminTimeBlockDiv, adminMainPageData: adminAvailabilityModel})
    }
})()

export {adminMainPageAdminTimeBlockModel}