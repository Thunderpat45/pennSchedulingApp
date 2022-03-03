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
    
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("adminDataFetched", setSelectorRanges);
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('userDataFetched', setSelectorRanges)
    
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
        })
    }

    function disableDefaultOption(){ //these are all not working, may need to use event delegation within the modules themselves
        const values = Array.from(this.children);
        values[0].disabled = true;
    }

    return {runBuildSelector}

})();




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

    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("userUpdateRequested", updateUserData);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("newUserAdditionRequested", addUserData);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("deleteUserRequested", deleteUserData);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('adminBlockUpdateRequested', updateAdminBlockData);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('newAdminBlockAdditionRequested', addAdminBlockData)
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('adminBlockDeleteRequested', deleteAdminBlockData);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('availabilityBlockUpdateRequested', updateUserBlockData);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('newAvailabilityBlockAdditionRequested', addUserBlockData)
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('availabilityBlockDeleteRequested', deleteUserBlockData)
   
    // events.subscribe("adminAllTeamsDataUpdated", changeAllTeamsData)
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("adminFacilityDataUpdateRequested", updateFacilityData)
   
    // events.subscribe("myTeamsDataUpdated", changeMyTeamsData)
    // events.subscribe("verifyUpToDateClicked", changeVerificationData)//
    // events.subscribe("pageChangeRequested", alertAndLogCurrentObject);
    // events.subscribe("userSeasonChangeRequested", changeUserSeason); //
    // events.subscribe("adminSeasonChangeRequested", changeAdminSeason);;
    
    

    function alertAndLogCurrentObject(databaseBoundObject){
        console.log(databaseBoundObject)
        alert(databaseBoundObject)
    }

    async function updateFacilityData(databaseBoundObject){ 
        try{
            await fetch('adminHome/postAdminFacilitySettings.json', {
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(databaseBoundObject)
    
            });
            _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("facilityDataSaved")
        }catch(err){
            console.log(err)
        }//fix the id to be dynamic
       
    }

    async function updateUserData(databaseBoundObject){
        const {_id} = databaseBoundObject;
        try{
            const userDataResponse = await fetch(`adminHome/user/${_id}/update.json`, { //change the hard-coded id's into userspecific id's SOON
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(databaseBoundObject)
    
            });

            if(userDataResponse.status == 404){ //expand on http statuses?
                throw('404 error!')
            }else if(userDataResponse.status == 400){
                const errors = await userDataResponse.json();
                const origin = "edit"
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("userDataValidationFailed", {errors, origin})
            }else if(userDataResponse.status == 200){ 
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("editUserDataSaved")
            }
           
        }catch(err){
            console.log(err)
        }//fix the id to be dynamic
    }

    async function addUserData(databaseBoundObject){
        try{
            const userDataResponse = await fetch('adminHome/user/add.json', {
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(databaseBoundObject)
    
            });

            if(userDataResponse.status == 404){ //expand on http statuses?
                throw('404 error!')
            }else if(userDataResponse.status == 400){
                const errors = await userDataResponse.json()
                const origin = "add"
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("userDataValidationFailed", {errors, origin})
            }else if(userDataResponse.status == 200){
                const newUser = await userDataResponse.json();  
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("newUserDataSaved", newUser)
            }
        }catch(err){
            console.log(err)
        }
    }

    async function deleteUserData(userId){
        const idObj = {_id: userId}
        try{
            const userDataResponse = await fetch(`adminHome/user/${userId}/delete.json`, { //change the hard-coded id's into userspecific id's SOON
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(idObj)
    
            });

            if(userDataResponse.status == 404){ //expand on http statuses?
                throw('404 error!')
            }else if(userDataResponse.status == 400){
                const errors = await userDataResponse.json();
                alert(errors);
            }else if(userDataResponse.status == 200){
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("userDataDeleted", userId)
            }
        }catch(err){
            console.log(err)
        }
    }

    async function updateAdminBlockData(databaseBoundObject){
        const {_id} = databaseBoundObject;
        try{
            const blockDataResponse = await fetch(`adminHome/timeBlock/${_id}/update.json`, { //change the path
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(databaseBoundObject)
    
            });

            if(blockDataResponse.status == 404){ //expand on http statuses?
                throw('404 error!')
            }else if(blockDataResponse.status == 400){
                const errors = await blockDataResponse.json();
                const origin = "edit"
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("adminAvailabilityDataValidationFailed", {errors, origin})
            }else if(blockDataResponse.status == 200){ 
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("editAdminBlockDataSaved") //find receiver
            }
           
        }catch(err){
            console.log(err)
        }//fix the id to be dynamic
    }

    async function addAdminBlockData(databaseBoundObject){
        try{
            const blockDataResponse = await fetch('adminHome/timeBlock/add.json', {  //get rid of hard coded season as soon as possible
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(databaseBoundObject)
    
            });

            if(blockDataResponse.status == 404){ //expand on http statuses?
                throw('404 error!')
            }else if(blockDataResponse.status == 400){
                const errors = await blockDataResponse.json()
                const origin = "add"
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("adminAvailabilityDataValidationFailed", {errors, origin})
            }else if(blockDataResponse.status == 200){
                const newAdminBlock = await blockDataResponse.json(); 
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("newAdminBlockDataSaved", newAdminBlock) //find listener
            }
        }catch(err){
            console.log(err)
        }
    }

    async function deleteAdminBlockData(blockData){
        const idObj = {_id: blockData._id}
        try{
            const blockDataResponse = await fetch(`adminHome/timeBlock/${blockData._id}/delete.json`, { //change the hard-coded id's into userspecific id's SOON
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(idObj)
    
            });

            if(blockDataResponse.status == 404){ //expand on http statuses?
                throw('404 error!')
            }else if(blockDataResponse.status == 400){
                const errors = await blockDataResponse.json();
                alert(errors);
            }else if(blockDataResponse.status == 200){
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("adminBlockDataDeleted", blockData)
            }
        }catch(err){
            console.log(err)
        }
    }

    ///
    async function updateUserBlockData(databaseBoundObject){
        const {_id} = databaseBoundObject;
        try{
            const blockDataResponse = await fetch(`home/timeBlock/${_id}/update.json`, { //change the path
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(databaseBoundObject)
    
            });

            if(blockDataResponse.status == 404){ //expand on http statuses?
                throw('404 error!')
            }else if(blockDataResponse.status == 400){
               
                const errors = await blockDataResponse.json();
                console.log(errors)
                const origin = "edit"
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("userAvailabilityValidationFailed", {errors, origin})
            }else if(blockDataResponse.status == 200){ 
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("editAvailabilityBlockDataSaved") 
            }
           
        }catch(err){
            console.log(err)
        }//fix the id to be dynamic
    }

    async function addUserBlockData(databaseBoundObject){
        try{
            const blockDataResponse = await fetch('home/timeBlock/add.json', { 
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(databaseBoundObject)
    
            });

            if(blockDataResponse.status == 404){ //expand on http statuses?
                throw('404 error!')
            }else if(blockDataResponse.status == 400){
                const errors = await blockDataResponse.json()
                const origin = "add"
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("userAvailabilityValidationFailed", {errors, origin})
            }else if(blockDataResponse.status == 200){
                const newAdminBlock = await blockDataResponse.json(); 
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("newAvailabilityBlockDataSaved", newAdminBlock)
            }
        }catch(err){
            console.log(err)
        }
    }

    async function deleteUserBlockData(blockData){
        try{
            const blockDataResponse = await fetch(`home/timeBlock/${blockData._id}/delete.json`, { //change the hard-coded id's into userspecific id's SOON
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(blockData)
    
            });

            if(blockDataResponse.status == 404){ //expand on http statuses?
                throw('404 error!')
            }else if(blockDataResponse.status == 400){
                const errors = await blockDataResponse.json();
                alert(errors);
            }else if(blockDataResponse.status == 200){
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("availabilityBlockDataDeleted", blockData)
            }
        }catch(err){
            console.log(err)
        }
    }

    ///

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

