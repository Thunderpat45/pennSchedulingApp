
import {events} from "../events"

const availabilityDOM = (function(){

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
        events.publish("renderPage", availabilityPage)
    }

    function renderAvailabilityDOM(availability){
        const template = document.querySelector("#availabilityDOMTemplate");
        const content = document.importNode(template.content, true);
        const grid = content.querySelector("#avaiabilityGrid");
        const gridNew = buildAvailabilityGrid(availability);
        const updateButton = content.querySelector("#availabilityUpdateButton");
        const cancelButton = content.querySelector("#availabilityCancelButton");

        grid.replaceWith(gridNew);
        gridNew.id = "availabilityGrid";

        updateButton.innerText = "Update";
        updateButton.addEventListener("click", updateAvailability)

        cancelButton.innerText = "Cnacel";
        cancelButton.addEventListener("click", cancelAvailabilityChanges);

        return content
        
        function updateAvailability(){
            events.publish("updateAvailabilityClicked", availability)
        }

        function cancelAvailabilityChanges(){ // find subscriber to this, fix param
            events.publish("cancelAvailabilityChangesClicked", "?")
        }
    }

    function buildAvailabilityGrid(availability){
        const gridNew = document.createElement("div");

        for(let day in availability){
            const dayDiv = document.createElement("div");
            dayDiv.classList.add(`availability${day}`) //why did I add this?
            
            const label = document.createElement("h3");
            const addButton = document.createElement("button");

            label.innerText = `${day}`
            day.forEach(function(timeBlock){
                const blockNumber = day.indexOf(timeBlock) + 1;
                const row = buildAvailabilityRow(day, timeBlock, blockNumber);
                dayDiv.appendChild(row)
            })
            addButton.addEventListener("click", addTimeBlock);
            
            dayDiv.appendChild(label);
            dayDiv.appendChild(addButton);

            gridNew.appendChild(dayDiv);

            function addTimeBlock(){ //linter doesn't want inner declaration, but day is not available outside the loop; resolve how?
                events.publish("addTimeBlockClicked", day)
            }
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
        const children = Array.from(content.children);
        const deleteButton = content.querySelector(".availabilityDeleteButton");

        children.forEach(function(child){ //does children refer to children of template or children of first div?
            const selection = child.querySelector(".selector");
            if(selection != undefined){ 
                const selectionNew = buildSelector(day, timeBlock, blockNumber, selection)
                selection.replaceWith(selectionNew)
            }
        });
        deleteButton.addEventListener("click", deleteTimeBlock);

        return content
        
        function deleteTimeBlock(){
            events.publish("deleteTImeBlockClicked", {day, blockNumber})
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

export {availabilityDOM}