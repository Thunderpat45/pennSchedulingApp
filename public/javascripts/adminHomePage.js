/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/DOMBuilders/selectorDOMBuilder.js":
/*!***********************************************!*\
  !*** ./src/DOMBuilders/selectorDOMBuilder.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "selectorBuilder": () => (/* binding */ selectorBuilder)
/* harmony export */ });
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../events */ "./src/events.js");
/* harmony import */ var _timeConverter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../timeConverter */ "./src/timeConverter.js");



const selectorBuilder = (function(){ 

    //default values must be input (into database?) for facilityOpen/Close/MaxCapacity BEFORE first time running, or startTime/endTime/teamSize will have errors!
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
    
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("SOME DATA BASE FETCH FIX THIS FIX THIS", setSelectorRanges);
    

    //call this after dbFetch
    function setSelectorRanges(databaseRanges){
        selectionRanges.startTime.start = databaseRanges.facilityOpen;
        selectionRanges.endTime.start = databaseRanges.facilityOpen + 30;
        selectionRanges.startTime.end = databaseRanges.facilityClose - 30;
        selectionRanges.endTime.end = databaseRanges.facilityClose;
        selectionRanges.teamSize.end = databaseRanges.facilityMaxCapacity;
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
                option.innerText = _timeConverter__WEBPACK_IMPORTED_MODULE_1__.timeValueConverter.runConvertTotalMinutesToTime(i); //toString() should not be necessary
            }selector.appendChild(option);
        }
    }

        //these are all not working, may need to use event delegation within the modules themselves

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

    function disableDefaultOption(){ //these are all not working, may need to use event delegation within the modules themselves
        const values = Array.from(this.children);
        values[0].disabled = true;
    }

    return {runBuildSelector}

})();




/***/ }),

/***/ "./src/adminHomePage/components/adminHomeRender.js":
/*!*********************************************************!*\
  !*** ./src/adminHomePage/components/adminHomeRender.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "adminHomeMain": () => (/* binding */ adminHomeMain)
/* harmony export */ });
/* harmony import */ var _src_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../src/events */ "./src/events.js");


// import {adminTeams} from "./components/teamGrid";
// import {adminUsers} from "./components/userGrid";

/*action: admin interface for observing allTeams/allUsers, setting facility parameters, blocking off time for all users, and running the scheduling function

adminMainPageData object is modeled as such:

obj = {
    allTeams: 
        [{ 
            teamName,
            teamSize, 
            rank:
                {
                    myTeams,
                    allTeams
                },
            allOpts: [[{dayOfWeek, startTime, endTime, inWeiss}, {etc}], [{etc}, {etc}], []],
            coach,
        }, {etc}, {etc}]

    allUsers:
        [{
            name,
            color,
            password, //MAKE SURE THIS DOES NOT GET PASSED TO FRONT END
            privilegeLevel,
            teams:{},
            availability:{},
            lastVerified
        }, {etc}, {etc}]

    facilitySelectors:
        {facilityOpen, facilityClose, facilityMaxCapacity}

    adminTimeBlocks:
        {day: [{{startTime, stopTime, admin}, {startTime, stopTime, admin}, ], day: [{startTime, stopTime, admin}, {startTime, stopTime, admin}]},  make sure empties don't screw anything up

    season,
}

adminSelectorsObj is modeled as such:

obj = {

    startTime: (pre-built select HTML element),
    endTime: etc,
    teamSize: etc,
    facilityOpen: etc,
    facilityClose: etc,
    facilityMaxCapacity: etc,
    dayOfWeek: etc,
    inWeiss: etc
}

publishes:
    page render requests FOR pageRenderer
    season change requests FOR (?)
    scheduler run requests FOR (?)
    admin allTeam rank changes FOR adminAllTeamsDataModel
    user add requests FOR adminUserGeneratorModel 
    user edit/delete requests for adminAllUsersDataModel
    facilityData changes, save requests, and change cancellations FOR adminMainPageFacilityDataModel
    

subscribes to: 
    adminMainPageModel builds FROM adminMainPageModel
    adminSelectorsBuilt FROM selectorDOMBuilder
    adminAvailability and adminFacility model updates FROM adminAvailabity and adminFacility data models
*/

