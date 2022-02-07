//ADMIN TEAMS DIV;; CONTINUATION TBD!
import { events } from "../../events";

//adminTimeBlocker display is blockGrid (allTimeBlocks), saveChanges, cancelChanges buttons; dataModel issue to determine when to write changes to allUsers (FE or BE)
function renderAdminTimeBlockDay(adminTimeBlockDayData){
    const {day, blocks} = adminTimeBlockDayData

    const adminBlocksDiv = document.querySelector("#adminMainPageAddAvailabilityBlockAllUsersGrid");
    const dayDiv = adminBlocksDiv.querySelector(`div > h3[innerText = "${day}"]`); //make sure this works
    const dayAllBlocksDiv = dayDiv.querySelector(".adminMainPageAddAvailabilityBlockAllUsersAllBlocks");
    const dayAllBlocksDivNew = document.createElement("div");
    dayAllBlocksDivNew.classList.add("adminMainPageAddAvailabilityBlockAllUsersAllBlocks")

    adminTimeBlockDayData.forEach(function(timeBlock){
        const blockNumber = blocks.indexOf(timeBlock);
        const row = buildBlockRow(day, blockNumber, timeBlock);
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
    const timeBlockModel = {day, blockNumber, timeBlockData}

    const elements = setTemplateElements()
    setElementsContent(elements, timeBlockData);
    setEventListeners(elements, timeBlockModel);
    
    return elements.content 
}


function setTemplateElements(){
    const template = document.querySelector("#adminMainPageAddAvailabilityBlockAllUsersBlockTemplate");
    const content = document.importNode(template.content, true);

    const startTimeText = content.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockStart").firstChild;
    const endTimeText = content.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockEnd").firstChild;
    
    const editButton = content.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockEditButton");
    const deleteButton = content.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockDeleteButton");
    
    return {content, startTimeText, endTimeText, editButton, deleteButton}
}


function setElementsContent(blockElement, blockData){
    blockElement.startTimeText.innerText += blockData.startTime;
    blockElement.endTimeText.innerText += blockData.endTime;
}


function setEventListeners(timeBlockElement, timeBlockModel){
    timeBlockElement.editButton.addEventListener("click", editAdminTimeBlock);
    timeBlockElement.deleteButton.addEventListener("click", deleteAdminTimeBlock);

    function editAdminTimeBlock(){
        events.publish("editAdminAvailabilityClicked", timeBlockModel)
    }
    function deleteAdminTimeBlock(){
        events.publish("deleteAdminAvailabilityChangesClicked", timeBlockModel)
    }
}


export {renderAdminTimeBlockDay}