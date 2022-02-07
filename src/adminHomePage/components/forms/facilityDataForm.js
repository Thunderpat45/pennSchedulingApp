//ADMIN FACILITY DATA FORM
import { events } from "../../../events";
import { selectorBuilder } from "../../../DOMBuilders/selectorDOMBuilder"


//add events to listen for button to do this
function renderFacilityDataForm(facilityData){
    const formDiv = document.querySelector("#entryForm")

    const elements = setElements();
    populateSelectors(elements, facilityData);
    setEventListeners(elements);

    if(formDiv.firstChild){
        while(formDiv.firstChild){
            formDiv.remove(formDiv.firstChild)
        }
    }

    formDiv.appendChild(elements.content);
} 


function setElements(){
    const template = document.querySelector("#adminFacilityDataFormTemplate");
    const content = document.importNode(template.content, true);

    const facilitySelectors = content.querySelectorAll(".selector");                  
    const saveButton = content.querySelector("#adminMainPageFacilitySelectorsSaveButton");
    const cancelButton = content.querySelector("#adminMainPageFacilitySelectorsCancelButton");

    return {content, facilitySelectors, saveButton, cancelButton}
}


function populateSelectors(selectorElements, facilityData){
    
    selectorElements.facilitySelectors.forEach(function(selector){
        const primaryClass = Array.from(selector.classList)[0];

        const selectorNew = selectorBuilder.runBuildSelector(primaryClass);
        
        const selectedOption = selectorNew.querySelector(`option[value = "${facilityData[primaryClass]}"]`);
        selectedOption.selected = true;
        if(selectedOption.value != "default"){
            selector.firstChild.disabled = true;
        }

        selectorNew.addEventListener("change", publishSelectionValueChange);
        
        function publishSelectionValueChange(){
            const modifiedSelector = primaryClass
            const value = selector.value;
            events.publish("modifyFacilitySelectorValue", {modifiedSelector, value})
        }

        selector.replaceWith(selectorNew)
    })
}


function setEventListeners(selectorElements){

    selectorElements.saveButton.addEventListener("click", updateFacilityData);
    selectorElements.cancelButton.addEventListener("click", cancelFacilityDataChanges);

    function updateFacilityData(){
        events.publish("updateFacilityDataClicked");
    }
    function cancelFacilityDataChanges(){
        events.publish("cancelFacilityDataChangesClicked") //check this path
    }
}

export {renderFacilityDataForm}





