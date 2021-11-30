
import {events} from "../events"

/*

actions:  availabilityPage interface for creating/editing/delete availability data

publishes:
    request to render availabilityPage
    data update requests for database
    cancellation of data changes
    requests to add/delete/modify timeBlock data in dataModel

subscribes to:
    selector generation
    modifications to availabilityModelCopy
    requests to generate availabilityDOM elements

*/

const availabilityPageDOM = (function(){

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
        const gridNew = buildAvailabilityGrid(availability);
        const updateButton = content.querySelector("#availabilityUpdateButton");
        const cancelButton = content.querySelector("#availabilityCancelButton");

        grid.replaceWith(gridNew);

        updateButton.addEventListener("click", updateAvailability)
        cancelButton.addEventListener("click", cancelAvailabilityChanges);

        return content
        
        function updateAvailability(){
            events.publish("updateAvailabilityClicked", availability)
        }

        function cancelAvailabilityChanges(){
            events.publish("mainPageDOMRequested")
        }
    }

    function buildAvailabilityGrid(availability){
        const gridNew = document.createElement("div");
        gridNew.id = "availabilityGrid"; //should this go after if statement?

        for(let day in availability){
            const dayDiv = document.createElement("div");
            dayDiv.classList.add("availabilityDay")
            
            const label = document.createElement("h3");
            const addButton = document.createElement("button");

            label.innerText = `${day}`
            day.forEach(function(timeBlock){
                const blockNumber = day.indexOf(timeBlock);
                const row = buildAvailabilityRow(day, timeBlock, blockNumber);
                dayDiv.appendChild(row)
            })
            addButton.addEventListener("click", 
                function addTimeBlock(){
                    events.publish("addTimeBlockClicked", day)
                }
            );
            
            dayDiv.appendChild(label);
            dayDiv.appendChild(addButton);

            gridNew.appendChild(dayDiv);
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
            const selectionNew = buildSelector(day, timeBlock, blockNumber, selection)
            selection.replaceWith(selectionNew)   
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

    function buildSelector(day, timeBlock, blockNumber, selection){
            const primaryClass = Array.from(selection.classList)[0];
            const selectionNew = selectorNodes[`${primaryClass}`].cloneNode(true);
            selectionNew.addEventListener("change", publishAvailabilitySelectionChange)
            selectionNew.value = timeBlock[primaryClass];  
            const selectedOption = selectionNew.querySelector(`option[value = ${selectionNew.value}]`);
            selectedOption.selected = true;
            if(selectedOption.value != "default"){
                selectionNew.firstChild.disabled = true;
            }
        
            return selectionNew

            function publishAvailabilitySelectionChange(){
                const selector = primaryClass;
                const value = selectionNew.value
                events.publish("modifySelectorValue", {blockNumber, day, selector, value})
            }
    }

})()

export {availabilityPageDOM}