const adminHomeMain = (function(){

    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("adminDataSet", setAdminEventListeners); //some prompt about setting data in client models

    function setAdminEventListeners(){
        setFacilityDataListeners()
    }

    function setFacilityDataListeners(){
        const facilityEditButton = document.querySelector("#adminMainPageFacilitySelectorsEditButton");
        facilityEditButton.addEventListener("click", requestAdminDataEdit);
    
        function requestAdminDataEdit(){
            _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("editFacilityDataClicked");
        }
    
    
    }





//     events.subscribe("", renderAdminTimeBlocksForm) //add listener for render click

//     function renderAdminTimeBlocksForm(adminTimeBlockDayData){
//         renderTimeBlockDataForm(adminTimeBlockDayData);
//     }

//     function setAdminTimeBlockListeners(){
//         const dayBlocks = Array.from(document.querySelector("#adminMainPageAddAvailabilityBlockAllUsersGrid").children);
//         dayBlocks.forEach(function(day){
//             const dayName = day.firstChild("h3").innerText;
//             const addButton = day.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockAddButton")

//             const timeBlocks = Array.from(day.querySelector(".adminMainPageAddAvailabilityBlockAllUsersAllBlocks"))
//             timeBlocks.forEach(function(block){
//                 const _id = block.dataset.dataTimeBlockId;
//                 const editButton = block.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockEditButton");
//                 const deleteButton = block.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockDeleteButton");

//                 editButton.addEventListener("click", requestAvailabilityBlockEdit);
//                 deleteButton.addEventListener("click", requestAvailabilityBlockDelete);

//                 function requestAvailabilityBlockEdit(){
//                     //class change?
//                     events.publish("editAdminAvailabilityClicked", {day, _id})
                    
//                 }
//                 function requestAvailabilityBlockDelete(){
//                     events.publish("deleteAdminAvailabilityClicked", {day, _id})
//                 }
//             })

//             addButton.addEventListener("click" , requestAvailabilityBlockNew);

//             function requestAvailabilityBlockNew(){
//                 //class change?
//                 events.publish("adminAvailabilityBlockAddRequested", day)

//             }
//         })     
//     }  
})()



  // let season //?
    
    // events.subscribe("adminMainPageModelBuilt", setSeason)
    // events.subscribe("adminMainPageModelBuilt", ANOTHERFUNCTIONHERE?);
    // events.subscribe("adminAvailabilityModelModified", renderAdminAllTimeBlocks);
    // events.subscribe("adminFacilityModelModified", renderFacilityDataGrid)
    
    // function setSeason(adminMainPageData){
    //     season = adminMainPageData.season
    // }

    // function changeSeason(){
            
    // }

    // function runScheduler(){
    //     events.publish("runSchedulerRequested") 
    // }

    // //find subscribers to changeSeasons and runScheduler, issue NOT TO BE ADDRESSED:  scheduler could be run with unsaved modifications to adminAvail and facilityData
    // function buildAdminMainPageDOM(adminMainPageData){
       
        
    
     
        
    //     const adminFacilityData = content.querySelector("#facilityDataGridContainer");
    //     const adminAddTimeBlock = content.querySelector("#setAllUsersAvailabilityGridContainer");
        
    
    //     const adminAllUsersNew = renderAdminAllUsersGrid(adminAllUsers, adminMainPageData.allUsers);
    //     const adminFacilityDataNew = renderFacilityDataGrid({adminFacilityDataContainer: adminFacilityData, adminMainPageData: adminMainPageData.facilitySelectors, pageRenderOrigin: "template"});
    //     const adminAddTimeBlockNew = renderAdminTimeBlocker({adminTimeBlockDiv: adminAddTimeBlock, adminMainPageData: adminMainPageData.adminTimeBlocks, pageRenderOrigin: "template"});
    
    //     adminAllUsers.replaceWith(adminAllUsersNew); 
    //     adminFacilityData.replaceWith(adminFacilityDataNew);
    //     adminAddTimeBlock.replaceWith(adminAddTimeBlockNew);
    
    //     seasonButtons.forEach(function(button){
    //         if(!button.disabled){
    //             button.addEventListener("click", changeSeason)
    //         }else{
                
               
    //         }
    //     })

    //     schedulerButton.addEventListener("click", runScheduler)   
    // }

    // function setElements(){
        
        
    //     const seasonButtons = Array.from(content.querySelectorAll("#adminSeasonButtons > button"));
    //     const schedulerButton = content.querySelector("#runScheduleBuilderButton");
    // }

/***/ }),

/***/ "./src/adminHomePage/components/forms/facilityDataForm.js":
/*!****************************************************************!*\
  !*** ./src/adminHomePage/components/forms/facilityDataForm.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "facilityDataFormComponent": () => (/* binding */ facilityDataFormComponent)
/* harmony export */ });
/* harmony import */ var _src_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../src/events */ "./src/events.js");
/* harmony import */ var _DOMBuilders_selectorDOMBuilder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../DOMBuilders/selectorDOMBuilder */ "./src/DOMBuilders/selectorDOMBuilder.js");



