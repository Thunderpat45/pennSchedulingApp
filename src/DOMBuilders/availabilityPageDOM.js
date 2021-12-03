
import {events} from "../events"

/*action: user interface for modifying availability

availability object is modeled as such:

obj = {
    
    day: 
    [
        {startTime, stopTime, admin}, 
        {startTime, stopTime, admin}
    ], 
    day: 
    [
        {etc}, 
        {etc},
    ]
}

publishes:
    page render requests FOR pageRenderer
    add/delete/modify/update requests FOR availabilityModel

subscribes to: 
    userMainPageModel builds FROM mainPageModel
    userSelectorsBuilt FROM selectorDOMBuilder
    build requests FROM availabilityModel
    
*/

const availabilityPageDOM = (function(){
    //no obvious issues here
    let selectorNodes = {
        startTime:null, 
        endTime:null
    };

    events.subscribe("userSelectorsBuilt", setSelectorNodes);
    events.subscribe("availabilityModelModified", buildAvailabilityGrid);
    events.subscribe("availabilityDOMPageRequested", publishAvailabilityPageRender);

    function setSelectorNodes(selectorElementObj){
        for(let selectorElement in selectorElementObj){
            switch(selectorElement){
                case `startTime`:
                case `endTime`:
                    selectorNodes[selectorElement] = selectorElementObj[selectorElement];
                    break;
                default:
                    return;
            }  
        }  
    }

    function publishAvailabilityPageRender(availability){
        const availabilityPage = renderAvailabilityDOM(availability);
        events.publish("pageRenderRequested", availabilityPage)
    }

    function renderAvailabilityDOM(availability){
        const template = document.querySelector("#availabilityDOMTemplate");
        const content = document.importNode(template.content, true);

        const grid = content.querySelector("#availabilityGrid");
        const updateButton = content.querySelector("#availabilityUpdateButton");
        const cancelButton = content.querySelector("#availabilityCancelButton");

        const gridNew = buildAvailabilityGrid(availability);

        grid.replaceWith(gridNew);

        updateButton.addEventListener("click", updateAvailability)
        cancelButton.addEventListener("click", cancelAvailabilityChanges);

        return content
        
        function updateAvailability(){
            events.publish("updateAvailabilityClicked")
        }

        function cancelAvailabilityChanges(){
            events.publish("mainPageDOMRequested")
        }
    }

    function buildAvailabilityGrid(availability){
        const gridNew = document.createElement("div");
        gridNew.id = "availabilityGrid";

        for(let day in availability){
            const dayDiv = document.createElement("div");
            dayDiv.classList.add("availabilityDay")
            
            const label = document.createElement("h3");
            const addButton = document.createElement("button");

            label.innerText = `${day}`

            dayDiv.appendChild(label);
            dayDiv.appendChild(addButton);

            day.forEach(function(timeBlock){
                const blockNumber = day.indexOf(timeBlock);
                const row = buildAvailabilityRow(day, timeBlock, blockNumber);
                dayDiv.appendChild(row)
            })
            
            gridNew.appendChild(dayDiv);
            
            addButton.addEventListener("click", function addTimeBlock(){
                events.publish("addTimeBlockClicked", day)
            })
        }

        const grid = document.querySelector("#availabilityGrid");
        if(grid != null){
            grid.replaceWith(gridNew)
        }else{
            return gridNew
        }
        
        
    }

    function buildAvailabilityRow(day, timeBlock, blockNumber){
        const template = document.querySelector("#availabilityGridRowTemplate");
        const content = document.importNode(template.content, true);

        const availabilitySelectors = content.querySelectorAll(".selector")
        const deleteButton = content.querySelector(".availabilityDeleteButton");
        

        availabilitySelectors.forEach(function(selection){
            const primaryClass = Array.from(selection.classList)[0];
            
            const selectionNew = selectorNodes[`${primaryClass}`].cloneNode(true);
            selectionNew.addEventListener("change", publishAvailabilitySelectionChange)
            
            const selectedOption = selectionNew.querySelector(`option[value = ${selectionNew.value}]`);
            selectedOption.selected = true; 
            if(selectedOption.value != "default"){
                selectionNew.firstChild.disabled = true;
            }

            selection.replaceWith(selectionNew)   

            function publishAvailabilitySelectionChange(){
                const selector = primaryClass;
                const value = selectionNew.value
                events.publish("modifySelectorValue", {blockNumber, day, selector, value})
            }
        });

        if(timeBlock.admin == "yes"){
            deleteButton.remove()
        }

        deleteButton.addEventListener("click", deleteTimeBlock); 

        return content
        
        function deleteTimeBlock(){
            events.publish("deleteTimeBlockClicked", {day, blockNumber})
        }
    }
})()

export {availabilityPageDOM}