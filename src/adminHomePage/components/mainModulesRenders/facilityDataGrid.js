import {events} from "../../../../src/events";
import {timeValueConverter} from "../../../timeConverter";

const facilityDataGridComponent = (function(){

    events.subscribe("renderUpdatedFacilityData", renderFacilityDataGrid); //add prompt about successful save

    function renderFacilityDataGrid(facilityData){
        const elements = setElements();
        setContent(elements, facilityData);
    }

    function setElements(){
        const main = document.querySelector("#facilityDataGrid")
        const openTimeText = document.querySelector("#adminMainPageFacilityHoursSelectorsOpen > p");
        const closeTimeText = document.querySelector("#adminMainPageFacilityHoursSelectorsClose > p");
        const maxCapacityText = document.querySelector("#adminMainPageFacilityCapacitySelectorsMax > p");
        
        return {main, openTimeText, closeTimeText, maxCapacityText}
    }

    function setContent(facilityElements, facilityData){
        facilityElements.main.dataset.facilityDataId = facilityData._id;
        facilityElements.openTimeText.innerText = `Open Time: ${timeValueConverter.runConvertTotalMinutesToTime(facilityData.facilityOpen)}`; //adjust the semi-colon distance for these in original render
        facilityElements.closeTimeText.innerText = `Close Time: ${timeValueConverter.runConvertTotalMinutesToTime(facilityData.facilityClose)}`
        facilityElements.maxCapacityText.innerText = `Max Capacity: ${facilityData.facilityMaxCapacity}`
    }
})()

export {facilityDataGridComponent}
