import { events } from "../../../../src/events";
import { selectorBuilder } from "../../../../src/selectorDOMBuilder"
import { timeValueConverter } from "../../../../src/timeConverter";

const adminTimeBlockDataFormComponent = (function(){

    events.subscribe('adminAvailabilityBlockAddRequested', renderTimeBlockDataForm);
    events.subscribe('adminBlockDataLoaded', renderTimeBlockDataForm);
    events.subscribe('adminAvailabilityDataChangesCancelled', unrenderTimeBlockDataForm);
    events.subscribe("renderAdminBlockValidationErrors", renderAdminBlockDataValidationErrors)
    events.subscribe("editAdminBlockDataSaved", unrenderTimeBlockDataForm);
    events.subscribe('newAdminBlockDataSaved', unrenderTimeBlockDataForm)

    const body = document.querySelector('body')
    const adminMainPage = document.querySelector('#adminMainPage')
    const formDivWrapper = document.querySelector("#entryFormDiv")
    const formDiv = document.querySelector("#entryForm");
    const overlayDiv = document.createElement('div');
    overlayDiv.id = 'overlayDiv'
    

    function renderTimeBlockDataForm(adminTimeBlockDayData){
        
        const elements = setElements();
        populateContent(elements, adminTimeBlockDayData);
        setEventListeners(elements, adminTimeBlockDayData);
    
        formDiv.appendChild(elements.content);

        const selectors = formDiv.querySelectorAll('.selector');
        const saveButton = formDiv.querySelector('#adminDayTimeBlockFormSaveButton')
        if(Array.from(selectors).filter(function(selector){
            return selector[selector.selectedIndex].value == "default"
        }).length > 0){
            saveButton.disabled = true;
        }

        adminMainPage.appendChild(overlayDiv)
        overlayDiv.appendChild(formDivWrapper)

        formDivWrapper.classList.toggle("formHidden");
        body.style.overflowY = 'hidden'
    } 

    function unrenderTimeBlockDataForm(){
        if(formDiv.firstChild){
            while(formDiv.firstChild){
                formDiv.removeChild(formDiv.firstChild)
            }
        }

        formDivWrapper.classList.toggle("formHidden");
        overlayDiv.replaceWith(...overlayDiv.childNodes)
        body.style.overflowY = 'scroll'
    }
    
    
    function setElements(){
        const template = document.querySelector("#adminDayTimeBlockFormTemplate");
        const content = document.importNode(template.content, true);
    
        const dayLabel = content.querySelector('h3');
        const timeBlockSelectors = content.querySelectorAll(".selector");  
        const startDiv = content.querySelector("#adminDayTimeBlockSelectorsStart")
        const endDiv =   content.querySelector("#adminDayTimeBlockSelectorsEnd")              
        const saveButton = content.querySelector("#adminDayTimeBlockFormSaveButton");
        const cancelButton = content.querySelector("#adminDayTimeBlockFormCancelButton");
    
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
                events.publish("modifyAdminTimeBlockSelectorValue", {modifiedSelector, value})

                const selectors = formDiv.querySelectorAll('.selector');
                const saveButton = formDiv.querySelector('#adminDayTimeBlockFormSaveButton')
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
            events.publish("updateAdminBlockClicked", timeBlockData.origin);
        }
        function cancelTimeBlockChanges(){
            events.publish("cancelAdminBlockChangesClicked")
        }
    }
    
    function createErrorText(data, selector){
        const errorText = document.createElement("p");
        errorText.innerText = `Your selected value of ${timeValueConverter.runConvertTotalMinutesToTime(data[selector])} for ${selector} has been invalidated by a change to the opening/closing times for the facility. Speak with your supervisor to address this or change this value.`;
        return errorText;
    }

    function renderAdminBlockDataValidationErrors(blockData){
        
        unrenderTimeBlockDataForm();
        renderTimeBlockDataForm(blockData);
        
        const errorList = document.querySelector("#adminDayTimeBlockGeneralErrorList");

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

export {adminTimeBlockDataFormComponent}