const facilityDataFormComponent = (function(){

    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("adminFacilityDataEditRequested", renderFacilityDataForm);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("adminFacilityDataChangesCancelled", unrenderFacilityDataForm);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("facilityDataSaved", unrenderFacilityDataForm)
    
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

            const selectorNew = _DOMBuilders_selectorDOMBuilder__WEBPACK_IMPORTED_MODULE_1__.selectorBuilder.runBuildSelector(primaryClass);
            
            const selectedOption = selectorNew.querySelector(`option[value = "${facilityData[primaryClass]}"]`);
            selectedOption.selected = true;
            if(selectedOption.value != "default"){
                selectorNew.firstChild.disabled = true;
            }

            selectorNew.addEventListener("change", publishSelectionValueChange);
            
            function publishSelectionValueChange(){
                const modifiedSelector = primaryClass
                const value = selectorNew.value;
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("modifyFacilitySelectorValue", {modifiedSelector, value})
            }

            selector.replaceWith(selectorNew)
        })
    }


    function setEventListeners(selectorElements){

        selectorElements.saveButton.addEventListener("click", updateFacilityData);
        selectorElements.cancelButton.addEventListener("click", cancelFacilityDataChanges);

        function updateFacilityData(){
            _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("updateFacilityDataClicked");
        }
        function cancelFacilityDataChanges(){
            _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("cancelFacilityDataChangesClicked") //check this path
        }
    }
})()









/***/ }),

/***/ "./src/adminHomePage/components/mainModulesRenders/facilityDataGrid.js":
/*!*****************************************************************************!*\
  !*** ./src/adminHomePage/components/mainModulesRenders/facilityDataGrid.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "facilityDataGrid": () => (/* binding */ facilityDataGrid)
/* harmony export */ });
/* harmony import */ var _src_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../src/events */ "./src/events.js");
/* harmony import */ var _timeConverter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../timeConverter */ "./src/timeConverter.js");



const facilityDataGrid = (function(){

    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("renderUpdatedFacilityData", renderFacilityDataGrid); //add prompt about successful save

    function renderFacilityDataGrid(facilityData){
        const elements = setElements();
        setContent(elements, facilityData);
    }

    function setElements(){
        const main = document.querySelector("#facilityDataGrid")
        const openTimeText = document.querySelector("#adminMainPageFacilityHoursSelectorsOpen > p");
        const closeTimeText = document.querySelector("#adminMainPageFacilityHoursSelectorsClose > p");
        const maxCapacityText = document.querySelector("#adminMainPageFacilityHoursSelectorsMax > p");
        
        return {main, openTimeText, closeTimeText, maxCapacityText}
    }

    function setContent(facilityElements, facilityData){
        facilityElements.main.dataset.facilityDataId = facilityData._id;
        facilityElements.openTimeText.innerText = `Open Time: ${_timeConverter__WEBPACK_IMPORTED_MODULE_1__.timeValueConverter.runConvertTotalMinutesToTime(facilityData.facilityOpen)}`; //make sure these property names are correct
        facilityElements.closeTimeText.innerText = `Close Time: ${_timeConverter__WEBPACK_IMPORTED_MODULE_1__.timeValueConverter.runConvertTotalMinutesToTime(facilityData.facilityClose)}`
        facilityElements.maxCapacityText.innerText = `Max Capacity: ${facilityData.facilityMaxCapacity}`
    }
})()




/***/ }),

/***/ "./src/adminHomePage/models/facilityData.js":
/*!**************************************************!*\
  !*** ./src/adminHomePage/models/facilityData.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "adminMainPageFacilityDataModel": () => (/* binding */ adminMainPageFacilityDataModel)
/* harmony export */ });
/* harmony import */ var _src_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../src/events */ "./src/events.js");


/*purpose: dataModel for modifying/saving facilityData content for adminMainPage

database object is modeled as such:

obj = {
    facilityOpen, 
    facilityClose, 
    facilityMaxCapacity
}

publishes:
    facilityDataDOM renders FOR adminMainPageDOM
    save requests FOR databse
   
subscribes to: 
    adminMainPageModel builds FROM adminMainPageModel
    data modification changes FROM adminMainPageDOM
    save change and cancel change requests FROM adminMainPageDOM
*/


