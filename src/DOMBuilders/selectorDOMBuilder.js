import {events} from "../events"
import {timeValueConverter} from "../timeConverter"
/*

purpose: creates and populates reusable select DOM elements for various pages

facilitySelector object format is as such:

obj = {
    facilityOpen,
    facilityClose,
    facilityMaxCapacity
}

publishes:
    selection DOM elements FOR multiple DOM modules

subscribes:
    admin facilitySelector data FROM adminMainPageModel
    user facilitySelector data FROM mainPageModel

*/

const selectorBuilder = (function(){ 

    //default values must be input (into database?) for facilityOpen/Close/MaxCapacity BEFORE first time running, or startTime/endTime/teamSize will have errors!
    const selectionOptions = { 
        startTime: {
            start: null,
            end: null,
            increment: 15
        },
        endTime: {
            start: null,
            end: null,
            increment: 15
        },
        teamSize: {
            start: 5,
            end: null,
            increment: 5
        },
        facilityOpen:{ //4am to 8pm, default value 6am (360)?
            start: 240,
            end: 1200,
            increment: 15
        },
        facilityClose:{ //5am to 9pm, default value 8pm (1200)?
            start: 300,
            end: 1260,
            increment: 15
        },
        facilityMaxCapacity:{//range 10-150, default value 120?
            start: 10,
            end: 150,
            increment: 5
        },
        dayOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], 
        inWeiss: ["yes", "no"],
    };

    const selectors = {}
    
    events.subscribe("adminSelectorsRequested", setAdminSelectionOptions);
    events.subscribe("mainPageSelectorsRequested", setUserSelectionOptions); 

    function setAdminSelectionOptions(selectorsModel){
        setSelectionOptions(selectorsModel);
        events.publish("adminSelectorsBuilt", selectors) 
    }

    function setUserSelectionOptions(selectorsModel){
        setSelectionOptions(selectorsModel);
        events.publish("userSelectorsBuilt", selectors) 
    }

    function setSelectionOptions(selectorsModel){
        selectionOptions.startTime.start = selectorsModel.facilityOpen;
        selectionOptions.endTime.start = selectorsModel.facilityOpen + 30;
        selectionOptions.startTime.end = selectorsModel.facilityClose - 30;
        selectionOptions.endTime.end = selectorsModel.facilityClose;
        selectionOptions.teamSize.end = selectorsModel.facilityMaxCapacity;
        
        for(let option in selectionOptions){
            selectors[option] = buildSelector(option);
        }
    }

    function buildSelector(primaryClass){
        const selection = document.createElement("select");
        selection.classList.add(primaryClass);
        selection.classList.add("selector");
            const defaultOption = document.createElement("option");
            defaultOption.value = "default";
            defaultOption.innerHTML = "--";
        selection.appendChild(defaultOption);

        switch(primaryClass){
            case "dayOfWeek":
            case "inWeiss": 
                buildArraySelectorOptions(primaryClass, selection);
                break;
            
            case "teamSize":
                buildRangeSelectorOptions(primaryClass, selection);
                selection.addEventListener("change", function modifyTeamSizeValue(){
                    const value = selection.value 
                    events.publish("modifyTeamSizeValue", value)
                });
                break;   
            case "endTime":
            case "facilityClose":
            case "facilityMaxCapacity":
                buildRangeSelectorOptions(primaryClass, selection);
                break;
            
            case "startTime":
            case "facilityOpen":
                buildRangeSelectorOptions(primaryClass, selection);
                selection.addEventListener("change", modifyEndTimeDefaultValue);
                break;
        }

        selection.addEventListener("change", disableDefaultOption) 
        selection.addEventListener("blur", preventEmptySelectors)
    }

    function buildArraySelectorOptions(primaryClass, selector){
        const optionValues = selectionOptions[primaryClass];
        optionValues.forEach(function(optionValue){
            const option = document.createElement("option");
            option.value = optionValue;
            option.innerHTML = optionValue;
            selector.appendChild(option); 
        })
    }

    function buildRangeSelectorOptions(primaryClass, selector){
        const optionValues = selectionOptions[primaryClass];
        for(let i = optionValues.start; i<optionValues.end; i += optionValues.increment){
            const option = document.createElement("option");
            option.value = i;
            if(primaryClass == "teamSize" || primaryClass == "facilityMaxCapacity"){
                option.innerHTML = i;
            }else{
                option.innerHTML = timeValueConverter.runConvertTotalMinutesToTime(i); //toString() should not be necessary
            }selector.appendChild(option);
        }
    }

    function disableDefaultOption(){
        const values = Array.from(this.children);
        values[0].disabled = true;
    }

    function modifyEndTimeDefaultValue(){
        const startTimeSelectedValue = Number(this.value);
        const endTimeValuesArray = Array.from(this.parentElement.nextElementSibling.lastElementChild.children);
        endTimeValuesArray.forEach(function(time){
            const endTimeValue = Number(time.value);
            if(endTimeValue < startTimeSelectedValue + 30 || endTimeValue == "default"){
                time.disabled = true;
            }else{
                time.disabled = false;
            }
            if(endTimeValue == startTimeSelectedValue + 60){
                time.selected = true;
            }else{
                time.selected = false;
            }
        })
    }

    function preventEmptySelectors(){
        if(this.value == "default"){
            const className = Array.from(this.classList)[0];
            alert(`A non-default value must be selected for ${className}`);
            this.focus();
        }
    }

})();

export{selectorBuilder}
