import {events} from "../events"
/* */
const adminMainPageAdminTimeBlockModel = (function(){

    let adminAvailabilityModel;
    let adminAvailabilityModelCopy;
    let timeBlockDefault = { //issue with default vs null?
        start:"default",
        end:"default"
    };

    events.subscribe("adminMainPageModelBuilt", setAdminAvailabilityModel);
    events.subscribe("deleteAdminTimeBlockClicked", deleteAdminAvailabilityRow);
    events.subscribe("addAdminTimeBlockClicked", addAdminAvailabilityRow);
    events.subscribe("modifyAdminTimeBlockSelectorValue", modifyAdminAvailabilityValue);
    events.subscribe("updateAdminAvailabilityClicked", updateAdminAvailability);
    events.subscribe("cancelAdminAvailabilityChangesClicked", cancelAdminAvailabilityChanges)

    function setAdminAvailabilityModel(adminData){
        adminAvailabilityModel = adminData.adminTimeBlocks;
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
        const blockIndex = rowObj.blockNumber -1;
        const timeBlock = adminAvailabilityModelCopy[rowObj.day][blockIndex];
        adminAvailabilityModelCopy[rowObj.day].splice(timeBlock, 1);

        events.publish("adminAvailabilityModelModified", {adminTimeBlockDiv: rowObj.adminTimeBlockDiv, adminMainPageData: adminAvailabilityModelCopy});
    }

    function modifyAdminAvailabilityValue(rowObj){
        const blockIndex = rowObj.blockNumber - 1;
        adminAvailabilityModelCopy[rowObj.day][blockIndex][rowObj.selector] = rowObj.value
    }

    function updateAdminAvailability(){ //listener is not yet specified, should be module that updates the DB
        events.publish("adminAvailabilityDataUpdated", adminAvailabilityModelCopy)
    }

    function cancelAdminAvailabilityChanges(adminTimeBlockDiv){
        setAdminAvailabilityModelCopy();
        events.publish("adminAvailabilityModelModified", {adminTimeBlockDiv, adminMainPageData: adminAvailabilityModelCopy})
    }
})()

export {adminMainPageAdminTimeBlockModel}