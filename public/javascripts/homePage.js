/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('availabilityBlockDeleteRequested', deleteUserBlockData);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('teamUpdateRequested', updateTeamData);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('newTeamAdditionRequested', addTeamData)
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('teamDataDeleteRequested', deleteTeamData)
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('teamVerificationUpdateRequested', updateTeamVerificationData);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('userAllTeamsVerificationUpdateRequested', updateUserVerificationData);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("adminFacilityDataUpdateRequested", updateFacilityData);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('teamEnabledUpdateRequested', updateTeamEnabledStatus)

    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('myTeamsOrderDataUpdateRequested', updateMyTeamsOrder)
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('allTeamsOrderDataUpdateRequested', updateAllTeamsOrder);

    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('scheduleBuildRequested', buildSchedule)
    //events.subscribe('loginAttemptRequested', postLoginAttempt)
   

    async function updateFacilityData(databaseBoundObject){ 
        try{
            await fetch('adminHome/facilitySettings', {
                method:'PUT',
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
            const userDataResponse = await fetch(`adminHome/user/${_id}`, { //change the hard-coded id's into userspecific id's SOON
                method:'PUT',
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
            const userDataResponse = await fetch('adminHome/user', {
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
            const userDataResponse = await fetch(`adminHome/user/${userId}`, { //change the hard-coded id's into userspecific id's SOON
                method:'DELETE',
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
            const blockDataResponse = await fetch(`adminHome/timeBlock/${_id}`, { //change the path
                method:'PUT',
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
            const blockDataResponse = await fetch('adminHome/timeBlock', {  //get rid of hard coded season as soon as possible
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
            const blockDataResponse = await fetch(`adminHome/timeBlock/${blockData._id}`, { //change the hard-coded id's into userspecific id's SOON
                method:'DELETE',
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
            const blockDataResponse = await fetch(`home/timeBlock/${_id}`, { //change the path
                method:'PUT',
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
            const blockDataResponse = await fetch('home/timeBlock', { 
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
            const blockDataResponse = await fetch(`home/timeBlock/${blockData._id}`, { //change the hard-coded id's into userspecific id's SOON
                method:'DELETE',
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

    async function updateTeamData(databaseBoundObject){
        const {_id} = databaseBoundObject;
        try{
            const teamDataResponse = await fetch(`home/team/${_id}`, { //change the hard-coded id's into userspecific id's SOON
                method:'PUT',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(databaseBoundObject)
    
            });

            if(teamDataResponse.status == 404){ //expand on http statuses?
                throw('404 error!')
            }else if(teamDataResponse.status == 400){
                const errors = await teamDataResponse.json();
                const origin = "edit"
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("teamDataValidationFailed", {errors, origin})
            }else if(teamDataResponse.status == 200){ 
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("editTeamDataSaved")
            }
           
        }catch(err){
            console.log(err)
        }//fix the id to be dynamic
    }

    async function addTeamData(databaseBoundObject){
        try{
            const teamDataResponse = await fetch('home/team', {
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(databaseBoundObject)
    
            });

            if(teamDataResponse.status == 404){ //expand on http statuses?
                throw('404 error!')
            }else if(teamDataResponse.status == 400){
                const errors = await teamDataResponse.json()
                const origin = "add"
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("teamDataValidationFailed", {errors, origin})
            }else if(teamDataResponse.status == 200){
                const newTeam = await teamDataResponse.json();  
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("newTeamDataSaved", newTeam)
            }
        }catch(err){
            console.log(err)
        }
    }

    async function deleteTeamData(teamId){
        const idObj = {_id: teamId}
        try{
            const teamDataResponse = await fetch(`home/team/${teamId}`, { //change the hard-coded id's into userspecific id's SOON
                method:'DELETE',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(idObj)
    
            });

            if(teamDataResponse.status == 404){ //expand on http statuses?
                throw('404 error!')
            }else if(teamDataResponse.status == 400){
                const errors = await teamDataResponse.json();
                alert(errors);
            }else if(teamDataResponse.status == 200){
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("teamDataDeleted", teamId)
            }
        }catch(err){
            console.log(err)
        }
    }

    async function updateTeamVerificationData(databaseBoundObject){
        const {_id} = databaseBoundObject;
        try{
            const teamDataResponse = await fetch(`home/team/${_id}/verification`, {
                method:'PATCH',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(databaseBoundObject)
    
            });

            if(teamDataResponse.status == 404){ //expand on http statuses?
                throw('404 error!')
            }else if(teamDataResponse.status == 400){
                throw('400 error!')
            }else if(teamDataResponse.status == 200){  
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("teamVerificationSaved", databaseBoundObject)
            }
        }catch(err){
            console.log(err)
        }
    }

    async function updateUserVerificationData(timeData){
        const timeDataObj = {lastVerified: timeData}
        try{
            const teamDataResponse = await fetch(`home/allTeamsVerification`, {
                method:'PATCH',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(timeDataObj)
    
            });

            if(teamDataResponse.status == 404){
                throw('404 error!')
            }else if(teamDataResponse.status == 400){
                throw('400 error!')
            }else if(teamDataResponse.status == 200){  
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("allTeamsVerificationSaved", timeData)
            }
        }catch(err){
            console.log(err)
        }
    }

    async function updateMyTeamsOrder(databaseBoundObject){
        try{
            const teamDataResponse = await fetch(`home/allTeamsOrder`, {
                method:'PATCH',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(databaseBoundObject)
    
            });

            if(teamDataResponse.status == 404){
                throw('404 error!')
            }else if(teamDataResponse.status == 400){
                throw('400 error!')
            }else if(teamDataResponse.status == 200){  
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("myTeamsOrderChangeSaved")
            }
        }catch(err){
            console.log(err)
        }
    }

    async function updateAllTeamsOrder(databaseBoundObject){
        try{
            const teamDataResponse = await fetch(`adminHome/allTeamsOrder`, {
                method:'PATCH',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(databaseBoundObject)
    
            });

            if(teamDataResponse.status == 404){
                throw('404 error!')
            }else if(teamDataResponse.status == 400){
                throw('400 error!')
            }else if(teamDataResponse.status == 200){  
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("allTeamsOrderChangeSaved")
            }
        }catch(err){
            console.log(err)
        }
    }

    async function updateTeamEnabledStatus(_id){
        const idObj = {_id}
        try{
            const teamDataResponse = await fetch(`adminHome/team/${_id}/enabledStatus`, {
                method:'PATCH',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(idObj)
    
            });

            if(teamDataResponse.status == 404){
                throw('404 error!')
            }else if(teamDataResponse.status == 400){
                throw('400 error!')
            }else if(teamDataResponse.status == 200){  
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("teamEnableStatusChangeSaved")
            }
        }catch(err){
            console.log(err)
        }
    }

    async function buildSchedule(){
        try{
            const scheduleResponse = await fetch(`adminHome/schedule`, {
                method:'GET',
                headers:{
                    'Content-Type': 'application/json'
          
                },
            });

            if(scheduleResponse.status == 404){
                throw('404 error!')
            }else if(scheduleResponse.status == 400){
                throw('400 error!')
            }else if(scheduleResponse.status == 200){  
                const data = await scheduleResponse.json()
                console.log(data)
            }
        }catch(err){
            console.log(err)
        }
    }

    // async function postLoginAttempt(databaseBoundObject){
    //     try{
    //         const logInAttemptResponse = await fetch(`/logIn`, {
    //             method:'POST',
    //             headers:{
    //                 'Content-Type': 'application/json'
          
    //             },
    //             body: JSON.stringify(databaseBoundObject)
    
    //         });

    //         if(logInAttemptResponse.status == 404){ //check these
    //             throw('404 error!')
    //         }else if(logInAttemptResponse.status == 400){
    //             throw('400 error!')
    //         }else if(logInAttemptResponse.status == 401){
    //             const errorMessage = await logInAttemptResponse.json();
    //             const errorArray = [errorMessage]
    //             events.publish('renderLoginPageRequested', errorArray)
    //         }
    //     }catch(err){
    //         console.log(err)
    //     }
    // }

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
/* harmony import */ var _src_selectorDOMBuilder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../src/selectorDOMBuilder */ "./src/selectorDOMBuilder.js");
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

        formDivWrapper.classList.add("formHidden");
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
    
            const selectorNew = _src_selectorDOMBuilder__WEBPACK_IMPORTED_MODULE_1__.selectorBuilder.runBuildSelector(primaryClass);
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

/***/ "./src/homePage/components/forms/myTeamsOrderForm.js":
/*!***********************************************************!*\
  !*** ./src/homePage/components/forms/myTeamsOrderForm.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "myTeamsOrderFormComponent": () => (/* binding */ myTeamsOrderFormComponent)
/* harmony export */ });
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../events */ "./src/events.js");


const myTeamsOrderFormComponent = (function(){
    
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("teamsOrderChangeRequested", renderAllTeamsOrderForm)
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("teamDataChangesCancelled", unrenderAllTeamsOrderForm);
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('myTeamsOrderChangeSaved', unrenderAllTeamsOrderForm);
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('teamsOrderDataUpdated', rerenderAllTeamsOrderForm)

    const formDivWrapper = document.querySelector("#entryFormDiv")
    const formDiv = document.querySelector("#entryForm");
    const body = document.querySelector("body")

    function rerenderAllTeamsOrderForm(teamsData){
        unrenderAllTeamsOrderForm()
        renderAllTeamsOrderForm(teamsData)
    }

    function renderAllTeamsOrderForm(teamsData){
        
        const elements = setElements();
        populateContent(elements, teamsData);
        setEventListeners(elements, teamsData);
    
        formDiv.appendChild(elements.content);

        formDivWrapper.classList.toggle("formHidden");
        elements.form.classList.toggle('toggleScrollBarOn')
        body.style.overflowY = "hidden"
    } 

    function unrenderAllTeamsOrderForm(){
        if(formDiv.firstChild){
            while(formDiv.firstChild){
                formDiv.removeChild(formDiv.firstChild)
            }
        }

        formDivWrapper.classList.add("formHidden");
        body.style.overflowY = 'scroll'
    }
   
    function setElements(){
        const template = document.querySelector("#teamOrderFormTemplate");
        const content = document.importNode(template.content, true);

        const form = content.querySelector('#teamOrderForm')
        const teamList = content.querySelector('#teamOrderFormTeams')
        const saveButton = content.querySelector("#saveTeamOrderButton");
        const cancelButton = content.querySelector("#cancelTeamOrderChangesButton");
    
        return {content, form, teamList, saveButton, cancelButton}
    }

    function populateContent(elements, teamsData){

        if(teamsData.length >=1){
            teamsData.forEach(function(team){
                const teamTemplate = document.querySelector('#teamOrderFormTeamTemplate');
                const teamContent = document.importNode(teamTemplate.content, true);

                const name = teamContent.querySelector('.teamOrderFormTeamName');
                const size = teamContent.querySelector('.teamOrderFormTeamSize');
                const uprankButton = teamContent.querySelector('.moveOptionUpButton');
                const downrankButton = teamContent.querySelector('.moveOptionDownButton');

                name.innerText = `Team: ${team.name}`;
                size.innerText = `Size: ${team.size}`;

                uprankButton.addEventListener('click', moveTeamRankUp);
                downrankButton.addEventListener('click', moveTeamRankDown);

                if(teamsData.length > 1 && team.rank.myTeams== 0){
                    uprankButton.remove()
                }else if(teamsData.length > 1 && team.rank.myTeams == teamsData.length-1){
                    downrankButton.remove()
                }else if(teamsData.length ==1){
                    uprankButton.remove();
                    downrankButton.remove();
                }

                elements.teamList.appendChild(teamContent)

                function moveTeamRankUp(){
                    _events__WEBPACK_IMPORTED_MODULE_0__.events.publish('modifyMyTeamsOrderClicked', {team: team, modifier: -1})
                }
                function moveTeamRankDown(){
                    _events__WEBPACK_IMPORTED_MODULE_0__.events.publish('modifyMyTeamsOrderClicked', {team: team, modifier: 1})
                }
            })
        }else{
            elements.teamList.innerText = 'No teams here!'
            elements.saveButton.disabled = true;
        }
    }

    function setEventListeners(elements){       
        elements.saveButton.addEventListener("click", saveTeamOrderData);
        elements.cancelButton.addEventListener("click", cancelTeamOrderChanges);

        function saveTeamOrderData(){
            _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("updateTeamOrderClicked")      
        }
        function cancelTeamOrderChanges(){
           _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("cancelTeamOrderChangesClicked")
        }
    }
})();



/***/ }),

/***/ "./src/homePage/components/forms/teamDataForm.js":
/*!*******************************************************!*\
  !*** ./src/homePage/components/forms/teamDataForm.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "teamDataFormComponent": () => (/* binding */ teamDataFormComponent)
/* harmony export */ });
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../events */ "./src/events.js");
/* harmony import */ var _src_selectorDOMBuilder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../src/selectorDOMBuilder */ "./src/selectorDOMBuilder.js");
/* harmony import */ var _src_timeConverter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../src/timeConverter */ "./src/timeConverter.js");




const teamDataFormComponent = (function(){
    
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("teamAddRequested", renderTeamDataForm)
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('teamDataLoaded', renderTeamDataForm)
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("teamDataChangesCancelled", unrenderTeamDataForm);
  
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("optionsModified", rerenderTeamDataForm)



    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("renderTeamDataValidationErrors", renderTeamDataValidationErrors)
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("editTeamDataSaved", unrenderTeamDataForm);
   _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('newTeamDataSaved', unrenderTeamDataForm)

    const formDivWrapper = document.querySelector("#entryFormDiv")
    const formDiv = document.querySelector("#entryForm");
    const body = document.querySelector("body")

    function rerenderTeamDataForm(teamData){
        unrenderTeamDataForm()
        renderTeamDataForm(teamData)
    }

    function renderTeamDataForm(teamData){
        
        const elements = setElements();
        populateContent(elements, teamData);
        setEventListeners(elements, teamData);
    
        formDiv.appendChild(elements.content);

        const selectors = formDiv.querySelectorAll('.selector');
        const saveButton = formDiv.querySelector('#saveTeamRequest')
        if(Array.from(selectors).filter(function(selector){
            return selector[selector.selectedIndex].value == "default"
        }).length > 0){
            saveButton.disabled = true;
        }

        formDivWrapper.classList.toggle("formHidden");
        elements.form.classList.toggle('toggleScrollBarOn')
        body.style.overflowY = "hidden"
    } 

    function unrenderTeamDataForm(){
        if(formDiv.firstChild){
            while(formDiv.firstChild){
                formDiv.removeChild(formDiv.firstChild)
            }
        }

        formDivWrapper.classList.add("formHidden");
        body.style.overflowY = 'scroll'
    }
   
    function setElements(){
        const template = document.querySelector("#teamFormTemplate");
        const content = document.importNode(template.content, true);
    
        const form = content.querySelector('#teamFormContainer')
        const teamName = content.querySelector('#formTeamName');
        const teamSize = content.querySelector('#formTeamSize');
        const saveButton = content.querySelector("#saveTeamRequest");
        const cancelButton = content.querySelector("#cancelTeamRequest");
        const addOptionButton = content.querySelector('#addTrainingOption');
        const formAllOpts = content.querySelector('#formAllOpts')
    
        return {content, form, teamName, teamSize, saveButton, cancelButton, addOptionButton, formAllOpts}
    }

    function populateContent(elements, teamData){

        elements.teamName.value = teamData.team.name

        let selectedOption
        let errorText

        const teamSizeSelectorNew = _src_selectorDOMBuilder__WEBPACK_IMPORTED_MODULE_1__.selectorBuilder.runBuildSelector('teamSize');

        if(teamSizeSelectorNew.querySelector(`option[value = "${teamData.team.size}"]`) != null){
            selectedOption = teamSizeSelectorNew.querySelector(`option[value = "${teamData.team.size}"]`)
        }else{
            selectedOption = teamSizeSelectorNew.querySelector("option[value = 'default']");
            errorText = createErrorText(teamData.teamSize, 'teamSize'); 
        }
        
        selectedOption.selected = true;
        if(selectedOption.value != "default"){
            teamSizeSelectorNew.firstChild.disabled = true;
        }

        teamSizeSelectorNew.addEventListener('change', modifyTeamSizeValue)
        teamSizeSelectorNew.addEventListener("click", disableDefaultOption)

        elements.teamSize.replaceWith(teamSizeSelectorNew)
        if(errorText != undefined){
            teamSizeSelectorNew.parentElement.appendChild(errorText)
        }
        
        teamData.team.allOpts.forEach(function(option){
            buildTeamOptionElement(elements, teamData, option)
        })

        function disableDefaultOption(){ //these are all not working, may need to use event delegation within the modules themselves
            const values = Array.from(this.children);
            values[0].disabled = true;
        }

        function modifyTeamSizeValue(){
            const value = teamSizeSelectorNew.value 
            _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("modifyTeamSizeValue", value)
        }
    }
    function buildTeamOptionElement(elements, teamData, optionData){
        const optNum = teamData.team.allOpts.indexOf(optionData) + 1; 
        const option = buildOption(teamData, optionData, optNum);
        elements.formAllOpts.appendChild(option);
    } 

    function buildOption(teamData, optionData, optNum){     
        
        const template = document.querySelector("#optionTemplate");
        const content = document.importNode(template.content, true);

        const arrowButtonsDiv = content.querySelector(".arrowButtonsDiv")
        const label = content.querySelector(".optLabel");
        const allDaysDOM = content.querySelector(".formAllDays"); 
        const addDayButton = content.querySelector(".addTrainingDay");

        label.innerHTML = `Option ${optNum}`;

        if(teamData.team.allOpts.length >1){
            const deleteButton = document.createElement("button");
            const upButton = document.createElement("button");
            const upImage = document.createElement("i");
            const downButton = document.createElement("button");
            const downImage = document.createElement("i")
            
            deleteButton.classList.add("deleteOpt");
            upButton.classList.add("myTeamsMoveUpButton");
            upImage.classList.add("arrow", "up")
            upButton.appendChild(upImage)

            downButton.classList.add("myTeamsMoveDownButton");
            downImage.classList.add("arrow", "down")
            downButton.appendChild(downImage)

            deleteButton.addEventListener("click", deleteOpt)
            upButton.addEventListener("click", moveOptionUp);
            downButton.addEventListener("click", moveOptionDown);

            deleteButton.innerText = "X"

            arrowButtonsDiv.after(deleteButton)

            if(optNum != 1 && optNum != teamData.team.allOpts.length){
                arrowButtonsDiv.appendChild(upButton)
                arrowButtonsDiv.appendChild(downButton)
            }
            if(optNum == teamData.team.allOpts.length){
                arrowButtonsDiv.appendChild(upButton)
            }
            if(optNum == 1){
                arrowButtonsDiv.appendChild(downButton)
            }
        }

        addDayButton.addEventListener("click", addDay);
        
        renderAllDaysDetails(teamData, optionData, optNum, allDaysDOM); 

        return content
        
        function addDay(){
            _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("addDay", {optNum, origin: teamData.origin})
        }

        function deleteOpt(){
            _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("deleteOpt", {optNum, origin: teamData.origin})
        }

        function moveOptionUp(){
            _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("modifyOptOrder", {optNum, modifier:-1, origin: teamData.origin}) 
        }

        function moveOptionDown(){
            _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("modifyOptOrder", {optNum, modifier:1, origin: teamData.origin})
        }
    }

    function renderAllDaysDetails(teamData, optionData, optNum, allDaysDOM){
        const allDaysDOMNew = document.createElement("div");  
        allDaysDOMNew.classList.add("formAllDays")

        optionData.forEach(function(dayData){
            const dayNum = optionData.indexOf(dayData) +1; 
            const day = buildDay(teamData, optionData, dayData, optNum, dayNum);
            allDaysDOMNew.appendChild(day);
        })
        allDaysDOM.replaceWith(allDaysDOMNew);
        
    }


    function buildDay(teamData, optionData, dayData, optNum, dayNum){     
        const template = document.querySelector("#dayTemplate");
        const content = document.importNode(template.content, true);

        const labelButtonDiv = content.querySelector(".labelDeleteDayButton");
        const label = content.querySelector(".dayLabel");
        const allDaysDetails = content.querySelector(".formAllDayDetails");
        
        label.innerHTML = `Day ${dayNum}`;
        
        if(optionData.length>1){
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("deleteDay");
            deleteButton.innerText = "X"
            
            deleteButton.addEventListener("click", deleteDay);
            labelButtonDiv.insertBefore(deleteButton, label)
        }
        
        const allDaysDetailsNew = buildDayDetails(dayData, optNum, dayNum);

        allDaysDetails.replaceWith(allDaysDetailsNew)

        return content

        function deleteDay(){
            _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("deleteDay", {optNum, dayNum, origin: teamData.origin})
        } 
    }
    

    function buildDayDetails(dayData, optNum, dayNum){        
        const template = document.querySelector("#dayDetailsTemplate");
        const content = document.importNode(template.content, true);

        const selectors = content.querySelectorAll(".selector")

        selectors.forEach(function(selection){
            const primaryClass = Array.from(selection.classList)[0];
    
            const selectorNew = _src_selectorDOMBuilder__WEBPACK_IMPORTED_MODULE_1__.selectorBuilder.runBuildSelector(primaryClass);
            let selectedOption
            let errorText
            
            if(selectorNew.querySelector(`option[value = "${dayData[primaryClass]}"]`) != null){
                selectedOption = selectorNew.querySelector(`option[value = "${dayData[primaryClass]}"]`)
            }else{
                selectedOption = selectorNew.querySelector("option[value = 'default']");
                errorText = createErrorText(dayData, primaryClass);
                
            }
            selectedOption.selected = true;
            if(selectedOption.value != "default"){
                selectorNew.firstChild.disabled = true;
            }
            
            selectorNew.addEventListener("change", publishSelectionValueChange);

            selection.replaceWith(selectorNew);
            if(errorText != undefined){
                selectorNew.parentElement.appendChild(errorText)
            }

            function publishSelectionValueChange(){
                
                const modifiedSelector = primaryClass;
                const value = selectorNew.value
                _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("modifyTeamSelectorValue", {optNum, dayNum, modifiedSelector, value})

                const selectors = formDiv.querySelectorAll('.selector');
                const saveButton = formDiv.querySelector('#saveTeamRequest')
                if(Array.from(selectors).filter(function(selector){
                    return selector[selector.selectedIndex].value == "default"
                }).length == 0){
                    saveButton.disabled = false;
                }
            }
        });

        return content 
    }

    function setEventListeners(elements, teamData){
    
       
        elements.saveButton.addEventListener("click", saveTeamData);
        elements.cancelButton.addEventListener("click", cancelTeamChanges);
        elements.addOptionButton.addEventListener("click", addOption);

        function addOption(){
            _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("addOpt", teamData)
         }

        function saveTeamData(){
            if(modifyTeamNameValue() == false){
                return
            }else{
                _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("updateTeamClicked", teamData.origin)   
            }    
        }
        function cancelTeamChanges(){
           _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("cancelTeamChangesClicked")
        }

       

        function modifyTeamNameValue(){ 
            try{
                if(teamData.team.name != "" && elements.teamName.value != teamData.team.name){
                    const confirmation = confirm(`If you submit changes, this will change team name from ${teamData.team.name} to ${elements.teamName.value}. Proceed? `);
                    if(confirmation){
                        _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("modifyTeamNameValue", elements.teamName.value)
                    }else{
                        elements.teamName.value = teamData.team.name;
                        throw false 
                    }
                }else if(teamData.team.name != elements.teamName.value){
                    _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("modifyTeamNameValue", elements.teamName.value)
                }
            }catch(err){
                return err
            }
        }
    }

    function createErrorText(data, selector){
        const errorText = document.createElement("p");
        errorText.innerText = `Your selected value of ${_src_timeConverter__WEBPACK_IMPORTED_MODULE_2__.timeValueConverter.runConvertTotalMinutesToTime(data[selector])} for ${selector} has been invalidated by a change to the opening/closing times for the facility. Speak with your supervisor to address this or change this value.`;
        return errorText;
    }

    function renderTeamDataValidationErrors(teamData){
        
        unrenderTeamDataForm();
        renderTeamDataForm(teamData);
        
        const errorList = document.querySelector("#teamDataGeneralErrorList");

        if(errorList.firstChild){
            while(errorList.firstChild){
                errorList.removeChild(errorList.firstChild)
            }
        }

        teamData.errors.forEach(function(error){
            const bullet = document.createElement("li");
            bullet.innerText = error;
            errorList.appendChild(bullet);
        })
    }

   
})();



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
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('allTeamsVerificationSaved', setDataAllTeamsVerified)

    function setHomeEventListeners(){
        setAvailabilityEventListeners();
        setTeamsEventListeners();
    }

    function setTeamsEventListeners(){
        
        const addTeamButton = document.querySelector("#teamGridAddTeam");
        const verifyAllTeamsButton = document.querySelector("#verifyButton");
        const modifyAllTeamsOrderButton = document.querySelector("#modifyMyTeamsOrder")

        const allTeams = Array.from(document.querySelector('#teamGrid').children);

        if(allTeams[0].innerText != "You have no teams listed!"){
            allTeams.forEach(function(team){
                const _id = team.dataset.teamid;
                const editTeamButton = team.querySelector(".teamGridTeamEditButton");
                const deleteTeamButton = team.querySelector(".teamGridTeamDeleteButton");
                const verifyTeamButton = team.querySelector(".teamGridTeamVerifyButton");

                editTeamButton.addEventListener("click", editTeam);
                deleteTeamButton.addEventListener("click", deleteTeam);
                verifyTeamButton.addEventListener("click", verifyTeam);

                function editTeam(){
                    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish('editTeamClicked', _id)
                }

                function deleteTeam(){
                    const confirmation = confirm('Delete this team?');
                    if(confirmation){
                        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish('deleteTeamClicked', _id)
                    }
                }

                function verifyTeam(){
                    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish('verifyTeamClicked', _id)
                }
            })
        }

        addTeamButton.addEventListener("click", addTeam);
        verifyAllTeamsButton.addEventListener("click", verifyAllTeams);
        modifyAllTeamsOrderButton.addEventListener("click", modifyAllTeamsOrder);

        function addTeam(){
            _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish('addTeamClicked')
        }
        function verifyAllTeams(){
            _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish('verifyAllTeamsClicked')
        }
        function modifyAllTeamsOrder(){
            _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish('teamOrderChangeClicked')
        }
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

    function setDataAllTeamsVerified(timeData){
        const lastVerifiedContent = document.querySelector('#verifyInfo');
        lastVerifiedContent.innerText = `The last time you verified all teams were up-to-date was: ${timeData}`;
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

    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("renderUpdatedAvailabilityBlockData", renderAvailabilityTimeBlockDay)

    function renderAvailabilityTimeBlockDay(availabilityTimeBlockDayData){
        const {day, blocks} = availabilityTimeBlockDayData
    
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

/***/ "./src/homePage/components/mainModuleRenders/teamsGrid.js":
/*!****************************************************************!*\
  !*** ./src/homePage/components/mainModuleRenders/teamsGrid.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "myTeamsDataGridComponent": () => (/* binding */ myTeamsDataGridComponent)
/* harmony export */ });
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../events */ "./src/events.js");
/* harmony import */ var _timeConverter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../timeConverter */ "./src/timeConverter.js");



const myTeamsDataGridComponent = (function(){

    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("renderUpdatedMyTeamsData", renderMyTeams)

    function renderMyTeams(teamData){

        const teamGrid = document.querySelector("#teamGrid");
        const teamGridNew = document.createElement("div");
        teamGridNew.id = "teamGrid";

        if(teamData.length > 0){
            teamData.forEach(function(team){
                const teamRow = buildTeamRow(team);
                teamGridNew.appendChild(teamRow);
            })
        }else{
            const p = document.createElement('p');
            p.innerText = 'You have no teams listed!'
            teamGridNew.appendChild(p) 
        }

        teamGrid.replaceWith(teamGridNew); 
    }

    function buildTeamRow(teamData){   
        const elements = setTemplateElements();
        setElementsContent(elements, teamData);
        setEventListeners(elements, teamData)

        return elements.content  
    }

    function setTemplateElements(){
        const template = document.querySelector("#userPageTeamBlockTemplate");
        const content = document.importNode(template.content, true);

        const div = content.querySelector(".teamGridTeam")

        const name = content.querySelector(".teamGridTeamName");
        const size = content.querySelector(".teamGridTeamSize");
        const lastVerified = content.querySelector(".teamGridTeamLastVerified");
        const optionContainer = content.querySelector(".teamGridTeamOptionContainer");
        const verifyButton = content.querySelector('.teamGridTeamVerifyButton')
        const editButton = content.querySelector('.teamGridTeamEditButton')
        const deleteButton = content.querySelector('.teamGridTeamDeleteButton')


        return {content, div, name, size, lastVerified, optionContainer, editButton, deleteButton, verifyButton}
    }

    function setElementsContent(teamElement, teamData){
        teamElement.div.setAttribute("data-teamId", teamData._id)
        teamElement.name.innerText = `${teamData.name}`;
        teamElement.size.innerText = `${teamData.size} athletes`;
        teamElement.lastVerified.innerText = `Last Verified: ${teamData.lastVerified}`; //fix this for undefined case
        
        teamData.allOpts.forEach(function(option){
            const optionTemplate = document.querySelector("#userPageTeamOptionBlockTemplate");
            const optContent = document.importNode(optionTemplate.content, true);

            const optNumDiv = optContent.querySelector(".teamGridTeamOptionNumber")
            optNumDiv.innerText = `Option ${teamData.allOpts.indexOf(option) + 1}`
            
            const dayContainer = optContent.querySelector(".teamGridTeamDayContainer");
            option.forEach(function(day){
                const dayTemplate = document.querySelector('#userPageTeamDayBlockTemplate')
                const dayContent = document.importNode(dayTemplate.content, true);

                const dayOfWeek = dayContent.querySelector('.teamGridTeamDayOfWeek');
                const startTime = dayContent.querySelector('.teamGridTeamStartTime');
                const endTime = dayContent.querySelector('.teamGridTeamEndTime');
                const inWeiss = dayContent.querySelector('.teamGridTeamInWeiss');

                dayOfWeek.innerText = `${day.dayOfWeek}`;
                startTime.innerText = `${_timeConverter__WEBPACK_IMPORTED_MODULE_1__.timeValueConverter.runConvertTotalMinutesToTime(day.startTime)}`;
                endTime.innerText = `${_timeConverter__WEBPACK_IMPORTED_MODULE_1__.timeValueConverter.runConvertTotalMinutesToTime(day.endTime)}`;
                inWeiss.innerText = `${day.inWeiss}`;

                dayContainer.appendChild(dayContent)
            })
            teamElement.optionContainer.appendChild(optContent)
        })
    }

    function setEventListeners(teamElement, teamData){
        teamElement.editButton.addEventListener("click", editTeam);
        teamElement.deleteButton.addEventListener("click", deleteTeam);
        teamElement.verifyButton.addEventListener("click", verifyTeam)

        function editTeam(){
            _events__WEBPACK_IMPORTED_MODULE_0__.events.publish('editTeamClicked', teamData._id)
        }

        function deleteTeam(){
            const confirmation = confirm('Delete this team?');
            if(confirmation){
                _events__WEBPACK_IMPORTED_MODULE_0__.events.publish('deleteTeamClicked', teamData._id)
            }
        }

        function verifyTeam(){
            _events__WEBPACK_IMPORTED_MODULE_0__.events.publish('verifyTeamClicked', teamData._id)
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
        allAvailabilityDataStable = structuredClone(userData.availabilityTimeBlocks);
        allAvailabilityDataMutable = structuredClone(allAvailabilityDataStable);
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
		
        allAvailabilityDataStable= structuredClone(allAvailabilityDataMutable);
		_src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("renderUpdatedAvailabilityBlockData", {day: blockData.day, blocks: allAvailabilityDataMutable[blockData.day]})
    }

    function setDataBlockDataDeleted(blockData){
        const {day, _id} = blockData
		const newBlocksList = allAvailabilityDataMutable[day].filter(function(block){
			return _id != block._id
		})

		allAvailabilityDataMutable[day] = newBlocksList;
		allAvailabilityDataStable = structuredClone(allAvailabilityDataMutable);
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
        availabilityModelStable = structuredClone(timeBlock);
        availabilityModelMutable = structuredClone(availabilityModelStable)

        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("availabilityBlockDataLoaded", {timeBlock: availabilityModelMutable, origin:"edit"})
    }

    function setAvailabilityDataCancelRequest(){
        availabilityModelStable = {};

        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("availabilityDataChangesCancelled") 
    }

    function addAvailabilityBlock(day){
        availabilityModelStable = structuredClone(timeBlockDefault);
        availabilityModelStable.day = day;

        availabilityModelMutable = structuredClone(availabilityModelStable);

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

/***/ "./src/homePage/models/myTeamsData.js":
/*!********************************************!*\
  !*** ./src/homePage/models/myTeamsData.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "myTeamsModel": () => (/* binding */ myTeamsModel)
/* harmony export */ });
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../events */ "./src/events.js");


const myTeamsModel = (function(){
   
    let myTeamsDataStable = [];
    let myTeamsDataMutable = [];

    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('userDataFetched', setDataNewPageRender)
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('updateMyTeamsModel', setDataNewDatabasePost);
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("editTeamClicked", editTeam)
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("deleteTeamClicked", deleteTeam)
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('teamDataDeleted', setDataTeamDataDeleted)
   
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("verifyTeamClicked", verifyTeam)
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("teamVerificationSaved", setDataTeamDataVerified)
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('verifyAllTeamsClicked', verifyAllTeams);
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('updateAllTeamsModel', setDataNewDatabasePost)
    
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('teamOrderChangeClicked', sendTeamData)
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("modifyMyTeamsOrderClicked", modifyTeamOrder);
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('updateTeamOrderClicked', saveTeamOrderChanges);
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('cancelTeamOrderChangesClicked', cancelTeamOrderChanges);
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('myTeamsOrderChangeSaved', setDataNewTeamOrder)

    //events.subscribe("workingModelValidated", addEditTeamForDatabaseUpdate)

    function setDataNewPageRender(userData){
        myTeamsDataStable = structuredClone(userData.myTeams);
        myTeamsDataMutable = structuredClone(myTeamsDataStable);
    }

    function editTeam(teamId){ 
        const thisTeam = myTeamsDataMutable.filter(function(team){
            return teamId == team._id
        })[0];
        _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("teamDataEditRequested", thisTeam);
    }

    function deleteTeam(teamId){
        _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("teamDataDeleteRequested", teamId) 
    }

    function verifyTeam(teamId){
        const thisTeam = structuredClone(myTeamsDataMutable.filter(function(team){
            return teamId == team._id
        })[0]);
        
        const now = new Date();
        const nowParsed = `${now.getMonth()+1}-${now.getDate()}-${now.getFullYear()}`

        thisTeam.lastVerified = nowParsed;

        _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("teamVerificationUpdateRequested", thisTeam) 
    }

    function verifyAllTeams(){
        const now = new Date();
        const nowParsed = `${now.getMonth()+1}-${now.getDate()}-${now.getFullYear()}`

        _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("userAllTeamsVerificationUpdateRequested", nowParsed)
    }
    

    function setDataNewDatabasePost(teamData){
		const thisTeamIndex = myTeamsDataMutable.findIndex(function(team){
			return team._id == teamData._id
		});
		if(thisTeamIndex != -1){
			myTeamsDataMutable[thisTeamIndex] = teamData
		}else{
			myTeamsDataMutable.push(teamData);
		}
		
        myTeamsDataStable = structuredClone(myTeamsDataMutable);
		_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("renderUpdatedMyTeamsData", myTeamsDataMutable)
    }

    function setDataTeamDataDeleted(_id){
		const newTeamsList = myTeamsDataMutable.filter(function(team){
			return _id != team._id
		})

		myTeamsDataMutable = newTeamsList;
		myTeamsDataStable = structuredClone(myTeamsDataMutable);
		_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("renderUpdatedMyTeamsData", myTeamsDataMutable)
	}

    function setDataTeamDataVerified(teamData){
        let thisTeam = myTeamsDataMutable.filter(function(team){
            return teamData._id == team._id
        })[0];

        for(let prop in teamData){
            thisTeam[prop] = teamData[prop]
        }

        _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("renderUpdatedMyTeamsData", myTeamsDataMutable)
    }

    function modifyTeamOrder(teamObj){
        const thisTeamIndex = myTeamsDataMutable.findIndex(function(team){
            return team._id == teamObj.team._id
        })
        
        const thisTeam = myTeamsDataMutable.splice(thisTeamIndex, 1)[0]

        myTeamsDataMutable.splice(thisTeamIndex + teamObj.modifier, 0, thisTeam);
        myTeamsDataMutable.forEach(function(thisTeam){
            thisTeam.rank.myTeams = myTeamsDataMutable.findIndex(function(teams){
                return teams._id == thisTeam._id
            })
        })     
        _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("teamsOrderDataUpdated", myTeamsDataMutable);
    }

    function sendTeamData(){
        _events__WEBPACK_IMPORTED_MODULE_0__.events.publish('teamsOrderChangeRequested', myTeamsDataMutable)
    }

    function saveTeamOrderChanges(){
        _events__WEBPACK_IMPORTED_MODULE_0__.events.publish('myTeamsOrderDataUpdateRequested', myTeamsDataMutable)
    }

    function cancelTeamOrderChanges(){
        myTeamsDataMutable = structuredClone(myTeamsDataStable);
        _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("teamDataChangesCancelled")
    }

    function setDataNewTeamOrder(){
        myTeamsDataStable = structuredClone(myTeamsDataMutable)
        _events__WEBPACK_IMPORTED_MODULE_0__.events.publish('renderUpdatedMyTeamsData', myTeamsDataMutable)
    }

    

    


})();







/***/ }),

/***/ "./src/homePage/models/singleTeamData.js":
/*!***********************************************!*\
  !*** ./src/homePage/models/singleTeamData.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "singleTeamData": () => (/* binding */ singleTeamData)
/* harmony export */ });
/* harmony import */ var _src_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../src/events */ "./src/events.js");


const singleTeamData = (function(){
    
    let teamModelStable = {};
    let teamModelMutable = {}
    
    const teamDetailsDefault = {
        name: "",
        season: "default",
        size: "default", 
        rank: {
            myTeams: null,
            allTeams: null
        },
        allOpts: null,
        coach:null,
        lastVerified: null,
        enabled: true
    }
    

    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('userDataFetched', setDefaults)
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("addTeamClicked", addTeam);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("teamDataEditRequested", setTeamDataEditRequest); 
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('cancelTeamChangesClicked', setTeamDataCancelRequest)
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("updateTeamClicked", validateChanges);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('teamDataValidated', updateTeamData);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('teamDataValidationFailed', renderTeamValidationErrors)
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("editTeamDataSaved", publishTeamUpdatesToAllTeams);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("newTeamDataSaved", addTeamDataToAllTeams);

    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("addOpt", addOption);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("deleteOpt", deleteOption);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("modifyOptOrder", modifyOptionsOrder);
   
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("addDay", addDay);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("modifyTeamSelectorValue", modifySelectorValue);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("deleteDay", deleteDay);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("modifyTeamSizeValue", modifyTeamSizeValue);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("modifyTeamNameValue", modifyTeamNameValue);

    
 
    function setDefaults(userData){
        teamDetailsDefault.coach = userData.thisUser._id
        teamDetailsDefault.season = userData.season
    }
    
    function addTeam(){
        teamModelStable = structuredClone(teamDetailsDefault);
        teamModelStable.allOpts = [[createDefaultDayDetails()]]
        teamModelMutable = structuredClone(teamModelStable)
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("teamAddRequested", {team:teamModelMutable, origin: 'add'})
    }

    function setTeamDataEditRequest(team){
        teamModelStable = structuredClone(team)
        teamModelMutable = structuredClone(teamModelStable)
    
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("teamDataLoaded", {team:teamModelMutable, origin: 'edit'}) //follow this
    }

    function setTeamDataCancelRequest(){
        teamModelStable = {};
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("teamDataChangesCancelled") 
    }

    function createDefaultDayDetails(){
        const defaultDayDetails = {
            dayOfWeek: "default",
            startTime: "default",
            endTime: "default",
            inWeiss: "default"
        };
        return defaultDayDetails
    }

    function addOption(teamData){
        teamModelMutable.allOpts.push([createDefaultDayDetails()]);
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("optionsModified", {team:teamModelMutable, origin: teamData.origin});  //what is origin again?
    }

    function deleteOption(teamData){
        const index = teamData.optNum - 1;
        teamModelMutable.allOpts.splice(index, 1);
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("optionsModified", {team:teamModelMutable, origin: teamData.origin});
    }

    function modifyOptionsOrder(teamData){
        const index = teamData.optNum - 1;
        const option = teamModelMutable.allOpts.splice(index, 1)[0];
        teamModelMutable.allOpts.splice(index + teamData.modifier, 0, option);
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("optionsModified", {team:teamModelMutable, origin: teamData.origin});
    }

    function addDay(teamData){
        const optIndex = teamData.optNum - 1;
        const optionDetails = teamModelMutable.allOpts[optIndex];
        optionDetails.push(createDefaultDayDetails());
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("optionsModified", {team:teamModelMutable, origin: teamData.origin})
    }

    function deleteDay(teamData){
        const optIndex = teamData.optNum - 1;
        const dayIndex = teamData.dayNum - 1;
        const optionDetails = teamModelMutable.allOpts[optIndex];
        optionDetails.splice(dayIndex, 1);
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("optionsModified", {team:teamModelMutable, origin: teamData.origin})
    }

    function modifySelectorValue(teamData){
        const optIndex = teamData.optNum - 1;
        const dayIndex = teamData.dayNum - 1;
        teamModelMutable.allOpts[optIndex][dayIndex][teamData.modifiedSelector] = teamData.value
    }

    function modifyTeamSizeValue(size){ //fix thsese
        teamModelMutable.size = size;
    }

    function modifyTeamNameValue(name){ //fix theses
        teamModelMutable.name = name
    }   

    function validateChanges(origin){
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("teamValidationRequested", {teamData: teamModelMutable, origin})
    }

    function updateTeamData(validatedData){
        if(validatedData.origin == "edit"){
			_src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("teamUpdateRequested", validatedData.teamData) 
		}else{
			_src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("newTeamAdditionRequested", validatedData.teamData)
		}
    }

    function renderTeamValidationErrors(validationErrorData){
        const {errors, origin} = validationErrorData
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("renderTeamDataValidationErrors", {team: teamModelMutable, errors, origin})
    }

    function publishTeamUpdatesToAllTeams(){
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("updateAllTeamsModel", teamModelMutable)
    }

    function addTeamDataToAllTeams(_id){
        teamModelMutable._id = _id;
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("updateAllTeamsModel", teamModelMutable);
    }

})();




/***/ }),

