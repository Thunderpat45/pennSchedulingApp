import { events } from "../../../../src/events";
import { selectorBuilder } from "../../../../src/selectorDOMBuilder"
import { timeValueConverter } from "../../../../src/timeConverter";


const availabilityTimeBlockDataFormComponent = (function(){

    events.subscribe('availabilityBlockAddRequested', renderTimeBlockDataForm);
    events.subscribe('availabilityBlockDataLoaded', renderTimeBlockDataForm);
    events.subscribe('availabilityDataChangesCancelled', unrenderTimeBlockDataForm);
    events.subscribe("renderAvailabilityBlockValidationErrors", renderAvailabilityBlockDataValidationErrors)
    events.subscribe("editAvailabilityBlockDataSaved", unrenderTimeBlockDataForm);
    events.subscribe('newAvailabilityBlockDataSaved', unrenderTimeBlockDataForm)

    const formDivWrapper = document.querySelector("#entryFormDiv")
    const formDiv = document.querySelector("#entryForm");
    

    function renderTimeBlockDataForm(timeBlockDayData){ 
    
        const elements = setElements();
        populateContent(elements, timeBlockDayData);
        setEventListeners(elements, timeBlockDayData);
    
        formDiv.appendChild(elements.content);

        const selectors = formDiv.querySelectorAll('.selector');
        const saveButton = formDiv.querySelector('#availabilityDayTimeBlockFormSaveButton')
        if(Array.from(selectors).filter(function(selector){
            return selector[selector.selectedIndex].value == "default"
        }).length > 0){
            saveButton.disabled = true;
        }
        formDivWrapper.classList.toggle("formHidden");
    } 

    function unrenderTimeBlockDataForm(){
        if(formDiv.firstChild){
            while(formDiv.firstChild){
                formDiv.removeChild(formDiv.firstChild)
            }
        }

        formDivWrapper.classList.add("formHidden");
    }
    
    
    function setElements(){
        const template = document.querySelector("#availabilityDayTimeBlockFormTemplate");
        const content = document.importNode(template.content, true);
    
        const dayLabel = content.querySelector('h3');
        const timeBlockSelectors = content.querySelectorAll(".selector");  
        const startDiv = content.querySelector("#availabilityDayTimeBlockSelectorsStart")
        const endDiv =   content.querySelector("#availabilityDayTimeBlockSelectorsEnd")              
        const saveButton = content.querySelector("#availabilityDayTimeBlockFormSaveButton");
        const cancelButton = content.querySelector("#availabilityDayTimeBlockFormCancelButton");
    
        return {content, dayLabel, timeBlockSelectors, saveButton, cancelButton, startDiv, endDiv}
    }
    
    function populateContent(selectorElements, timeBlockData){

        selectorElements.dayLabel.innerText = `Day: ${timeBlockData.timeBlock.day}`;

        selectorElements.timeBlockSelectors.forEach(function(selector){
            const primaryClass = Array.from(selector.classList)[0];
    
            const selectorNew = selectorBuilder.runBuildSelector(primaryClass);
            let selectedOption
            
            if(selectorNew.querySelector(`option[value = "${timeBlockData.timeBlock.availability[primaryClass]}"]`) != null){
                selectedOption = selectorNew.querySelector(`option[value = "${timeBlockData.timeBlock.availability[primaryClass]}"]`)
            }else{
                selectedOption = selectorNew.querySelector("option[value = 'default']");
                const errorText = createErrorText(timeBlockData.timeBlock.availability, primaryClass);
                if(primaryClass == "startTime"){
                    selectorElements.startDiv.appendChild(errorText)
                }else{
                    selectorElements.endDiv.appendChild(errorText)
                }
            }
            
            selectedOption.selected = true;
            if(selectedOption.value != "default"){
                selectorNew.firstChild.disabled = true;
            }
    
            selectorNew.addEventListener("change", publishSelectionValueChange);
            
            function publishSelectionValueChange(){
                const modifiedSelector = primaryClass
                let value
                if(primaryClass == 'startTime' || primaryClass == 'endTime'){
                    value = Number(selectorNew.value)
                }else{
                    value = selectorNew.value
                }
                events.publish("modifyAvailabilitySelectorValues", {modifiedSelector, value})

                const selectors = formDiv.querySelectorAll('.selector');
                const saveButton = formDiv.querySelector('#availabilityDayTimeBlockFormSaveButton')
                if(Array.from(selectors).filter(function(selector){
                    return selector[selector.selectedIndex].value == "default"
                }).length == 0){
                    saveButton.disabled = false;
                }
            }
    
            selector.replaceWith(selectorNew)
        })
    }
    
    function setEventListeners(selectorElements, timeBlockData){
    
        selectorElements.saveButton.addEventListener("click", updateTimeBlockData);
        selectorElements.cancelButton.addEventListener("click", cancelTimeBlockChanges);
    
        function updateTimeBlockData(){
            events.publish("updateAvailabilityClicked", timeBlockData.origin);
        }
        function cancelTimeBlockChanges(){
            events.publish("cancelAvailabilityBlockChangesClicked")
        }
    }
    
    function createErrorText(data, selector){
        const errorText = document.createElement("p");
        errorText.innerText = `Your selected value of ${timeValueConverter.runConvertTotalMinutesToTime(data[selector])} for ${selector} has been invalidated by a change to the opening/closing times for the facility. Speak with your supervisor to address this or change this value.`;
        return errorText;
    }

    function renderAvailabilityBlockDataValidationErrors(blockData){
        
        unrenderTimeBlockDataForm();
        renderTimeBlockDataForm(blockData);
        
        const errorList = document.querySelector("#availabilityDayTimeBlockGeneralErrorList");

        if(errorList.firstChild){
            while(errorList.firstChild){
                errorList.removeChild(errorList.firstChild)
            }
        }

        blockData.errors.forEach(function(error){
            const bullet = document.createElement("li");
            bullet.innerText = error;
            errorList.appendChild(bullet);
        })
    }
})()

export {availabilityTimeBlockDataFormComponent}