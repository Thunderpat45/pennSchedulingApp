import {events} from "../../../src/events"

const homeRender = (function(){

    events.subscribe("userDataSet", setHomeEventListeners);

    function setHomeEventListeners(){
        setAvailabilityEventListeners();
    }

    function setAvailabilityEventListeners(){
        const availabilityTimeBlockDays = Array.from(document.querySelector("#userPageAddAvailabilityBlockGrid").children);
    
        availabilityTimeBlockDays.forEach(function(day){
            const dayString = day.querySelector("h3").innerText;
            const addBlockButton = day.querySelector(".userPageAddAvailabilityBlockAddButton");
    
            addBlockButton.addEventListener("click", addTimeBlock);
    
            const dayAllBlocks = Array.from(day.querySelectorAll(".userPageAddAvailabilityAllBlocks > div"));
            if(dayAllBlocks.length > 0 ){
                dayAllBlocks.forEach(function(timeBlock){
                    const _id = timeBlock.dataset.timeblockid
                    const editBlockButton = timeBlock.querySelector(".userPageAddAvailabilityBlockEditButton");
                    const deleteBlockButton = timeBlock.querySelector(".userPageAddAvailabilityBlockDeleteButton")
    
                    if(editBlockButton != null){
                        editBlockButton.addEventListener("click", editTimeBlock);
                        deleteBlockButton.addEventListener("click", deleteTimeBlock);
                    }
                    
    
                    function editTimeBlock(){
                        events.publish("editAvailabilityClicked", {day:dayString, _id})
                    }
    
                    function deleteTimeBlock(){
                        const confirmation = confirm("Delete this time block?");
                        if(confirmation){
                            events.publish("deleteAvailabilityClicked", {day:dayString, _id})
                        }
                    }
                })
            }
    
            function addTimeBlock(){
                events.publish("addAvailabilityTimeBlockClicked", dayString)
            }
        })
    }

})()

export {homeRender}
