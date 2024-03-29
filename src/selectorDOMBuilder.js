import {events} from "./events"
import {timeValueConverter} from "./timeConverter"

const selectorBuilder = (function(){ 

    const selectionRanges = { 
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
        facilityOpen:{ //4am to 8pm, default value 6am (360)
            start: 240,
            end: 1200,
            increment: 15
        },
        facilityClose:{ //5am to 9pm, default value 8pm (1200)
            start: 300,
            end: 1260,
            increment: 15
        },
        facilityMaxCapacity:{//range 10-150, default value 120
            start: 10,
            end: 150,
            increment: 5
        },
        dayOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], 
        inWeiss: ["yes", "no"],
    };
    
    events.subscribe("adminDataFetched", setSelectorRanges);
    events.subscribe('userDataFetched', setSelectorRanges)
    events.subscribe('setNewSelectorRanges', setSelectorRanges)
    
    function setSelectorRanges(dBdata){
        let facilityData
        if(Object.prototype.hasOwnProperty.call(dBdata, 'facilityData')){
            facilityData = dBdata.facilityData
        }else{
            facilityData = dBdata
        }
        selectionRanges.startTime.start = facilityData.facilityOpen;
        selectionRanges.endTime.start = facilityData.facilityOpen + 30;
        selectionRanges.startTime.end = facilityData.facilityClose - 30;
        selectionRanges.endTime.end = facilityData.facilityClose;
        selectionRanges.teamSize.end = facilityData.facilityMaxCapacity;
    }

    function runBuildSelector(primaryClass){
        return buildSelector(primaryClass)
    }

    function buildSelector(primaryClass){
        const selection = document.createElement("select");
        selection.classList.add(primaryClass);
        selection.classList.add("selector");
            const defaultOption = document.createElement("option");
            defaultOption.value = "default";
            defaultOption.innerText = "--";
        selection.appendChild(defaultOption);

        switch(primaryClass){
            case "dayOfWeek":
            case "inWeiss": 
                buildArraySelectorOptions(primaryClass, selection);
                break;
            
            case "teamSize":
                buildRangeSelectorOptions(primaryClass, selection);
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

        return selection
    }

    function buildArraySelectorOptions(primaryClass, selector){
        const optionValues = selectionRanges[primaryClass];
        optionValues.forEach(function(optionValue){
            const option = document.createElement("option");
            option.value = optionValue;
            option.innerText = optionValue;
            selector.appendChild(option); 
        })
    }

    function buildRangeSelectorOptions(primaryClass, selector){
        const optionValues = selectionRanges[primaryClass];
        for(let i = optionValues.start; i<=optionValues.end; i += optionValues.increment){
            const option = document.createElement("option");
            option.value = i;
            if(primaryClass == "teamSize" || primaryClass == "facilityMaxCapacity"){
                option.innerText = i;
            }else{
                option.innerText = timeValueConverter.runConvertTotalMinutesToTime(i);
            }selector.appendChild(option);
        }
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
        })
    }

    function disableDefaultOption(){
        const values = Array.from(this.children);
        values[0].disabled = true;
    }

    return {runBuildSelector}

})();

export{selectorBuilder}
