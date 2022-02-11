import { events } from "../../../events";
import { selectorBuilder } from "../../../DOMBuilders/selectorDOMBuilder"
import { timeValueConverter } from "../../../timeConverter";


//add events to listen for button to do this
function renderTimeBlockDataForm(adminTimeBlockDayData){
    const formDiv = document.querySelector("#entryForm")

    const elements = setElements();
    populateSelectors(elements, adminTimeBlockDayData);
    setEventListeners(elements, adminTimeBlockDayData);

    if(formDiv.firstChild){
        while(formDiv.firstChild){
            formDiv.remove(formDiv.firstChild)
        }
    }

    formDiv.appendChild(elements.content);
} 


function setElements(){
    const template = document.querySelector("#adminDayTimeBlockFormTemplate");
    const content = document.importNode(template.content, true);

    const timeBlockSelectors = content.querySelectorAll(".selector");                  
    const saveButton = content.querySelector("#adminDayTimeBlockFormSaveButton");
    const cancelButton = content.querySelector("#adminDayTimeBlockFormCancelButton");

    return {content, timeBlockSelectors, saveButton, cancelButton}
}


function populateSelectors(selectorElements, timeBlockData){
    
    selectorElements.timeBlockSelectors.forEach(function(selector){
        const primaryClass = Array.from(selector.classList)[0];

        const selectorNew = selectorBuilder.runBuildSelector(primaryClass);
        let selectedOption
        
        if(selectorNew.querySelector(`option[value = "${timeBlockData[primaryClass]}"]`) != null){
            selectedOption = selectorNew.querySelector(`option[value = "${timeBlockData[primaryClass]}"]`)
        }else{
            selectedOption = selectorNew.querySelector("option[value = 'default']");
            const errorText = createErrorText(timeBlockData[primaryClass]);
            selector.parentElement.appendChild(errorText);
        }
        
        selectedOption.selected = true;
        if(selectedOption.value != "default"){
            selector.firstChild.disabled = true;
        }

        selectorNew.addEventListener("change", publishSelectionValueChange);
        
        function publishSelectionValueChange(){
            const modifiedSelector = primaryClass
            const value = selector.value;
            events.publish("modifyAdminTimeBlockSelectorValue", {day: timeBlockData.day, _id: timeBlockData._id, modifiedSelector, value})
        }

        selector.replaceWith(selectorNew)
    })
}


function setEventListeners(selectorElements, timeBlockData){

    selectorElements.saveButton.addEventListener("click", updateTimeBlockData);
    selectorElements.cancelButton.addEventListener("click", cancelTimeBlockChanges);

    function updateTimeBlockData(){
        events.publish("updateFacilityDataClicked", timeBlockData);
    }
    function cancelTimeBlockChanges(){
        events.publish("cancelFacilityDataChangesClicked") //check this path
    }
}

function createErrorText(selectorSavedData){ //change this to li's appended to ul
    const errorText = document.createElement("p");
    errorText.innerText = `Your selected value of ${timeValueConverter.runConvertTotalMinutesToTime(selectorSavedData)} has been invalidated by a change to the opening/closing times for the facility. Speak with your supervisor to address this or change this value.`
    
    return errorText;
}

export {renderTimeBlockDataForm}
