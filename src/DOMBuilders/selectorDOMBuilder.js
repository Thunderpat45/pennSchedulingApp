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


    const selectionOptions = { //source this into userSchedObj
        startTime: null,
        endTime: null,
        teamSize: null,
        dayOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], 
        inWeiss: ["yes", "no"],
    };

    events.subscribe("SOMETHINGABOUTSELECTIONOPTIONSLOADED", setSelectionOptions); //edit, from userSchedObj

    function setSelectionOptions(MONGODBSTUFF){ //needs updating to source from userSchedObj
        selectionOptions.startTime = MONGODBSTUFF.startTime;
        selectionOptions.endTime = MONGODBSTUFF.endTime;
        selectionOptions.teamSize = MONGODBSTUFF.teamSize;
        
        for(let option in selectionOptions){
            const selection = buildSelector(option);
            events.publish("selectorBuilt", option, selection);
        }
    }

//figure out how to load selection options/all teams from DB on page load; move this question to userSchedObj
//subscribe?, window eventListener?;
//local storage to maintain data on DOM after refresh?
   
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
            if(primaryClass == "teamSize"){
                option.innerHTML = i;
            }else{
                option.innerHTML = timeValueConverter.runConvertTotalMinutesToTime(i).toString();
            }selector.appendChild(option);
        }
    }

    
})();

export{selectorBuilder}