/***/ "./src/homePage/components/forms/availabilityBlockForm.js":
/*!****************************************************************!*\
  !*** ./src/homePage/components/forms/availabilityBlockForm.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "availabilityTimeBlockDataFormComponent": () => (/* binding */ availabilityTimeBlockDataFormComponent)
/* harmony export */ });
/* harmony import */ var _src_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../src/events */ "./src/events.js");
/* harmony import */ var _src_DOMBuilders_selectorDOMBuilder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../src/DOMBuilders/selectorDOMBuilder */ "./src/DOMBuilders/selectorDOMBuilder.js");
/* harmony import */ var _src_timeConverter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../src/timeConverter */ "./src/timeConverter.js");





const availabilityTimeBlockDataFormComponent = (function(){

    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('availabilityBlockAddRequested', renderTimeBlockDataForm);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('availabilityBlockDataLoaded', renderTimeBlockDataForm);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('availabilityDataChangesCancelled', unrenderTimeBlockDataForm);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("renderAvailabilityBlockValidationErrors", renderAvailabilityBlockDataValidationErrors)
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("editAvailabilityBlockDataSaved", unrenderTimeBlockDataForm);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('newAvailabilityBlockDataSaved', unrenderTimeBlockDataForm)



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

        formDivWrapper.classList.toggle("formHidden");
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
    
            const selectorNew = _src_DOMBuilders_selectorDOMBuilder__WEBPACK_IMPORTED_MODULE_1__.selectorBuilder.runBuildSelector(primaryClass);
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
                const value = selectorNew.value;
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("modifyAvailabilitySelectorValues", {modifiedSelector, value})

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
            _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("updateAvailabilityClicked", timeBlockData.origin);
        }
        function cancelTimeBlockChanges(){
            _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("cancelAvailabilityBlockChangesClicked")
        }
    }
    
    function createErrorText(data, selector){
        const errorText = document.createElement("p");
        errorText.innerText = `Your selected value of ${_src_timeConverter__WEBPACK_IMPORTED_MODULE_2__.timeValueConverter.runConvertTotalMinutesToTime(data[selector])} for ${selector} has been invalidated by a change to the opening/closing times for the facility. Speak with your supervisor to address this or change this value.`;
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





/***/ }),