//start EDITING HERE, I WANT FACILITYDATA TO BE CONNECTED BY THE END OF TONIGHT!
const adminMainPageFacilityDataModel = (function(){
    //no obvious issues, find database listener for data update
    let adminFacilityDataStable;
    let adminFacilityDataMutable;

    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("hibbilty", console.log("Does this end it?"))
    
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("adminDataFetched", setDataNewPageRender);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("facilityDataSaved", setDataNewDatabasePost); //add prompt about successful post
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("editFacilityDataClicked", editFacilityData) //add prompt about requesting dataEdit

    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("modifyFacilitySelectorValue", modifyFacilitySelectorValue);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("updateFacilityDataClicked", validateFacilityData);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("adminFacilityDataValidated", updateFacilityData);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("cancelFacilityDataChangesClicked", cancelFacilityDataChanges);

    function setDataNewPageRender(adminData){
        adminFacilityDataStable = adminData.facilityData; //make sure this is correct property for database initial database fetch
        adminFacilityDataMutable = Object.create({});
        for(let prop in adminFacilityDataStable){
            adminFacilityDataMutable[prop] = adminFacilityDataStable[prop]
        }
    }

    function setDataNewDatabasePost(){
        createFacilityDataDeepCopy(adminFacilityDataStable, adminFacilityDataMutable);
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("renderUpdatedFacilityData", adminFacilityDataMutable)
    }

    function createFacilityDataDeepCopy(newObj, copyObj){
        for(let prop in copyObj){
            newObj[prop] = copyObj[prop]
        }
    }

    function editFacilityData(){
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("adminFacilityDataEditRequested", adminFacilityDataMutable)
    }

    function modifyFacilitySelectorValue(facilityDataObj){
        const {modifiedSelector, value} = facilityDataObj
        adminFacilityDataMutable[modifiedSelector] = Number(value);
    }

    function validateFacilityData(){
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("adminFacilityDataValidationRequested", adminFacilityDataMutable)
    }

    function updateFacilityData(){
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("adminFacilityDataUpdateRequested", adminFacilityDataMutable);
    }
    
    function cancelFacilityDataChanges(){
        createFacilityDataDeepCopy(adminFacilityDataMutable, adminFacilityDataStable);
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("adminFacilityDataChangesCancelled")
    }



})()



/***/ }),

/***/ "./src/databasePost.js":
/*!*****************************!*\
  !*** ./src/databasePost.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "databasePost": () => (/* binding */ databasePost)
/* harmony export */ });
/* harmony import */ var _src_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/events */ "./src/events.js");


