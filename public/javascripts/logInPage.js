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
            }else if(userDataResponse.status == 303){
                const {userId, season} = await userDataResponse.json();
                const pseudoAnchor = document.createElement('a');
                pseudoAnchor.href = `/user/${userId}/${season}/adminHome`;
                pseudoAnchor.click();
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
            }else if(teamDataResponse.status == 303){
                const {userId, season} = await teamDataResponse.json();
                const pseudoAnchor = document.createElement('a');
                pseudoAnchor.href = `/user/${userId}/${season}/home`;
                pseudoAnchor.click();
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
                console.log(scheduleResponse)
                const data = await scheduleResponse.blob();
                console.log(data);
                const anchor = document.createElement('a');
                anchor.href = window.URL.createObjectURL(data);
                anchor.download = 'schedule.xlsx';
                anchor.click();
            }
        }catch(err){
            console.log(err)
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

/***/ "./src/loginPage/loginPageRender.js":
/*!******************************************!*\
  !*** ./src/loginPage/loginPageRender.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loginPageRender": () => (/* binding */ loginPageRender)
/* harmony export */ });

const loginPageRender = (function(){

    const form = document.querySelector('#logInForm')
    const userNameEntry = document.querySelector('#logInUserName');
    const passWordEntry = document.querySelector('#logInPassword');
    const submitButton = document.querySelector('#loginAttemptButton');
    const errorList = document.querySelector('#errorList')

    setEventListeners();

    function setEventListeners(){

        submitButton.addEventListener('click', submitLogInAttempt)

        async function submitLogInAttempt(e){
            unrenderErrorList()

            const errors = testSubmitInput()
            if(errors.length > 0){
                e.preventDefault();
                errors.forEach(function(error){
                    const errorNode = document.createElement('li');
                    errorNode.innerText = error
                    errorList.appendChild(errorNode)
                })
            }else{
                try{
                    form.submit();
                }catch(err){
                    if(err.status == 404){
                        throw('404 error!')
                    }else if(err.status == 400){
                        throw('400 error!')
                    }else if(err.status == 401){
                        const errorMessage = await err.json();
                        const errorArray = [errorMessage]
                        renderLoginPage(errorArray)
                    }
                }
            }
        }
    }

    function testSubmitInput(){
        const errorArray = []
    
        const regex = /[^A-Za-z0-9]/;
        if(regex.test(userNameEntry.value) || regex.test(passWordEntry.value)){
                const errorText = 'Invalid username/password combination';
                errorArray.push(errorText)
        }

        if(!userNameEntry.value){
                const errorText = 'Username must have value';
                errorArray.push(errorText)
        }

        if(!passWordEntry.value){
                const errorText = 'Password must have value';
                errorArray.push(errorText)
        }

        return errorArray
    }   

    function renderLoginPage(errors){
        userNameEntry.value = "";
        passWordEntry.value = "";

        unrenderErrorList()

        if(errors.length>0){
            errors.forEach(function(error){
                const errorNode = document.createElement('li');
                errorNode.innerText = error
                errorList.appendChild(errorNode)
            })
        }
    }

    function unrenderErrorList(){
        if(errorList.firstChild){
            while(errorList.firstChild){
                errorList.removeChild(errorList.firstChild)
            }
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
/*!**********************!*\
  !*** ./src/login.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/events */ "./src/events.js");
/* harmony import */ var _src_databasePost__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/databasePost */ "./src/databasePost.js");
/* harmony import */ var _src_loginPage_loginPageRender__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/loginPage/loginPageRender */ "./src/loginPage/loginPageRender.js");





window.onload = setScriptData
async function setScriptData(){ 
    try{
        const mediaQuery = window.matchMedia('(max-width: 485px)');
        checkWidth(mediaQuery);
        mediaQuery.addEventListener('change', checkWidth)
    }catch(err){
        console.log(err)
    }
}

function checkWidth(e){//mobile devices don't always have xlsx reader, so attempting to restrict viewport, but not having success
    if(e.matches){
        const body = document.querySelector('body');
        const newText = document.createElement('p');
        newText.innerText = 'This program is designed for PCs, laptops and tablets, due to general support for XLSX documents on those platforms. Please use one of the recommended devices for best experience.'
        const children = Array.from(document.querySelectorAll('body *'));
        if(children.length >0){
            children.forEach(function(child){
                child.remove();
            })
        }

        body.appendChild(newText)
        throw('Window size not appropriate')
    }
}
})();

/******/ })()
;
//# sourceMappingURL=logInPage.js.map