/***/ "./src/selectorDOMBuilder.js":
/*!***********************************!*\
  !*** ./src/selectorDOMBuilder.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "selectorBuilder": () => (/* binding */ selectorBuilder)
/* harmony export */ });
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./events */ "./src/events.js");
/* harmony import */ var _timeConverter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./timeConverter */ "./src/timeConverter.js");



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
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('setNewSelectorRanges', setSelectorRanges)
    
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



/***/ }),

/***/ "./src/validators/teamValidator.js":
/*!*****************************************!*\
  !*** ./src/validators/teamValidator.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "teamValidator": () => (/* binding */ teamValidator)
/* harmony export */ });
/* harmony import */ var _src_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/events */ "./src/events.js");
/* harmony import */ var _timeConverter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../timeConverter */ "./src/timeConverter.js");



const teamValidator = (function(){

    let facilityData

    //ensure startTime is NOT => endTime

    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('userDataFetched', setFacilityData)
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("teamValidationRequested", validateAllInputs);

    function setFacilityData(userData){
        facilityData = userData.facilityData
    }

    function validateAllInputs(teamDataObj){ //make use of origin as necessary
        const errorArray = [];

        validateName(teamDataObj.teamData, errorArray);
        validateSize(teamDataObj.teamData, errorArray);
        validateSchedulePreferences(teamDataObj.teamData, errorArray);

        if(errorArray.length == 0){
            _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("teamDataValidated", teamDataObj)
        }else{
            _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("teamDataValidationFailed", {errors: errorArray, origin: teamDataObj.origin})
        }
    }

    function validateName(teamData, array){
        const name = teamData.name;
        const nameRegex = /[^A-Za-z0-9]/;
        try{
            if(nameRegex.test(name)){
                throw("Team names can only include letters and numbers (no spaces or symbols).");
            }else if(name == ""){
                throw("Team name must have a value.");
            }
        }catch(err){
            array.push(err)
        }
    }

    function validateSize(teamData,array){
        const size = teamData.size;
        try{
            if(size == "default"){
                throw("Team size must have a value.")
            }else if(size > facilityData.facilityMaxCapacity){
                throw("Team size is greater than max size value. Discuss max size value changes with administrator.")
            }
        }catch(err){
            array.push(err)
        }
    }

    function validateSchedulePreferences(teamData,array){
        teamData.allOpts.forEach(function(option){
            const optNum = teamData.allOpts.indexOf(option) + 1;
            const validatedDayArray = [];

            option.forEach(function(day){
                const dayNum = option.indexOf(day)+1;
                catchInvalidInputs();
                catchConflictingDays();

                function catchInvalidInputs(){
                    for(const prop in day){
                        try{
                            if(day[prop] == "default"){
                                throw(`Option ${optNum}: Day ${dayNum}: ${prop} must have a value.`);
                            }else if((prop == "startTime" || prop == "endTime") && (day[prop] < facilityData.facilityOpen || day[prop] > facilityData.facilityClose)){
                                throw(`Option ${optNum}: Day ${dayNum}: ${prop} is outside operating hours. Discuss operating hour changes with administrator.`);
                            }
                        }catch(err){
                            array.push(err)
                        }  
                    }

                    try{
                        if(day.startTime >= day.endTime){
                            throw(`Option ${optNum} Day ${dayNum}'s startTime ${_timeConverter__WEBPACK_IMPORTED_MODULE_1__.timeValueConverter.runConvertTotalMinutesToTime(day.startTime)} is equal to or later than endTime ${_timeConverter__WEBPACK_IMPORTED_MODULE_1__.timeValueConverter.runConvertTotalMinutesToTime(day.endTime)}`)
                        }
                    }catch(err){
                        array.push(err)
                    }
                }

                function catchConflictingDays(){
                    try{
                        validatedDayArray.forEach(function(validatedDay){
                            const validatedNum = validatedDayArray.indexOf(validatedDay) + 1 ;
                            if(validatedDay.dayOfWeek == day.dayOfWeek && validatedDay.startTime == day.startTime && validatedDay.inWeiss == day.inWeiss){
                                throw(`Option ${optNum}: Day ${validatedNum} and Day ${dayNum} are duplicates.`);
                            }else if(validatedDay.dayOfWeek == day.dayOfWeek && day.startTime < validatedDay.startTime && day.endTime > validatedDay.endTime){
                                throw(`Option ${optNum}: Day ${dayNum}'s session runs through Day ${validatedNum}'s session.`);
                            }else if(validatedDay.dayOfWeek == day.dayOfWeek && day.startTime > validatedDay.startTime && day.startTime < validatedDay.endTime){
                                throw(`Option ${optNum}: Day ${dayNum}'s start time is in the middle of  Day ${validatedNum}'s session.`);
                            }else if(validatedDay.dayOfWeek == day.dayOfWeek && day.endTime < validatedDay.endTime && day.endTime > validatedDay.startTime){
                                throw(`Option ${optNum}: Day ${dayNum}'s end time is in the middle of  Day ${validatedNum}'s session.`);
                            }   
                        })
                        validatedDayArray.push(day)
                    }catch(err){
                        array.push(err)
                    }
                }
            })
        })
    }

})();



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
/* harmony import */ var _src_homePage_components_forms_myTeamsOrderForm__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../src/homePage/components/forms/myTeamsOrderForm */ "./src/homePage/components/forms/myTeamsOrderForm.js");
/* harmony import */ var _src_homePage_components_forms_teamDataForm__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../src/homePage/components/forms/teamDataForm */ "./src/homePage/components/forms/teamDataForm.js");
/* harmony import */ var _src_homePage_components_mainModuleRenders_teamsGrid__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../src/homePage/components/mainModuleRenders/teamsGrid */ "./src/homePage/components/mainModuleRenders/teamsGrid.js");
/* harmony import */ var _src_validators_teamValidator__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../src/validators/teamValidator */ "./src/validators/teamValidator.js");
/* harmony import */ var _src_homePage_models_myTeamsData__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../src/homePage/models/myTeamsData */ "./src/homePage/models/myTeamsData.js");
/* harmony import */ var _src_homePage_models_singleTeamData__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../src/homePage/models/singleTeamData */ "./src/homePage/models/singleTeamData.js");
/* harmony import */ var _src_databasePost__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../src/databasePost */ "./src/databasePost.js");



















window.onload = setScriptData;

async function setScriptData(){
    try{
        const userPageJSON = await fetch('home/userData');
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