const databasePost = (function(){

    // events.subscribe("allUsersDataUpdated", changeAllUsersArray);
    // events.subscribe("adminAvailabilityDataUpdated", alertAndLogCurrentObject)
    // events.subscribe("adminAllTeamsDataUpdated", changeAllTeamsData)
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("adminFacilityDataUpdateRequested", changeFacilityData)
    // events.subscribe("availabilityDataUpdated", changeAvailabilityData)
    // events.subscribe("myTeamsDataUpdated", changeMyTeamsData)
    // events.subscribe("verifyUpToDateClicked", changeVerificationData)//
    // events.subscribe("pageChangeRequested", alertAndLogCurrentObject);
    // events.subscribe("userSeasonChangeRequested", changeUserSeason); //
    // events.subscribe("adminSeasonChangeRequested", changeAdminSeason);
    

    function alertAndLogCurrentObject(databaseBoundObject){
        console.log(databaseBoundObject)
        alert(databaseBoundObject)
    }

    async function changeFacilityData(databaseBoundObject){ 
        try{
            const facilityDataResponse = await fetch('adminHome/postAdminFacilitySettings.json', {
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(databaseBoundObject)
    
            });
            console.log(await facilityDataResponse.body)
            _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("facilityDataSaved")
        }catch(err){
            console.log(err)
        }//fix the id to be dynamic
       
    }

    function changeAllTeamsData(databaseBoundObject){
        alertAndLogCurrentObject(databaseBoundObject)
        const sortedTeams = databaseBoundObject.sort(function(a,b){
            return a.rank.allTeams - b.rank.allTeams
        })
        adminTestObj.allTeams = sortedTeams
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("dataLoadedFromDatabase", adminTestObj)
    }

    function changeAllUsersArray(databaseBoundObject){
        alertAndLogCurrentObject(databaseBoundObject)
        adminTestObj.allUsers = databaseBoundObject;
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("dataLoadedFromDatabase", adminTestObj)
    }

    function changeAdminSeason(databaseBoundObject){
        alertAndLogCurrentObject(databaseBoundObject)
        adminTestObj.season = databaseBoundObject
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("dataLoadedFromDatabase", adminTestObj)
    }

    function changeUserSeason(databaseBoundObject){
        alertAndLogCurrentObject(databaseBoundObject)
        userTestObj.season = databaseBoundObject
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("dataLoadedFromDatabase", userTestObj)
    }


    function changeVerificationData(databaseBoundObject){
        alertAndLogCurrentObject(databaseBoundObject)
        userTestObj.lastVerified = databaseBoundObject
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("dataLoadedFromDatabase", userTestObj)
    }

    function changeAvailabilityData(databaseBoundObject){
        alertAndLogCurrentObject(databaseBoundObject)
        userTestObj.availability = databaseBoundObject
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("dataLoadedFromDatabase", userTestObj)
    }

    function changeMyTeamsData(databaseBoundObject){
        alertAndLogCurrentObject(databaseBoundObject)
        const sortedTeams = databaseBoundObject.sort(function(a,b){
            return a.rank.myTeams - b.rank.myTeams
        })
        userTestObj.teams = sortedTeams
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("dataLoadedFromDatabase", userTestObj)
    }

    let userTestObj = {
        name: "Brindle",
        privilegeLevel:false,
        availability:{
            Sun:[{startTime: "420", endTime: "540", admin: "no"}],
            Mon:[],
            Tue:[],
            Wed:[],
            Thu:[],
            Fri:[],
            Sat:[]
        },
        teams:
        [
            {
            name:"basketballWomen",
            coach: "Brindle",
            rank:
                {
                    myTeams: 0,
                    allTeams:6
                },
            size: 15,
            allOpts:
                [
                    [
                        {dayOfWeek:"Tue", startTime: 420, endTime:495, inWeiss:"yes"},
                        {dayOfWeek:"Thu", startTime: 420, endTime:495, inWeiss:"yes"},
                        {dayOfWeek:"Fri", startTime: 420, endTime:495, inWeiss:"yes"},
                    ],
                ]
            },
            
            {
                name:"basketballMen",
                coach: "Brindle",
                rank:
                    {
                        myTeams: 1,
                        allTeams:5
                    },
                size: 25,
                allOpts:
                
                    [
                        [
                            {dayOfWeek:"Tue", startTime: 930, endTime:990, inWeiss:"yes"},
                            {dayOfWeek:"Thu", startTime: 915, endTime:975, inWeiss:"yes"},
                            {dayOfWeek:"Fri", startTime: 870, endTime:930, inWeiss:"yes"},
                        ],
                    ]
            },
    
            {
            name: "football",
            coach:"Brindle",
            rank:
                {
                    myTeams: 2,
                    allTeams:1
                },
            size: 110,
            allOpts:
                [
                    [
                        {dayOfWeek:"Tue", startTime: 870, endTime:915, inWeiss:"yes"},
                        {dayOfWeek:"Thu", startTime: 870, endTime:915, inWeiss:"yes"},
                        {dayOfWeek:"Fri", startTime: 945, endTime:975, inWeiss:"yes"},
                    ],
    
                    [
                        {dayOfWeek:"Wed", startTime: 870, endTime:915, inWeiss:"yes"},
                        {dayOfWeek:"Thu", startTime: 870, endTime:915, inWeiss:"yes"},
                        {dayOfWeek:"Sat", startTime: 945, endTime:975, inWeiss:"yes"},
                    ],
                ]
            },
        ],
        lastVerified: null,
        adminPageSet:null,
        season:"fall",
        allTeams:
            [
                {
                name: "football",
                coach:"Brindle",
                rank:
                    {
                        myTeams: 2,
                        allTeams:1
                    },
                size: 110,
                allOpts:
                    [
                        [
                            {dayOfWeek:"Tue", startTime: 870, endTime:915, inWeiss:"yes"},
                            {dayOfWeek:"Thu", startTime: 870, endTime:915, inWeiss:"yes"},
                            {dayOfWeek:"Fri", startTime: 945, endTime:975, inWeiss:"yes"},
                        ],
                    ]
                },
    
                {
                name:"basketballWomen",
                coach: "Brindle",
                rank:
                    {
                        myTeams: 2,
                        allTeams:6
                    },
                size: 15,
                allOpts:
                    
                    [
                        [
                            {dayOfWeek:"Tue", startTime: 420, endTime:495, inWeiss:"yes"},
                            {dayOfWeek:"Thu", startTime: 420, endTime:495, inWeiss:"yes"},
                            {dayOfWeek:"Fri", startTime: 420, endTime:495, inWeiss:"yes"},
                        ],
                    ]
                },
                
                {
                    name:"basketballMen",
                    coach: "Brindle",
                    rank:
                        {
                            myTeams: 1,
                            allTeams:5
                        },
                    size: 25,
                    allOpts:
                    
                        [
                            [
                                {dayOfWeek:"Tue", startTime: 930, endTime:990, inWeiss:"yes"},
                                {dayOfWeek:"Thu", startTime: 915, endTime:975, inWeiss:"yes"},
                                {dayOfWeek:"Fri", startTime: 870, endTime:930, inWeiss:"yes"},
                            ],
                        ]
                    },
    
                    {
                    name:"sprintFootball",
                    coach: "Dolan",
                    rank:
                        {
                            myTeams: 4,
                            allTeams:4
                        },
                    size: 50,
                    allOpts:
                    
                        [
                            [
                                {dayOfWeek:"Tue", startTime: 960, endTime:1020, inWeiss:"yes"},
                                {dayOfWeek:"Sat", startTime: 540, endTime:600, inWeiss:"yes"},
                            ],
                        ]
                    },
            ],
        facilitySelectors:{
            facilityOpen:360,
            facilityClose: 1200,
            facilityMaxCapacity:150
        }
    
    }
    
    let adminTestObj = {
        name: "Brindle",
        privilegeLevel:true,
        availability:{
            Sun:[{startTime: "420", endTime: "540", admin: "no"}],
            Mon:[],
            Tue:[],
            Wed:[],
            Thu:[],
            Fri:[],
            Sat:[]
        },
        teams:
            [
                {
                name:"basketballWomen",
                coach: "Brindle",
                rank:
                    {
                        myTeams: 0,
                        allTeams:0
                    },
                size: 15,
                
                allOpts:
                    
                    [
                        [
                            {dayOfWeek:"Tue", startTime: 420, endTime:495, inWeiss:"yes"},
                            {dayOfWeek:"Thu", startTime: 420, endTime:495, inWeiss:"yes"},
                            {dayOfWeek:"Fri", startTime: 420, endTime:495, inWeiss:"yes"},
                        ],
                    ]
                },
                
                {
                name:"basketballMen",
                coach: "Brindle",
                rank:
                    {
                        myTeams: 1,
                        allTeams:1
                    },
                size: 25,
                allOpts:
                
                    [
                        [
                            {dayOfWeek:"Tue", startTime: 930, endTime:990, inWeiss:"yes"},
                            {dayOfWeek:"Thu", startTime: 915, endTime:975, inWeiss:"yes"},
                            {dayOfWeek:"Fri", startTime: 870, endTime:930, inWeiss:"yes"},
                        ],
                    ]
                },
            ],
        lastVerified: null,
        adminPageSet:"admin",
        season:"fall",
    
        allTeams:
            [
                {
                name:"basketballWomen",
                coach: "Brindle",
                rank:
                    {
                        myTeams: 0,
                        allTeams:0
                    },
                size: 15,
                enabled: true,
                allOpts:
                    [
                        [
                            {dayOfWeek:"Tue", startTime: 420, endTime:495, inWeiss:"yes"},
                            {dayOfWeek:"Thu", startTime: 420, endTime:495, inWeiss:"yes"},
                            {dayOfWeek:"Fri", startTime: 420, endTime:495, inWeiss:"yes"},
                        ],
                    ]
                },
            
                {
                name:"basketballMen",
                coach: "Brindle",
                enabled: true,
                rank:
                    {
                        myTeams: 1,
                        allTeams:1
                    },
                size: 25,
                allOpts:
                
                    [
                        [
                            {dayOfWeek:"Tue", startTime: 930, endTime:990, inWeiss:"yes"},
                            {dayOfWeek:"Thu", startTime: 915, endTime:975, inWeiss:"yes"},
                            {dayOfWeek:"Fri", startTime: 870, endTime:930, inWeiss:"yes"},
                        ],
                    ]
                },
    
                {
                name: "football",
                coach:"Rivera",
                enabled: false,
                rank:
                    {
                        myTeams: 0,
                        allTeams:2
                    },
                size: 110,
                allOpts:
                    [
                        [
                            {dayOfWeek:"Tue", startTime: 870, endTime:915, inWeiss:"yes"},
                            {dayOfWeek:"Thu", startTime: 870, endTime:915, inWeiss:"yes"},
                            {dayOfWeek:"Fri", startTime: 945, endTime:975, inWeiss:"yes"},
                        ],
                    ]
                },
    
                {
                name:"sprintFootball",
                coach: "Dolan",
                rank:
                    {
                        myTeams: 0,
                        allTeams:3
                    },
                size: 50,
                enabled: true,
                allOpts:
                
                    [
                        [
                            {dayOfWeek:"Tue", startTime: 960, endTime:1020, inWeiss:"yes"},
                            {dayOfWeek:"Sat", startTime: 540, endTime:600, inWeiss:"yes"},
                        ],
                    ]
            },
        ],
        facilitySelectors:{
            facilityOpen:360,
            facilityClose: 1200,
            facilityMaxCapacity:120
        },
    
        allUsers:
        [
            {
            name: "Brindle",
            color: "#00ff00",
            privilegeLevel:true,
            availability:{
                Sun:[{startTime: "420", endTime: "540", admin: "no"}],
                Mon:[],
                Tue:[],
                Wed:[],
                Thu:[],
                Fri:[],
                Sat:[]
            },
            teams:
                [
                    {
                    name:"basketballWomen",
                    coach: "Brindle",
                    rank:
                        {
                        myTeams: 0,
                        allTeams:0
                        },
                    size: 15,
                    allOpts:
                        [
                            [
                                {dayOfWeek:"Tue", startTime: 420, endTime:495, inWeiss:"yes"},
                                {dayOfWeek:"Thu", startTime: 420, endTime:495, inWeiss:"yes"},
                                {dayOfWeek:"Fri", startTime: 420, endTime:495, inWeiss:"yes"},
                            ],
                        ]
                    },
    
                    {
                    name:"basketballMen",
                    coach: "Brindle",
                    rank:
                        {
                            myTeams: 1,
                            allTeams:1
                        },
                    size: 25,
                    allOpts:
    
                        [
                            [
                                {dayOfWeek:"Tue", startTime: 930, endTime:990, inWeiss:"yes"},
                                {dayOfWeek:"Thu", startTime: 915, endTime:975, inWeiss:"yes"},
                                {dayOfWeek:"Fri", startTime: 870, endTime:930, inWeiss:"yes"},
                            ],
                        ]
                    },
                ],
            lastVerified: null,
            adminPageSet:"admin",
            season:"fall"
            },
    
            {    
            name: "Rivera",
            color: "#0000ff",
            privilegeLevel:false,
            availability:{
                Sun:[{startTime: "420", endTime: "540", admin: "no"}],
                Mon:[],
                Tue:[],
                Wed:[],
                Thu:[],
                Fri:[],
                Sat:[]
            },
            teams:
                [
                    {
                    name: "football",
                    coach:"Rivera",
                    rank:
                        {
                            myTeams: 0,
                            allTeams:2
                        },
                    size: 110,
                    allOpts:
                        [
                            [
                                {dayOfWeek:"Tue", startTime: 870, endTime:915, inWeiss:"yes"},
                                {dayOfWeek:"Thu", startTime: 870, endTime:915, inWeiss:"yes"},
                                {dayOfWeek:"Fri", startTime: 945, endTime:975, inWeiss:"yes"},
                            ],
                        ]
                    },
                ],
            lastVerified: null,
            adminPageSet:null,
            season:"fall",
            },
    
            {    
            name: "Dolan",
            privilegeLevel:false,
            color: "#ffa500",
            availability:{
                Sun:[{startTime: "420", endTime: "540", admin: "no"}],
                Mon:[],
                Tue:[],
                Wed:[],
                Thu:[],
                Fri:[],
                Sat:[]
            },
            teams:
                [
                    {
                    name:"sprintFootball",
                    coach: "Dolan",
                    rank:
                        {
                            myTeams: 0,
                            allTeams:3
                        },
                    size: 50,
                    allOpts:
    
                        [
                            [
                                {dayOfWeek:"Tue", startTime: 960, endTime:1020, inWeiss:"yes"},
                                {dayOfWeek:"Sat", startTime: 540, endTime:600, inWeiss:"yes"},
                            ],
                        ]
                    },
                ],
            lastVerified: null,
            adminPageSet:null,
            season:"fall"
            }
        ],
    
        adminTimeBlocks:
            {
            Sun:[],
            Mon:[{startTime: "420", endTime: "540", admin: "yes"}],
            Tue:[],
            Wed:[],
            Thu:[{startTime: "780", endTime: "840", admin: "yes"}],
            Fri:[],
            Sat:[]
            }
    }

})();



