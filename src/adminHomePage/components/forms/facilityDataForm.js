import { events } from "../../../../src/events";
import { selectorBuilder } from "../../../DOMBuilders/selectorDOMBuilder"

const facilityDataFormComponent = (function(){

    events.subscribe("adminFacilityDataEditRequested", renderFacilityDataForm);
    events.subscribe("adminFacilityDataChangesCancelled", unrenderFacilityDataForm);
    events.subscribe("facilityDataSaved", unrenderFacilityDataForm)
    
    const formDivWrapper = document.querySelector("#entryFormDiv")
    const formDiv = document.querySelector("#entryForm")


    function renderFacilityDataForm(facilityData){
        
        const elements = setElements();
        populateSelectors(elements, facilityData);
        setEventListeners(elements);

        formDiv.appendChild(elements.content);
        formDivWrapper.classList.toggle("formHidden");
    } 


    function unrenderFacilityDataForm(){
        if(formDiv.firstChild){
            while(formDiv.firstChild){
                formDiv.removeChild(formDiv.firstChild)
            }
        }

        formDivWrapper.classList.toggle("formHidden");
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
                selectorNew.firstChild.disabled = true;
            }

            selectorNew.addEventListener("change", publishSelectionValueChange);
            
            function publishSelectionValueChange(){
                const modifiedSelector = primaryClass
                const value = selectorNew.value;
                events.publish("modifyFacilitySelectorValue", {modifiedSelector, value})
            }

            selector.replaceWith(selectorNew)
        })
    }


    function setEventListeners(selectorElements){

        selectorElements.saveButton.addEventListener("click", updateFacilityData);
        selectorElements.cancelButton.addEventListener("click", cancelFacilityDataChanges);

        function updateFacilityData(){
            const confirmation = confirm("Changing facility settings from a longer to a shorter day can create bugs if other users are not informed to adjust. Please speak to other users to notify them of changes before running the schedule builder. Continue?")
            if(confirmation){
                events.publish("updateFacilityDataClicked");
            }else{
                events.publish("cancelFacilityDataChangesClicked")
            }
           
        }
        function cancelFacilityDataChanges(){
            events.publish("cancelFacilityDataChangesClicked") //check this path
        }
    }
})()

export {facilityDataFormComponent}





