import {timeValueConverter} from "../../timeConverter";

function renderFacilityDataGrid(facilityData){
    const elements = setElements();
    setContent(elements, facilityData);
}

function setElements(){
    const openTimeText = document.querySelector("#adminMainPageFacilityHoursSelectorsOpen > p");
    const closeTimeText = document.querySelector("#adminMainPageFacilityHoursSelectorsOpen > p");
    const maxCapacityText = document.querySelector("#adminMainPageFacilityHoursSelectorsOpen > p");
    
    return {openTimeText, closeTimeText, maxCapacityText}
}

function setContent(facilityElements, facilityData){
    facilityElements.openTimeText = `Open: ${timeValueConverter.runConvertTotalMinutesToTime(facilityData.facilityOpen)}`; //make sure these property names are correct
    facilityElements.closeTimeText = `Close: ${timeValueConverter.runConvertTotalMinutesToTime(facilityData.facilityClose)}`
    facilityElements.openTimeText = `Open: ${facilityData.facilityMaxCapacity}`
}

export {renderFacilityDataGrid}
