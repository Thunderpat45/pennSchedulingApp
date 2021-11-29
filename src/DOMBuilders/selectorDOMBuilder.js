import {events} from "../events"
import {timeValueConverter} from "../timeConverter"
/*

actions: creates and populates reusable select DOM elements for various pages

publishes:
    select DOM elements

subscribes:
    initial selector option ranges/arrays

*/



const selectorBuilder = (function(){ 


    const selectionOptions = { //source this into userSchedObj, need all selectors?
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
        facilityOpen:{ //range 4am to 9pm, default value here 6am (360)?
            start: 240,
            end: 1260,
            increment: 15
        },
        facilityClose:{ //range 4am to 9pm, default value here 8pm (1200)?
            start: 240,
            end: 1260,
            increment: 15
        },
        facilityMaxCapacity:{//range 10-150, default value here 120?
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

    function setSelectionOptions(model){
        selectionOptions.startTime.start = model.facilityOpen;
        selectionOptions.endTime.start = model.facilityOpen;
        selectionOptions.startTime.end = model.facilityClose;
        selectionOptions.endTime.end = model.facilityClose;
        selectionOptions.teamSize.end = model.facilityMaxCapacity;
        
        for(let option in selectionOptions){
            selectors[option] = buildSelector(option);
        }
    }

    function setAdminSelectionOptions(model){
        setSelectionOptions(model);
        events.publish("adminSelectorsBuilt", selectors) //change appropriate instances in other DOM generators
    }

    function setUserSelectionOptions(model){
        setSelectionOptions(model);
        events.publish("userSelectorsBuilt", selectors) //change appropriate instances in other DOM generators
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
                addEventListener("change", function modifyTeamSizeValue(){
                    const value = selection.value 
                    events.publish("modifyTeamSizeValue", value)
                });
                break;
            
            case "endTime":
            case "facilityOpen":
            case "facilityClose":
            case "facilityMaxCapacity":
                buildRangeSelectorOptions(primaryClass, selection);
                break;
            
            case "startTime":
                buildRangeSelectorOptions(primaryClass, selection);
                selection.addEventListener("change", modifyEndTimeDefaultValue);
                break;
        }

        selection.addEventListener("change", disableDefaultOption) 
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
                option.innerHTML = timeValueConverter.runConvertTotalMinutesToTime(i).toString();
            }selector.appendChild(option);
        }
    }

    
})();

export{selectorBuilder}
