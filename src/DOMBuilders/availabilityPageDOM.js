
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

    events.subscribe("selectorsBuilt", setSelectorNodes);
    events.subscribe("availabilityModelModified", buildAvailabilityGrid);
    events.subscribe("availabilityDOMPageRequested", publishAvailabilityPageRender);

    function setSelectorNodes(obj){
        for(let prop in obj){
            switch(prop){
                case `startTime`:
                case `endTime`:
                    selectorNodes[prop] = prop.value;
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
        gridNew.id = "availabilityGrid";

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

        for(let day in availability){
            const dayDiv = document.createElement("div");
            dayDiv.classList.add("availabilityDay")
            
            const label = document.createElement("h3");
            const addButton = document.createElement("button");

            label.innerText = `${day}`
            day.forEach(function(timeBlock){ //ensure that all days are present at start when profile is first created, as there is no function to add a day, only add a time to an existing day
                const blockNumber = day.indexOf(timeBlock) + 1;
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
        const row = content.querySelector(".availabilityGridRow")
        const children = Array.from(row.children);
        const deleteButton = content.querySelector(".availabilityDeleteButton");

        children.forEach(function(child){
            const selection = child.querySelector(".selector");
            if(selection != undefined){ 
                const selectionNew = buildSelector(day, timeBlock, blockNumber, selection)
                selection.replaceWith(selectionNew)
            }
        });
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