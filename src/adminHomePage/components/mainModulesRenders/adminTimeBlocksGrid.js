//ADMIN TEAMS DIV;; CONTINUATION TBD!
import { events } from "../../../events";

//adminTimeBlocker display is blockGrid (allTimeBlocks), saveChanges, cancelChanges buttons; dataModel issue to determine when to write changes to allUsers (FE or BE)
function renderAdminTimeBlockDay(adminTimeBlockDayData){
    const {day, blocks} = adminTimeBlockDayData

    const adminBlocksDiv = document.querySelector("#adminMainPageAddAvailabilityBlockAllUsersGrid");
    const dayDiv = adminBlocksDiv.querySelector(`div > h3[innerText = "${day}"]`); //make sure this works
    const dayAllBlocksDiv = dayDiv.querySelector(".adminMainPageAddAvailabilityBlockAllUsersAllBlocks");
    const dayAllBlocksDivNew = document.createElement("div");
    dayAllBlocksDivNew.classList.add("adminMainPageAddAvailabilityBlockAllUsersAllBlocks")

    adminTimeBlockDayData.forEach(function(timeBlockData){
        const blockNumber = blocks.indexOf(timeBlockData);
        const row = buildBlockRow(day, blockNumber, timeBlockData);
        dayAllBlocksDivNew.appendChild(row)
    })

    dayAllBlocksDiv.replaceWith(dayAllBlocksDivNew);

   //data being sent as obj {day: STRING, blocks: [{start/end/admin}]}

                    //move this out to mainPage JS not to be rerendered each time
                    // addButton.addEventListener("click", function addAdminTimeBlock(){
                    // events.publish('addAdminTimeBlockClicked', {adminTimeBlockDiv, day})
                    // })
}


function buildBlockRow(day, blockNumber, timeBlockData){ 
    const timeBlockObj = {day, blockNumber, _id: timeBlockData._id}

    const elements = setTemplateElements()
    setElementsContent(elements, timeBlockData);
    setEventListeners(elements, timeBlockObj);
    
    return elements.content 
}


function setTemplateElements(){
    const template = document.querySelector("#adminMainPageAddAvailabilityBlockAllUsersBlockTemplate");
    const content = document.importNode(template.content, true);

    const main = content.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlock");
    const startTimeText = content.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockStart").firstChild;
    const endTimeText = content.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockEnd").firstChild;
    
    const editButton = content.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockEditButton");
    const deleteButton = content.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockDeleteButton");
    
    return {main, content, startTimeText, endTimeText, editButton, deleteButton}
}


function setElementsContent(blockElement, blockData){
    blockElement.main.setAttribute("dataTimeBlockId", blockData._id)
    blockElement.startTimeText.innerText += blockData.startTime;
    blockElement.endTimeText.innerText += blockData.endTime;
}


function setEventListeners(timeBlockElement, timeBlockObj){
    timeBlockElement.editButton.addEventListener("click", editAdminTimeBlock);
    timeBlockElement.deleteButton.addEventListener("click", deleteAdminTimeBlock);

    function editAdminTimeBlock(){
        events.publish("editAdminAvailabilityClicked", timeBlockObj)
    }
    function deleteAdminTimeBlock(){
        events.publish("deleteAdminAvailabilityChangesClicked", timeBlockObj)
    }
}


export {renderAdminTimeBlockDay}