/***/ }),

/***/ "./src/events.js":
/*!***********************!*\
  !*** ./src/events.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "events": () => (/* binding */ events)
/* harmony export */ });


const events = {
    events: {},
    
    subscribe: function(eventName, fn){
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    },

    unsubscribe: function (eventName, fn){
        if(this.events[eventName]){
            for(let i = 0; i< this.events[eventName].length; i++){
                if(this.events[eventName][i] === fn){
                    this.events[eventName].splice(i, 1);
                    break;
                }
            }
        }
    },

    publish: function (eventName, data){
        if(this.events[eventName]){
            this.events[eventName].forEach(function(fn){
                fn(data);
            })
        }
    }
}





/***/ }),

/***/ "./src/timeConverter.js":
/*!******************************!*\
  !*** ./src/timeConverter.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "timeValueConverter": () => (/* binding */ timeValueConverter)
/* harmony export */ });
//purpose: convert totalMinutes into clockTime, and clockTime into totalMinutes

const timeValueConverter = (function(){
    //no obvious issues here
    function convertTotalMinutesToTime(totalMins){
        let standardTime;
        let hour = Math.floor(totalMins/60)
        let meridian
            switch(hour){
                case 0:
                    hour += 12
                    meridian = "a"
                    break;
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                    meridian = "a"
                    break;
                case 12:
                    meridian = "p"
                    break;
                default:
                    hour -=12
                    meridian = "p"
                    break;
            }
            
        let mins = totalMins%60
            if(mins == 0){
                mins = "00"
            }
        standardTime = `${hour}:${mins}${meridian}`
        return standardTime
    }

    function runConvertTotalMinutesToTime(totalMins){
        return convertTotalMinutesToTime(totalMins)
    }

    function convertTimeToTotalMinutes(time){
        const colonIndex = time.indexOf(":");
        const meridian = time[time.length-1]
        const meridianIndex = time.indexOf(meridian);
        
        let hour = Number(time.slice(0, colonIndex));
            if(meridian == "p" && hour != 12){
                hour +=12;
            }else if(meridian == "a" && hour == 12){
                hour -=12;
            }
        const min = Number(time.slice(colonIndex + 1, meridianIndex));
        const totalMinutes = hour*60 + min;

        return totalMinutes
    }

    function runConvertTimeToTotalMinutes(time){
        return convertTimeToTotalMinutes(time)
    }

    return {runConvertTimeToTotalMinutes, runConvertTotalMinutesToTime}

})();