/***/ "./src/homePage/components/homePageRender.js":
/*!***************************************************!*\
  !*** ./src/homePage/components/homePageRender.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "homeRender": () => (/* binding */ homeRender)
/* harmony export */ });
/* harmony import */ var _src_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../src/events */ "./src/events.js");


const homeRender = (function(){

    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("userDataSet", setHomeEventListeners);

    function setHomeEventListeners(){
        setAvailabilityEventListeners();
    }

    function setAvailabilityEventListeners(){
        const availabilityTimeBlockDays = Array.from(document.querySelector("#userPageAddAvailabilityBlockGrid").children);
    
        availabilityTimeBlockDays.forEach(function(day){
            const dayString = day.querySelector("h3").innerText;
            const addBlockButton = day.querySelector(".userPageAddAvailabilityBlockAddButton");
    
            addBlockButton.addEventListener("click", addTimeBlock);
    
            const dayAllBlocks = Array.from(day.querySelectorAll(".userPageAddAvailabilityAllBlocks > div"));
            if(dayAllBlocks.length > 0 ){
                dayAllBlocks.forEach(function(timeBlock){
                    const _id = timeBlock.dataset.timeblockid
                    const editBlockButton = timeBlock.querySelector(".userPageAddAvailabilityBlockEditButton");
                    const deleteBlockButton = timeBlock.querySelector(".userPageAddAvailabilityBlockDeleteButton")
    
                    if(editBlockButton != null){
                        editBlockButton.addEventListener("click", editTimeBlock);
                        deleteBlockButton.addEventListener("click", deleteTimeBlock);
                    }
                    
    
                    function editTimeBlock(){
                        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("editAvailabilityClicked", {day:dayString, _id})
                    }
    
                    function deleteTimeBlock(){
                        const confirmation = confirm("Delete this time block?");
                        if(confirmation){
                            _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("deleteAvailabilityClicked", {day:dayString, _id})
                        }
                    }
                })
            }
    
            function addTimeBlock(){
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("addAvailabilityTimeBlockClicked", dayString)
            }
        })
    }

})()




/***/ }),

/***/ "./src/homePage/components/mainModuleRenders/availabilityBlocksGrid.js":
/*!*****************************************************************************!*\
  !*** ./src/homePage/components/mainModuleRenders/availabilityBlocksGrid.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "availabilityTimeBlockDataGridComponent": () => (/* binding */ availabilityTimeBlockDataGridComponent)
/* harmony export */ });
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../events */ "./src/events.js");
/* harmony import */ var _timeConverter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../timeConverter */ "./src/timeConverter.js");



