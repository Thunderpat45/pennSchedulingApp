import { events } from "../../../../src/events";
import {timeValueConverter} from "../../../timeConverter";

const adminTimeBlockDataGridComponent = (function(){

    events.subscribe("renderUpdatedAdminBlockData", renderAdminTimeBlockDay)

    function renderAdminTimeBlockDay(adminTimeBlockDayData){
        const {day, blocks} = adminTimeBlockDayData
    
        const adminBlocksDiv = document.querySelector("#adminMainPageAddAvailabilityBlockAllUsersGrid");
        const dayDiv = Array.from(adminBlocksDiv.querySelectorAll("div")).find(function(div){
            return div.firstElementChild.innerText == day;
        });
        const dayAllBlocksDiv = dayDiv.querySelector(".adminMainPageAddAvailabilityBlockAllUsersAllBlocks");
        const dayAllBlocksDivNew = document.createElement("div");
        dayAllBlocksDivNew.classList.add("adminMainPageAddAvailabilityBlockAllUsersAllBlocks")
    
        if(blocks.length > 0){
            blocks.forEach(function(timeBlockData){
                const row = buildBlockRow(day, timeBlockData);
                dayAllBlocksDivNew.appendChild(row)
            })
        }else{
            const defaultText = document.createElement('p');
            defaultText.innerText = "No timeblocks";
            dayAllBlocksDivNew.appendChild(defaultText);
        }
        
    
        dayAllBlocksDiv.replaceWith(dayAllBlocksDivNew);
    }
     
    function buildBlockRow(day, blockData){ 
        const {_id} = blockData
        const elements = setTemplateElements()
        setElementsContent(elements, blockData);
        setEventListeners(elements, {day, _id});
        
        return elements.content 
    }
    
    function setTemplateElements(){
        const template = document.querySelector("#adminMainPageAddAvailabilityBlockAllUsersBlockTemplate");
        const content = document.importNode(template.content, true);
    
        const main = content.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlock");
        const startTimeText = content.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockStart > p")
        const endTimeText = content.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockEnd > p")
        
        const editButton = content.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockEditButton");
        const deleteButton = content.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockDeleteButton");
        
        return {main, content, startTimeText, endTimeText, editButton, deleteButton}
    }
    
    function setElementsContent(blockElement, blockData){
        blockElement.main.setAttribute("dataTimeBlockId", blockData._id)
        if(isNaN(Number(blockData.availability.startTime)) == false){
            blockElement.startTimeText.innerText += timeValueConverter.runConvertTotalMinutesToTime(blockData.availability.startTime);
        }else{
            blockElement.startTimeText.innerText = blockData.availability.startTime;
        }
        if(isNaN(Number(blockData.availability.endTime)) == false){
            blockElement.endTimeText.innerText += timeValueConverter.runConvertTotalMinutesToTime(blockData.availability.endTime);
        }else{
            blockElement.endTimeText.innerText =blockData.availability.endTime;
        }
        
    }
    
    function setEventListeners(timeBlockElement, timeBlockData){
        timeBlockElement.editButton.addEventListener("click", editAdminTimeBlock);
        timeBlockElement.deleteButton.addEventListener("click", deleteAdminTimeBlock);
    
        function editAdminTimeBlock(){
            events.publish("editAdminAvailabilityClicked", timeBlockData)
        }
        function deleteAdminTimeBlock(){
            const confirmation = confirm("Delete this time block?");
            if(confirmation){
                events.publish("deleteAdminAvailabilityClicked", timeBlockData)
            }
            
        }
    }

})()

export {adminTimeBlockDataGridComponent}