/***/ }),

/***/ "./src/validators/facilityDataValidator.js":
/*!*************************************************!*\
  !*** ./src/validators/facilityDataValidator.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "facilityDataValidator": () => (/* binding */ facilityDataValidator)
/* harmony export */ });
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../events */ "./src/events.js");


/*purpose: validator for facilityData updates

facilityData object is modeled as such:

obj = {
    facilityOpen, 
    facilityClose, 
    facilityMaxCapacity
}

publishes:
    successful validations FOR adminMainPageFacilityDataModel
   
subscribes to: 
    validation requests FROM adminMainPageFacilityDataModel
*/

const facilityDataValidator = (function(){
    //no obvious issues here
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("adminFacilityDataValidationRequested", validateAdminFacilityData);
    
    function validateAdminFacilityData(facilityData){
        const string = "A non-default value must be selected for the following: ";
        const emptySelectors = [];
  
        for(let prop in facilityData){
            if(facilityData[prop] == "default"){
                emptySelectors.push(prop);
                if(emptySelectors.length >1){
                    string.concat(", ", prop);
                }else{
                    string.concat(prop);
                }
            }
        }

        if(emptySelectors.length > 0){
            alert(string) //change this to return errorContent to form
        }else{
            _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("adminFacilityDataValidated", facilityData)
        }
    }
})()



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!******************************!*\
  !*** ./src/adminHomePage.js ***!
  \******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/events */ "./src/events.js");