const availabilityTimeBlockDataGridComponent = (function(){

    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("renderUpdatedAvailabilityBlockData", renderAdminTimeBlockDay)

    function renderAdminTimeBlockDay(adminTimeBlockDayData){
        const {day, blocks} = adminTimeBlockDayData
    
        const availabilityBlocksDiv = document.querySelector("#userPageAddAvailabilityBlockGrid");
        const dayDiv = Array.from(availabilityBlocksDiv.querySelectorAll("div")).find(function(div){
            return div.firstElementChild.innerText == day;
        });
        const dayAllBlocksDiv = dayDiv.querySelector(".userPageAddAvailabilityAllBlocks");
        const dayAllBlocksDivNew = document.createElement("div");
        dayAllBlocksDivNew.classList.add("userPageAddAvailabilityAllBlocks")
    
        if(blocks.length > 0){
            blocks.forEach(function(timeBlockData){
                const row = buildBlockRow(day, timeBlockData);
                dayAllBlocksDivNew.appendChild(row)
            })
        }else{
            const defaultText = document.createElement('p');
            defaultText.innerText = "No timeblocks";
            dayAllBlocksDivNew.appendChild(defaultText);
        }
        
    
        dayAllBlocksDiv.replaceWith(dayAllBlocksDivNew);
    }
     
    function buildBlockRow(day, blockData){ 
        const {_id} = blockData
        const elements = setTemplateElements()
        setElementsContent(elements, blockData);
        setEventListeners(elements, {day, _id});
        
        return elements.content 
    }
    
    function setTemplateElements(){
        const template = document.querySelector("#userPageAddAvailabilityBlockTemplate");
        const content = document.importNode(template.content, true);
    
        const user = content.querySelector(".userPageAddAvailabilityBlock");
        const startTimeText = content.querySelector(".userPageAddAvailabilityBlockStart > p")
        const endTimeText = content.querySelector(".userPageAddAvailabilityBlockEnd > p")
        
        const editButton = content.querySelector(".userPageAddAvailabilityBlockEditButton");
        const deleteButton = content.querySelector(".userPageAddAvailabilityBlockDeleteButton");
        
        return {user, content, startTimeText, endTimeText, editButton, deleteButton}
    }
    
    function setElementsContent(blockElement, blockData){
        blockElement.user.setAttribute("dataTimeBlockId", blockData._id)
        if(isNaN(Number(blockData.availability.startTime)) == false){
            blockElement.startTimeText.innerText += _timeConverter__WEBPACK_IMPORTED_MODULE_1__.timeValueConverter.runConvertTotalMinutesToTime(blockData.availability.startTime);
        }else{
            blockElement.startTimeText.innerText = blockData.availability.startTime;
        }
        if(isNaN(Number(blockData.availability.endTime)) == false){
            blockElement.endTimeText.innerText += _timeConverter__WEBPACK_IMPORTED_MODULE_1__.timeValueConverter.runConvertTotalMinutesToTime(blockData.availability.endTime);
        }else{
            blockElement.endTimeText.innerText =blockData.availability.endTime;
        }
    
        if(blockData.admin == true){
            blockElement.editButton.remove()
            blockElement.deleteButton.remove()
        }
        
    }
    
    function setEventListeners(timeBlockElement, timeBlockData){
        timeBlockElement.editButton.addEventListener("click", editAdminTimeBlock);
        timeBlockElement.deleteButton.addEventListener("click", deleteAdminTimeBlock);
    
        function editAdminTimeBlock(){
            _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("editAvailabilityClicked", timeBlockData)
        }
        function deleteAdminTimeBlock(){
            const confirmation = confirm("Delete this time block?");
            if(confirmation){
                _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("deleteAvailabilityClicked", timeBlockData)
            }
            
        }
    }

})()



/***/ }),

/***/ "./src/homePage/models/allAvailabilityData.js":
/*!****************************************************!*\
  !*** ./src/homePage/models/allAvailabilityData.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "allAvailabilityDataModel": () => (/* binding */ allAvailabilityDataModel)
/* harmony export */ });
/* harmony import */ var _src_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../src/events */ "./src/events.js");
/* harmony import */ var _timeConverter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../timeConverter */ "./src/timeConverter.js");



