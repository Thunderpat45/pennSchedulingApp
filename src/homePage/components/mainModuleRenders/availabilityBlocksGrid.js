import { events } from "../../../events";
import {timeValueConverter} from "../../../timeConverter";

const availabilityTimeBlockDataGridComponent = (function(){

    events.subscribe("renderUpdatedAvailabilityBlockData", renderAvailabilityTimeBlockDay)

    function renderAvailabilityTimeBlockDay(availabilityTimeBlockDayData){
        const {day, blocks} = availabilityTimeBlockDayData
    
        const availabilityBlocksDiv = document.querySelector("#userPageAddAvailabilityBlockGrid");
        const dayDiv = Array.from(availabilityBlocksDiv.querySelectorAll("div")).find(function(div){
            return div.firstElementChild.innerText == day;
        });
        const dayAllBlocksDiv = dayDiv.querySelector(".userPageAddAvailabilityAllBlocks");
        const dayAllBlocksDivNew = document.createElement("div");
        dayAllBlocksDivNew.classList.add("userPageAddAvailabilityAllBlocks")
    
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
        const template = document.querySelector("#userPageAddAvailabilityBlockTemplate");
        const content = document.importNode(template.content, true);
    
        const user = content.querySelector(".userPageAddAvailabilityBlock");
        const startTimeText = content.querySelector(".userPageAddAvailabilityBlockStart > p")
        const endTimeText = content.querySelector(".userPageAddAvailabilityBlockEnd > p")
        
        const editButton = content.querySelector(".userPageAddAvailabilityBlockEditButton");
        const deleteButton = content.querySelector(".userPageAddAvailabilityBlockDeleteButton");
        
        return {user, content, startTimeText, endTimeText, editButton, deleteButton}
    }
    
    function setElementsContent(blockElement, blockData){
        blockElement.user.setAttribute("dataTimeBlockId", blockData._id)
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
    
        if(blockData.admin == true){
            blockElement.editButton.remove()
            blockElement.deleteButton.remove()
        }
        
    }
    
    function setEventListeners(timeBlockElement, timeBlockData){
        timeBlockElement.editButton.addEventListener("click", editAdminTimeBlock);
        timeBlockElement.deleteButton.addEventListener("click", deleteAdminTimeBlock);
    
        function editAdminTimeBlock(){
            events.publish("editAvailabilityClicked", timeBlockData)
        }
        function deleteAdminTimeBlock(){
            const confirmation = confirm("Delete this time block?");
            if(confirmation){
                events.publish("deleteAvailabilityClicked", timeBlockData)
            }
            
        }
    }

})()

export {availabilityTimeBlockDataGridComponent}