/* harmony import */ var _src_adminHomePage_components_adminHomeRender__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/adminHomePage/components/adminHomeRender */ "./src/adminHomePage/components/adminHomeRender.js");
/* harmony import */ var _src_adminHomePage_components_mainModulesRenders_facilityDataGrid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/adminHomePage/components/mainModulesRenders/facilityDataGrid */ "./src/adminHomePage/components/mainModulesRenders/facilityDataGrid.js");
/* harmony import */ var _src_adminHomePage_components_forms_facilityDataForm__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/adminHomePage/components/forms/facilityDataForm */ "./src/adminHomePage/components/forms/facilityDataForm.js");
/* harmony import */ var _src_adminHomePage_models_facilityData__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/adminHomePage/models/facilityData */ "./src/adminHomePage/models/facilityData.js");
/* harmony import */ var _src_validators_facilityDataValidator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/validators/facilityDataValidator */ "./src/validators/facilityDataValidator.js");
/* harmony import */ var _src_databasePost__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../src/databasePost */ "./src/databasePost.js");








window.onload = setScriptData;

async function setScriptData(){
    try{
        const adminPageJSON = await fetch('adminHome/adminData.json'); //change this to accept userId and season
        const adminPageData = await adminPageJSON.json();
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("adminDataFetched", adminPageData);
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("adminDataSet");
        
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
})();

/******/ })()
;
//# sourceMappingURL=adminHomePage.js.map