const allAvailabilityDataModel = (function(){
    
    let allAvailabilityDataStable = {};
    let allAvailabilityDataMutable = {};
    
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("userDataFetched", setDataNewPageRender);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("updateAllAvailabilityBlocksModel", setDataNewDatabasePost)
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("editAvailabilityClicked", editAvailabilityBlock)
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("deleteAvailabilityClicked", deleteAvailabilityBlock);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('availabilityBlockDataDeleted', setDataBlockDataDeleted)

    function setDataNewPageRender(userData){
        allAvailabilityDataStable = userData.availabilityTimeBlocks;
        createAvailabilityDeepCopy(allAvailabilityDataMutable, allAvailabilityDataStable);
    }

    function createAvailabilityDeepCopy(newObj, copyObj){
        for(let prop in newObj){
            delete newObj[prop]
        }

        for(let day in copyObj){
            newObj[day] = [];
            copyObj[day].forEach(function(timeBlock){ //edit
                const {admin, day, season, _id, coach} = timeBlock
                const timeBlockCopy = Object.assign({}, {admin, day, season, _id, coach});
                timeBlockCopy.availability = Object.assign({}, timeBlock.availability)
                newObj[day].push(timeBlockCopy);
                

            });
        }
    }

    function editAvailabilityBlock(timeBlockObj){
        const {day, _id} = timeBlockObj;
        const block = allAvailabilityDataMutable[day].filter(function(timeBlock){
            return timeBlock._id == _id;
        })[0]

        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("availabilityBlockEditRequested", block); //add publish that sends to form, need _id/day?
    }

    function deleteAvailabilityBlock(timeBlockObj){
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("availabilityBlockDeleteRequested", timeBlockObj); //send this to database, change to deleteRequested?
    }

    function setDataNewDatabasePost(blockData){
		const thisBlockIndex = allAvailabilityDataMutable[blockData.day].findIndex(function(block){
			return block._id == blockData._id
		});
		if(thisBlockIndex != -1){
			allAvailabilityDataMutable[blockData.day][thisBlockIndex] = blockData
		}else{
			allAvailabilityDataMutable[blockData.day].push(blockData);
		}
		
        createAvailabilityDeepCopy(allAvailabilityDataStable, allAvailabilityDataMutable);
		_src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("renderUpdatedAvailabilityBlockData", {day: blockData.day, blocks: allAvailabilityDataMutable[blockData.day]})
    }

    function setDataBlockDataDeleted(blockData){
        const {day, _id} = blockData
		const newBlocksList = allAvailabilityDataMutable[day].filter(function(block){
			return _id != block._id
		})

		allAvailabilityDataMutable[day] = newBlocksList;
		createAvailabilityDeepCopy(allAvailabilityDataStable, allAvailabilityDataMutable);
		_src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("renderUpdatedAvailabilityBlockData", {day, blocks: allAvailabilityDataMutable[day]})
	}

})()



/***/ }),

/***/ "./src/homePage/models/availabilityData.js":
/*!*************************************************!*\
  !*** ./src/homePage/models/availabilityData.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "availabilityData": () => (/* binding */ availabilityData)
/* harmony export */ });
/* harmony import */ var _src_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../src/events */ "./src/events.js");


const availabilityData = (function(){
    
    let availabilityModelStable;
    let availabilityModelMutable;

    const timeBlockDefault = {
        admin:false,
        season:null,
        day:null,
        availability:{startTime: "default", endTime: "default"}
    };

    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('userDataFetched', setSeason)
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("addAvailabilityTimeBlockClicked", addAvailabilityBlock);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("modifyAvailabilitySelectorValues", modifyAvailabilityValue);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('availabilityBlockEditRequested', setAvailabilityDataEditRequest)
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('cancelAvailabilityBlockChangesClicked', setAvailabilityDataCancelRequest)
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("updateAvailabilityClicked", validateChanges);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("userAvailabilityDataValidated", updateAvailabilityData)
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("userAvailabilityValidationFailed", renderBlockValidationErrors);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("editAvailabilityBlockDataSaved", publishBlockUpdatesToAllBlocks);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("newAvailabilityBlockDataSaved", addBlockDataToAllBlocks);

    function setSeason(userData){
        timeBlockDefault.season = userData.season
    } 

    function setAvailabilityDataEditRequest(timeBlock){
        availabilityModelStable =  timeBlock;
        availabilityModelMutable = Object.assign({}, availabilityModelStable)
        availabilityModelMutable.availability = Object.assign({}, availabilityModelStable.availability)

        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("availabilityBlockDataLoaded", {timeBlock: availabilityModelMutable, origin:"edit"})
    }

    function setAvailabilityDataCancelRequest(){
        availabilityModelStable = {};

        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("availabilityDataChangesCancelled") 
    }

    function addAvailabilityBlock(day){
        availabilityModelStable = Object.assign({}, timeBlockDefault);
        availabilityModelStable.day = day;

        availabilityModelMutable = Object.assign({}, availabilityModelStable);
        availabilityModelMutable.availability = Object.assign({}, availabilityModelStable.availability)

        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("availabilityBlockAddRequested", {timeBlock: availabilityModelMutable, origin: "add"});
    }

    function modifyAvailabilityValue(timeBlockObj){ //make sure this is sent this way
        const {modifiedSelector, value} = timeBlockObj
        availabilityModelMutable.availability[modifiedSelector] = value
    }

    function validateChanges(origin){
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("availabilityValidationRequested", {timeBlock: availabilityModelMutable, origin})
    }

    function updateAvailabilityData(validatedBlockData){
        if(validatedBlockData.origin == "edit"){
			_src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("availabilityBlockUpdateRequested", validatedBlockData.timeBlock) 
		}else{
			_src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("newAvailabilityBlockAdditionRequested", validatedBlockData.timeBlock)
		}
    }

    function renderBlockValidationErrors(validationErrorData){
        const {errors, origin} = validationErrorData
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("renderAvailabilityBlockValidationErrors", {timeBlock: availabilityModelMutable, errors, origin})
    }

    function publishBlockUpdatesToAllBlocks(){
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("updateAllAvailabilityBlocksModel", availabilityModelMutable)
    }

    function addBlockDataToAllBlocks(_id){
        availabilityModelMutable._id = _id;
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("updateAllAvailabilityBlocksModel", availabilityModelMutable);
    }

})()



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

