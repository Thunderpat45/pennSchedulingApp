import {events} from "../src/events"
import {adminHomeRender} from "../src/adminHomePage/components/adminHomeRender"
import {facilityDataGrid} from "../src/adminHomePage/components/mainModulesRenders/facilityDataGrid"
import {facilityDataForm} from "../src/adminHomePage/components/forms/facilityDataForm";
import {facilityData} from "../src/adminHomePage/models/facilityData";
import {facilityDataValidator} from "../src/validators/facilityDataValidator"
import {databasePost} from "../src/databasePost"

window.onload = setScriptData;

async function setScriptData(){
    try{
        const adminPageJSON = await fetch('adminHome/adminData.json'); //change this to accept userId and season
        const adminPageData = await adminPageJSON.json();
        events.publish("adminDataFetched", adminPageData);
        events.publish("adminDataSet");
        
    }catch(err){
        console.log(err)
    }
}



// function setAdminTimeBlockListeners(){
//     const dayBlocks = Array.from(document.querySelector("#adminMainPageAddAvailabilityBlockAllUsersGrid").children);
//     dayBlocks.forEach(function(day){
//         const dayName = day.firstChild("h3").innerText;
//         const addButton = day.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockAddButton")

//         const timeBlocks = Array.from(day.querySelector(".adminMainPageAddAvailabilityBlockAllUsersAllBlocks"))
//         timeBlocks.forEach(function(block){
//             const _id = block.dataTimeBlockId;
//             const editButton = block.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockEditButton");
//             const deleteButton = block.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockDeleteButton");

//             editButton.addEventListener("click", requestAvailabilityBlockEdit);
//             deleteButton.addEventListener("click", requestAvailabilityBlockDelete);

//             function requestAvailabilityBlockEdit(){
//                 //class change?
//                 events.publish("editAdminAvailabilityClicked", {dayName, _id})
                
//             }
//             function requestAvailabilityBlockDelete(){
//                 events.publish("deleteAdminAvailabilityClicked", {dayName, _id})
//             }
//         })

//         addButton.addEventListener("click" , requestAvailabilityBlockNew);

//         function requestAvailabilityBlockNew(){
//             //class change?
//             events.publish("adminAvailabilityBlockAddRequested", day)

//         }
//     })     
// }  