/***/ "./src/validators/availabilityValidator.js":
/*!*************************************************!*\
  !*** ./src/validators/availabilityValidator.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "availabilityValidator": () => (/* binding */ availabilityValidator)
/* harmony export */ });
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../events */ "./src/events.js");


const availabilityValidator = (function(){
  
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("adminBlockDataValidationRequested", validateAllAdminAvailability);
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("availabilityValidationRequested", validateAllUserAvailability);
    
    function validateAllAdminAvailability(timeBlockData){
        const {timeBlock, origin} = timeBlockData
        const errorArray = []
        validateAllInputs(timeBlock, errorArray)
        
        
        if(errorArray.length == 0){
            _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("adminAvailabilityDataValidated", timeBlockData)
        }else{
            _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("adminAvailabilityDataValidationFailed", {errors: errorArray, origin})
        }
    }
    
    function validateAllUserAvailability(timeBlockData){
        const {timeBlock, origin} = timeBlockData
        const errorArray = []
        validateAllInputs(timeBlock, errorArray)

        if(errorArray.length == 0){
            _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("userAvailabilityDataValidated",timeBlockData);
        }else{
            _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("userAvailabilityValidationFailed", {errors: errorArray, origin})
        }
    }
    
    function validateAllInputs(timeBlock, array){
        try{
            for(let prop in timeBlock.availability){
                if(timeBlock.availability[prop] == "default"){
                    throw(`Value for ${prop} cannot be default`);
                }
            }

            if(timeBlock.availability.startTime >= timeBlock.availability.endTime){
                throw('Start time overlaps with end time!')
            }
        }catch(err){
            array.push(err)
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
/*!*************************!*\
  !*** ./src/homePage.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/events */ "./src/events.js");
/* harmony import */ var _src_homePage_components_homePageRender__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/homePage/components/homePageRender */ "./src/homePage/components/homePageRender.js");
/* harmony import */ var _src_homePage_components_forms_availabilityBlockForm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/homePage/components/forms/availabilityBlockForm */ "./src/homePage/components/forms/availabilityBlockForm.js");
/* harmony import */ var _src_homePage_components_mainModuleRenders_availabilityBlocksGrid__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/homePage/components/mainModuleRenders/availabilityBlocksGrid */ "./src/homePage/components/mainModuleRenders/availabilityBlocksGrid.js");
/* harmony import */ var _src_validators_availabilityValidator__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../src/validators/availabilityValidator */ "./src/validators/availabilityValidator.js");
/* harmony import */ var _src_homePage_models_allAvailabilityData__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/homePage/models/allAvailabilityData */ "./src/homePage/models/allAvailabilityData.js");
/* harmony import */ var _src_homePage_models_availabilityData__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../src/homePage/models/availabilityData */ "./src/homePage/models/availabilityData.js");
/* harmony import */ var _src_databasePost__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../src/databasePost */ "./src/databasePost.js");











window.onload = setScriptData;

async function setScriptData(){
    try{
        const userPageJSON = await fetch('home/userData.json');
        const userPageData = await userPageJSON.json();
        console.log(userPageData);
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("userDataFetched", userPageData);
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("userDataSet");
        
    }catch(err){
        console.log(err)
    }
}
})();

/******/ })()
;
//# sourceMappingURL=homePage.js.map