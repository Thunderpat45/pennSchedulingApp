/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

const adminHomeMain = (function(){

    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("adminDataSet", setAdminEventListeners);

    function setAdminEventListeners(){
        setFacilityDataListeners()
        setUserDataListeners();
        setAdminTimeBlocksEventListeners();
        setTeamListeners();
        setAllTeamOrderEventListener()
        setSchedulerEventListener()
    }

    function setFacilityDataListeners(){
        const facilityEditButton = document.querySelector("#adminMainPageFacilitySelectorsEditButton");
        facilityEditButton.addEventListener("click", requestAdminDataEdit);
    
        function requestAdminDataEdit(){
            _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("editFacilityDataClicked");
        }
    }

    function setUserDataListeners(){
        const addUserButton = document.querySelector("#adminUsersGridAddUser");
        
        const allUsers = Array.from(document.querySelectorAll(".adminUserGridUser"));
        if(allUsers.length >0){
            allUsers.forEach(function(user){
                const _id = user.dataset.userid;
                const editButton = user.querySelector(".adminUserGridUserEditButton");
                const deleteButton = user.querySelector(".adminUserGridUserDeleteButton")

                editButton.addEventListener("click", editUser);
                deleteButton.addEventListener("click", deleteUser);

                function editUser(){
                    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("editUserClicked", _id)
                }
                function deleteUser(){
                    const confirmation = confirm("Delete this user?");
                    if(confirmation){
                        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("deleteUserRequested", _id)
                    }
                }
            })
        }

        addUserButton.addEventListener("click", addUser)

        function addUser(){
            _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("addUserClicked")
        }
    }

    function setAdminTimeBlocksEventListeners(){
        const adminTimeBlockDays = Array.from(document.querySelector("#adminMainPageAddAvailabilityBlockAllUsersGrid").children);

        adminTimeBlockDays.forEach(function(day){
            const dayString = day.querySelector("h3").innerText;
            const addBlockButton = day.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockAddButton");

            addBlockButton.addEventListener("click", addTimeBlock);

            const dayAllBlocks = Array.from(day.querySelectorAll(".adminMainPageAddAvailabilityBlockAllUsersAllBlocks > div"));
            if(dayAllBlocks.length > 0 ){
                dayAllBlocks.forEach(function(timeBlock){
                    const _id = timeBlock.dataset.timeblockid
                    const editBlockButton = timeBlock.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockEditButton");
                    const deleteBlockButton = timeBlock.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockDeleteButton")

                    editBlockButton.addEventListener("click", editTimeBlock);
                    deleteBlockButton.addEventListener("click", deleteTimeBlock);

                    function editTimeBlock(){
                        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("editAdminAvailabilityClicked", {day:dayString, _id})
                    }

                    function deleteTimeBlock(){
                        const confirmation = confirm("Delete this time block?");
                        if(confirmation){
                            _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("deleteAdminAvailabilityClicked", {day:dayString, _id})
                        }
                    }
                })
            }

            function addTimeBlock(){
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("addAdminTimeBlockClicked", dayString)
            }
        })
    }

    function setTeamListeners(){
        const teams = Array.from(document.querySelectorAll("#adminMainPageTeamGrid > div"));
        teams.forEach(function(team){
            const _id = team.dataset.teamid;
            const disableButton = team.querySelector('.adminMainPageTeamGridTeamDisableButton')

            disableButton.addEventListener('click', publishEnabledStatusChange)

            function publishEnabledStatusChange(){
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish('enabledStatusChangeClicked', _id)
            }
        })
    }

    function setAllTeamOrderEventListener(){
        const modifyAllTeamOrderButton = document.querySelector('#modifyAdminRanksButton');

        modifyAllTeamOrderButton.addEventListener('click', requestTeamOrderChange)

        function requestTeamOrderChange(){
            _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish('adminTeamOrderChangeClicked')
        }
    }

    function setSchedulerEventListener(){
        const scheduleBuilder = document.querySelector('#runScheduleBuilderButton');

        scheduleBuilder.addEventListener('click', requestScheduleBuild)

        function requestScheduleBuild(){
            _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish('scheduleBuildRequested')
        }
    }


})()



   
    

/***/ }),

/***/ "./src/adminHomePage/components/forms/adminTimeBlockForm.js":
/*!******************************************************************!*\
  !*** ./src/adminHomePage/components/forms/adminTimeBlockForm.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "adminTimeBlockDataFormComponent": () => (/* binding */ adminTimeBlockDataFormComponent)
/* harmony export */ });
/* harmony import */ var _src_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../src/events */ "./src/events.js");
/* harmony import */ var _src_selectorDOMBuilder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../src/selectorDOMBuilder */ "./src/selectorDOMBuilder.js");
/* harmony import */ var _src_timeConverter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../src/timeConverter */ "./src/timeConverter.js");





const adminTimeBlockDataFormComponent = (function(){

    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('adminAvailabilityBlockAddRequested', renderTimeBlockDataForm);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('adminBlockDataLoaded', renderTimeBlockDataForm);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('adminAvailabilityDataChangesCancelled', unrenderTimeBlockDataForm);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("renderAdminBlockValidationErrors", renderAdminBlockDataValidationErrors)
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("editAdminBlockDataSaved", unrenderTimeBlockDataForm);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('newAdminBlockDataSaved', unrenderTimeBlockDataForm)



    const formDivWrapper = document.querySelector("#entryFormDiv")
    const formDiv = document.querySelector("#entryForm");
    

    function renderTimeBlockDataForm(adminTimeBlockDayData){
        
    
        const elements = setElements();
        populateContent(elements, adminTimeBlockDayData);
        setEventListeners(elements, adminTimeBlockDayData);
    
        formDiv.appendChild(elements.content);

        const selectors = formDiv.querySelectorAll('.selector');
        const saveButton = formDiv.querySelector('#adminDayTimeBlockFormSaveButton')
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
        const template = document.querySelector("#adminDayTimeBlockFormTemplate");
        const content = document.importNode(template.content, true);
    
        const dayLabel = content.querySelector('h3');
        const timeBlockSelectors = content.querySelectorAll(".selector");  
        const startDiv = content.querySelector("#adminDayTimeBlockSelectorsStart")
        const endDiv =   content.querySelector("#adminDayTimeBlockSelectorsEnd")              
        const saveButton = content.querySelector("#adminDayTimeBlockFormSaveButton");
        const cancelButton = content.querySelector("#adminDayTimeBlockFormCancelButton");
    
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
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("modifyAdminTimeBlockSelectorValue", {modifiedSelector, value})

                const selectors = formDiv.querySelectorAll('.selector');
                const saveButton = formDiv.querySelector('#adminDayTimeBlockFormSaveButton')
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
            _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("updateAdminBlockClicked", timeBlockData.origin);
        }
        function cancelTimeBlockChanges(){
            _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("cancelAdminBlockChangesClicked")
        }
    }
    
    function createErrorText(data, selector){
        const errorText = document.createElement("p");
        errorText.innerText = `Your selected value of ${_src_timeConverter__WEBPACK_IMPORTED_MODULE_2__.timeValueConverter.runConvertTotalMinutesToTime(data[selector])} for ${selector} has been invalidated by a change to the opening/closing times for the facility. Speak with your supervisor to address this or change this value.`;
        return errorText;
    }

    function renderAdminBlockDataValidationErrors(blockData){
        
        unrenderTimeBlockDataForm();
        renderTimeBlockDataForm(blockData);
        
        const errorList = document.querySelector("#adminDayTimeBlockGeneralErrorList");

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

/***/ "./src/adminHomePage/components/forms/allTeamsOrderForm.js":
/*!*****************************************************************!*\
  !*** ./src/adminHomePage/components/forms/allTeamsOrderForm.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "allTeamsOrderFormComponent": () => (/* binding */ allTeamsOrderFormComponent)
/* harmony export */ });
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../events */ "./src/events.js");


const allTeamsOrderFormComponent = (function(){
    
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("allTeamsOrderChangeRequested", renderAllTeamsOrderForm)
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("allTeamsDataChangesCancelled", unrenderAllTeamsOrderForm);
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('allTeamsOrderChangeSaved', unrenderAllTeamsOrderForm);
    _events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('allTeamsOrderDataUpdated', rerenderAllTeamsOrderForm)

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
        const template = document.querySelector("#adminTeamOrderFormTemplate");
        const content = document.importNode(template.content, true);

        const form = content.querySelector('#adminTeamOrderForm')
        const teamList = content.querySelector('#adminTeamOrderFormTeams')
        const saveButton = content.querySelector("#saveAdminTeamOrderButton");
        const cancelButton = content.querySelector("#cancelAdminTeamOrderChangesButton");
    
        return {content, form, teamList, saveButton, cancelButton}
    }

    function populateContent(elements, teamsData){

        if(teamsData.length >=1){
            teamsData.forEach(function(team){
                const teamTemplate = document.querySelector('#adminTeamOrderFormTeamTemplate');
                const teamContent = document.importNode(teamTemplate.content, true);

                const name = teamContent.querySelector('.adminTeamOrderFormTeamName');
                const size = teamContent.querySelector('.adminTeamOrderFormTeamSize');
                const uprankButton = teamContent.querySelector('.moveOptionUpButton');
                const downrankButton = teamContent.querySelector('.moveOptionDownButton');

                name.innerText = `Team: ${team.name}`;
                size.innerText = `Size: ${team.size}`;

                uprankButton.addEventListener('click', moveTeamRankUp);
                downrankButton.addEventListener('click', moveTeamRankDown);

                if(teamsData.length > 1 && team.rank.allTeams== 0){
                    uprankButton.remove()
                }else if(teamsData.length > 1 && team.rank.allTeams == teamsData.length-1){
                    downrankButton.remove()
                }else if(teamsData.length ==1){
                    uprankButton.remove();
                    downrankButton.remove();
                }

                elements.teamList.appendChild(teamContent)

                function moveTeamRankUp(){
                    _events__WEBPACK_IMPORTED_MODULE_0__.events.publish('modifyAllTeamsOrderClicked', {team: team, modifier: -1})
                }
                function moveTeamRankDown(){
                    _events__WEBPACK_IMPORTED_MODULE_0__.events.publish('modifyAllTeamsOrderClicked', {team: team, modifier: 1})
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
            _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("updateAllTeamsOrderClicked")      
        }
        function cancelTeamOrderChanges(){
           _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("cancelAllTeamsOrderChangesClicked")
        }
    }
})();



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
/* harmony import */ var _selectorDOMBuilder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../selectorDOMBuilder */ "./src/selectorDOMBuilder.js");



const facilityDataFormComponent = (function(){

    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("adminFacilityDataEditRequested", renderFacilityDataForm);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("adminFacilityDataChangesCancelled", unrenderFacilityDataForm);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("facilityDataSaved", unrenderFacilityDataForm)
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("renderFacilityDataValidationErrors", renderFacilityDataValidationErrors)
    
    const formDivWrapper = document.querySelector("#entryFormDiv")
    const formDiv = document.querySelector("#entryForm")

    function renderFacilityDataForm(facilityDataObj){
        
        const elements = setElements();
        populateSelectors(elements, facilityDataObj);
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

    function populateSelectors(selectorElements, facilityDataObj){
        
        selectorElements.facilitySelectors.forEach(function(selector){
            const primaryClass = Array.from(selector.classList)[0];

            const selectorNew = _selectorDOMBuilder__WEBPACK_IMPORTED_MODULE_1__.selectorBuilder.runBuildSelector(primaryClass);
            
            const selectedOption = selectorNew.querySelector(`option[value = "${facilityDataObj.facilityData[primaryClass]}"]`);
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
            const confirmation = confirm("Changing facility settings from a longer to a shorter day can create bugs if other users are not informed to adjust. Please speak to other users to notify them of changes before running the schedule builder. Continue?")
            if(confirmation){
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("updateFacilityDataClicked");
            }else{
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("cancelFacilityDataChangesClicked")
            }
           
        }
        function cancelFacilityDataChanges(){
            _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("cancelFacilityDataChangesClicked") //check this path
        }
    }

    function renderFacilityDataValidationErrors(facilityDataObj){
        
        unrenderFacilityDataForm();
        renderFacilityDataForm(facilityDataObj);
        
        const errorList = document.querySelector("#adminMainPageFacilityGeneralErrorList");

        if(errorList.firstChild){
            while(errorList.firstChild){
                errorList.removeChild(errorList.firstChild)
            }
        }

        facilityDataObj.errors.forEach(function(error){
            const bullet = document.createElement("li");
            bullet.innerText = error;
            errorList.appendChild(bullet);
        })
    }
})()









/***/ }),

/***/ "./src/adminHomePage/components/forms/userForm.js":
/*!********************************************************!*\
  !*** ./src/adminHomePage/components/forms/userForm.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "userDataFormComponent": () => (/* binding */ userDataFormComponent)
/* harmony export */ });
/* harmony import */ var _src_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../src/events */ "./src/events.js");


const userDataFormComponent = (function(){

    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("userDataLoaded", renderUserDataForm); 
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("newUserModelBuilt", renderUserDataForm)
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("userDataChangesCancelled", unrenderUserDataForm);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("editUserDataSaved", unrenderUserDataForm)
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("newUserDataSaved", unrenderUserDataForm);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("renderUserValidationErrors", renderUserDataValidationErrors)

    const formDivWrapper = document.querySelector("#entryFormDiv")
    const formDiv = document.querySelector("#entryForm");

    function renderUserDataForm(userData){

        const elements = setElements();
        populateFields(elements, userData.userData);
        setEventListeners(elements, userData);

        formDiv.appendChild(elements.content);
        formDivWrapper.classList.toggle("formHidden");
    } 

    function unrenderUserDataForm(){
        if(formDiv.firstChild){
            while(formDiv.firstChild){
                formDiv.removeChild(formDiv.firstChild)
            }
        }

        formDivWrapper.classList.toggle("formHidden");
    }

    function setElements(){
        const template = document.querySelector("#adminUserGeneratorTemplate");
        const content = document.importNode(template.content, true);

        const name = content.querySelector("#userGeneratorName");                  
        const privilege = content.querySelector("#userGeneratorPrivilege");
        const color = content.querySelector("#userGeneratorColor");
        const password = content.querySelector('#userGeneratorPassword');
        const passwordDiv = content.querySelector('#userGeneratorPasswordDiv')

        const saveButton = content.querySelector("#userGeneratorSaveButton");
        const cancelButton = content.querySelector("#userGeneratorCancelButton"); 

        return {content, name, privilege, color, saveButton, cancelButton, password, passwordDiv}
    }

    function populateFields(userElements, userData){
        userElements.name.value = userData.name;
        if(userData.privilegeLevel == true){
            userElements.privilege.checked = true;
        }
        userElements.color.value = userData.color;
    }

    function setEventListeners(userElements, userValues){
        const userData = userValues.userData;
        const origin = userValues.origin

        if(origin == 'edit'){
            userElements.passwordDiv.remove();
        }
       
        userElements.saveButton.addEventListener("click", saveUserData);
        userElements.cancelButton.addEventListener("click", cancelUserChanges);

        //extract these functions to outer level, as to not recreate them each time
        function saveUserData(){
            
            if(modifyUserNameValue() == false){
                return
            }else{
                verifyColorChange();
                updateUserPrivilege();
                verifyPasswordValue();
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("updateUserDataClicked", origin)   
            }       
        }

        function cancelUserChanges(){
            _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("cancelUserDataChangesClicked")
        }

        function modifyUserNameValue(){ 
            try{
                if(userData.name != "" && userElements.name.value != userData.name){
                    const confirmation = confirm(`If you submit changes, this will change the user name from ${userData.name} to ${userElements.name.value}. Proceed? `);
                    if(confirmation){
                        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("modifyUserNameValue", userElements.name.value)
                    }else{
                        userElements.name.value = userData.name;
                        throw false 
                    }
                }else if(userData.name != userElements.name.value){
                    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("modifyUserNameValue", userElements.name.value)
                } 
            }catch(err){
                return err
            }
        }

        function verifyPasswordValue(){
            if(userElements.password){
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish('modifyUserPasswordValue', userElements.password.value)
            } 
        }

        function updateUserPrivilege(){
            
            if(userElements.privilege.checked != userData.privilegeLevel){
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("modifyUserPrivilegeLevelValue", userElements.privilege.checked)
            } 
        }

        function verifyColorChange(){
            if(userData.color != userElements.color.value){
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("modifyUserColorValue", userElements.color.value)
            }
        }
    }

    function renderUserDataValidationErrors(userData){
        const {data, origin} = userData
        const renderData = {userData: data, origin}
        
        unrenderUserDataForm();
        renderUserDataForm(renderData);
        
        const errorList = document.querySelector("#userGeneratorGeneralErrorList");

        if(errorList.firstChild){
            while(errorList.firstChild){
                errorList.removeChild(errorList.firstChild)
            }
        }

        userData.errors.forEach(function(error){
            const bullet = document.createElement("li");
            bullet.innerText = error;
            errorList.appendChild(bullet);
        })
    }
})()





/***/ }),

/***/ "./src/adminHomePage/components/mainModulesRenders/adminTimeBlocksGrid.js":
/*!********************************************************************************!*\
  !*** ./src/adminHomePage/components/mainModulesRenders/adminTimeBlocksGrid.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "adminTimeBlockDataGridComponent": () => (/* binding */ adminTimeBlockDataGridComponent)
/* harmony export */ });
/* harmony import */ var _src_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../src/events */ "./src/events.js");
/* harmony import */ var _timeConverter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../timeConverter */ "./src/timeConverter.js");



const adminTimeBlockDataGridComponent = (function(){

    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("renderUpdatedAdminBlockData", renderAdminTimeBlockDay)

    function renderAdminTimeBlockDay(adminTimeBlockDayData){
        const {day, blocks} = adminTimeBlockDayData
    
        const adminBlocksDiv = document.querySelector("#adminMainPageAddAvailabilityBlockAllUsersGrid");
        const dayDiv = Array.from(adminBlocksDiv.querySelectorAll("div")).find(function(div){
            return div.firstElementChild.innerText == day;
        });
        const dayAllBlocksDiv = dayDiv.querySelector(".adminMainPageAddAvailabilityBlockAllUsersAllBlocks");
        const dayAllBlocksDivNew = document.createElement("div");
        dayAllBlocksDivNew.classList.add("adminMainPageAddAvailabilityBlockAllUsersAllBlocks")
    
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
        const template = document.querySelector("#adminMainPageAddAvailabilityBlockAllUsersBlockTemplate");
        const content = document.importNode(template.content, true);
    
        const main = content.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlock");
        const startTimeText = content.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockStart > p")
        const endTimeText = content.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockEnd > p")
        
        const editButton = content.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockEditButton");
        const deleteButton = content.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockDeleteButton");
        
        return {main, content, startTimeText, endTimeText, editButton, deleteButton}
    }
    
    function setElementsContent(blockElement, blockData){
        blockElement.main.setAttribute("dataTimeBlockId", blockData._id)
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
        
    }
    
    function setEventListeners(timeBlockElement, timeBlockData){
        timeBlockElement.editButton.addEventListener("click", editAdminTimeBlock);
        timeBlockElement.deleteButton.addEventListener("click", deleteAdminTimeBlock);
    
        function editAdminTimeBlock(){
            _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("editAdminAvailabilityClicked", timeBlockData)
        }
        function deleteAdminTimeBlock(){
            const confirmation = confirm("Delete this time block?");
            if(confirmation){
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("deleteAdminAvailabilityClicked", timeBlockData)
            }
            
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
/* harmony export */   "facilityDataGridComponent": () => (/* binding */ facilityDataGridComponent)
/* harmony export */ });
/* harmony import */ var _src_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../src/events */ "./src/events.js");
/* harmony import */ var _timeConverter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../timeConverter */ "./src/timeConverter.js");



const facilityDataGridComponent = (function(){

    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("renderUpdatedFacilityData", renderFacilityDataGrid); //add prompt about successful save

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
        facilityElements.openTimeText.innerText = `Open Time: ${_timeConverter__WEBPACK_IMPORTED_MODULE_1__.timeValueConverter.runConvertTotalMinutesToTime(facilityData.facilityOpen)}`; //adjust the semi-colon distance for these in original render
        facilityElements.closeTimeText.innerText = `Close Time: ${_timeConverter__WEBPACK_IMPORTED_MODULE_1__.timeValueConverter.runConvertTotalMinutesToTime(facilityData.facilityClose)}`
        facilityElements.maxCapacityText.innerText = `Max Capacity: ${facilityData.facilityMaxCapacity}`
    }
})()




/***/ }),

/***/ "./src/adminHomePage/components/mainModulesRenders/teamGrid.js":
/*!*********************************************************************!*\
  !*** ./src/adminHomePage/components/mainModulesRenders/teamGrid.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "adminTeamsGridComponent": () => (/* binding */ adminTeamsGridComponent)
/* harmony export */ });
/* harmony import */ var _src_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../src/events */ "./src/events.js");


const adminTeamsGridComponent = (function(){

    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('modifyTeamGrid', renderAdminTeams)

    function renderAdminTeams(allTeamsData){ 
        const teamsDiv = document.querySelector("#adminMainPageTeamGrid");
        const teamsDivNew = document.createElement("div")
        teamsDivNew.id = "adminMainPageTeamGrid"

        allTeamsData.forEach(function(team){
            const teamRow = buildTeamRow(team);
            teamsDivNew.appendChild(teamRow);
        })

        teamsDiv.replaceWith(teamsDivNew);
    }

    function buildTeamRow(teamData){ 
        const elements = setTemplateElements()
        setElementsContent(elements, teamData);
        setEventListeners(elements, teamData);

        if(teamData.enabled == false){ //check this out
            elements.div.classList.toggle('toggleDisable');
            elements.disableButton.innerText = "Enable"      
        }

        return elements.content 
    }

    function setTemplateElements(){
        const template = document.querySelector("#adminMainPageTeamTemplate");
        const content = document.importNode(template.content, true);

        const div = content.querySelector(".adminMainPageTeamGridTeam")
        
        const name = content.querySelector(".adminMainPageTeamGridTeamName");
        const coach = content.querySelector(".adminMainPageTeamGridTeamCoach");
        const size = content.querySelector(".adminMainPageTeamGridTeamSize");
        const rank = content.querySelector(".adminMainPageTeamGridTeamRank");

        const disableButton = content.querySelector(".adminMainPageTeamGridTeamDisableButton");

        return {content, div, name, coach, size, rank, disableButton}
    }

    function setElementsContent(teamElement, teamData){
        teamElement.div.setAttribute("data-teamId", teamData._id)
        teamElement.name.innerText = teamData.name;
        teamElement.coach.innerText = teamData.coach.name;
        teamElement.size.innerText = `${teamData.size} athletes`;
        teamElement.rank.innerText = teamData.rank.allTeams +1;
    }

    function setEventListeners(teamElement, teamData){
        
        const {_id} = teamData

        teamElement.disableButton.addEventListener("click", toggleDisable);

        function toggleDisable(){
            _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("enabledStatusChangeClicked", _id)
        }
    }
})()




/***/ }),

/***/ "./src/adminHomePage/components/mainModulesRenders/userGrid.js":
/*!*********************************************************************!*\
  !*** ./src/adminHomePage/components/mainModulesRenders/userGrid.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "userDataGridComponent": () => (/* binding */ userDataGridComponent)
/* harmony export */ });
/* harmony import */ var _src_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../src/events */ "./src/events.js");


const userDataGridComponent = (function(){

    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("renderUpdatedUserData", renderAdminUsers)

    function renderAdminUsers(adminMainPageData){

        const userGrid = document.querySelector("#adminUsersGrid");
        const userGridNew = document.createElement("div");
        userGridNew.id = "adminUsersGrid";

        adminMainPageData.forEach(function(user){
            const userRow = buildUserRow(user);
            userGridNew.appendChild(userRow);
        })

        userGrid.replaceWith(userGridNew); 
    }

    function buildUserRow(userData){   
        const elements = setTemplateElements();
        setElementsContent(elements, userData);
        setEventListeners(elements, userData)

        return elements.content  
    }

    function setTemplateElements(){
        const template = document.querySelector("#adminMainPageUserGridUserTemplate");
        const content = document.importNode(template.content, true);

        const div = content.querySelector(".adminUserGridUser")

        const name = content.querySelector(".adminUserGridUserName");
        const privilege = content.querySelector(".adminUserGridUserPrivilege");
        const lastVerified = content.querySelector(".adminUserGridUserLastVerified");
        const colorBlock = content.querySelector(".adminUserColor");

        const editButton = content.querySelector(".adminUserGridUserEditButton");
        const deleteButton = content.querySelector(".adminUserGridUserDeleteButton");

        return {content, div, name, privilege, lastVerified, colorBlock, editButton, deleteButton}
    }

    function setElementsContent(userElement, userData){
        userElement.div.setAttribute("data-userId", userData._id)
        userElement.name.innerText = `Name: ${userData.name}`;
        if(userData.privilegeLevel){
            userElement.privilege.innerText = `Privilege: Admin`
        }else{
            userElement.privilege.innerText = `Privilege: User`
        }
        userElement.lastVerified.innerText = `Last Verified: ${userData.lastVerified}`;
        userElement.colorBlock.style.backgroundColor = userData.color
    }

    function setEventListeners(userElement, userData){
        userElement.editButton.addEventListener("click", editUser);
        userElement.deleteButton.addEventListener("click", deleteUser);

        function editUser(){
            _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("editUserClicked", userData._id)
        }
        function deleteUser(){
            const confirmation = confirm("Delete this user?");
            if(confirmation){
                _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("deleteUserRequested", userData._id)
            }
        }
    }
})()
 



/***/ }),

/***/ "./src/adminHomePage/models/allAdminTimeBlocksData.js":
/*!************************************************************!*\
  !*** ./src/adminHomePage/models/allAdminTimeBlocksData.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "allAdminMainPageAdminTimeBlockModel": () => (/* binding */ allAdminMainPageAdminTimeBlockModel)
/* harmony export */ });
/* harmony import */ var _src_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../src/events */ "./src/events.js");
/* harmony import */ var _timeConverter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../timeConverter */ "./src/timeConverter.js");



const allAdminMainPageAdminTimeBlockModel = (function(){
   
    let allAdminAvailabilityDataStable = {};
    let allAdminAvailabilityDataMutable = {};
    
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("adminDataFetched", setDataNewPageRender);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("updateAllAdminBlocksModel", setDataNewDatabasePost)
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("editAdminAvailabilityClicked", editAdminAvailabilityBlock)
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("deleteAdminAvailabilityClicked", deleteAdminAvailabilityBlock);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("facilityDataAvailabiltyUpdateComparisonRequested", renderAllDays)
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('adminBlockDataDeleted', setDataBlockDataDeleted)

    function setDataNewPageRender(adminData){
        allAdminAvailabilityDataStable = structuredClone(adminData.adminTimeBlocks);
        allAdminAvailabilityDataMutable= structuredClone(allAdminAvailabilityDataStable);
    }

    function editAdminAvailabilityBlock(timeBlockObj){
        const {day, _id} = timeBlockObj;
        const block = allAdminAvailabilityDataMutable[day].filter(function(timeBlock){
            return timeBlock._id == _id;
        })[0]

        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("adminAvailabilityBlockEditRequested", block); //add publish that sends to form, need _id/day?
    }

    function deleteAdminAvailabilityBlock(timeBlockObj){
        const {day, _id} = timeBlockObj;
        const block = allAdminAvailabilityDataMutable[day].filter(function(timeBlock){
            return timeBlock._id == _id;
        })[0];

        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("adminBlockDeleteRequested", block); //send this to database, change to deleteRequested?
    }

    function setDataNewDatabasePost(blockData){
		const thisBlockIndex = allAdminAvailabilityDataMutable[blockData.day].findIndex(function(block){
			return block._id == blockData._id
		});
		if(thisBlockIndex != -1){
			allAdminAvailabilityDataMutable[blockData.day][thisBlockIndex] = blockData
		}else{
			allAdminAvailabilityDataMutable[blockData.day].push(blockData);
		}
		
        allAdminAvailabilityDataStable= structuredClone(allAdminAvailabilityDataMutable);
		_src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("renderUpdatedAdminBlockData", {day: blockData.day, blocks: allAdminAvailabilityDataMutable[blockData.day]})
    }

    function renderAllDays(facilityData){
        const tempObj = structuredClone(allAdminAvailabilityDataMutable)
        for(let day in tempObj){
            tempObj[day].forEach(function(timeBlock){
                const index = tempObj[day].indexOf(timeBlock)
                if((timeBlock.availability.startTime < facilityData.facilityOpen || 
                    timeBlock.availability.startTime > facilityData.facilityClose)&&
                    (timeBlock.availability.endTime < facilityData.facilityOpen || 
                        timeBlock.availability.endTime > facilityData.facilityClose)){
                        tempObj[day][index].availability.startTime = `Start time ${_timeConverter__WEBPACK_IMPORTED_MODULE_1__.timeValueConverter.runConvertTotalMinutesToTime( tempObj[day][index].availability.startTime)} is outside facility hours. Speak to supervisor about time changes.`
                        tempObj[day][index].availability.endTime = `End time ${_timeConverter__WEBPACK_IMPORTED_MODULE_1__.timeValueConverter.runConvertTotalMinutesToTime( tempObj[day][index].availability.endTime)} is outside facility hours. Speak to supervisor about time changes.`
                }else if(timeBlock.availability.startTime < facilityData.facilityOpen || 
                    timeBlock.availability.startTime > facilityData.facilityClose){
                        tempObj[day][index].availability.startTime = `Start time ${_timeConverter__WEBPACK_IMPORTED_MODULE_1__.timeValueConverter.runConvertTotalMinutesToTime( tempObj[day][index].availability.startTime)} is outside facility hours. Speak to supervisor about time changes.`
                }else if(timeBlock.availability.endTime < facilityData.facilityOpen || 
                        timeBlock.availability.endTime > facilityData.facilityClose){
                            tempObj[day][index].availability.endTime = `End time ${_timeConverter__WEBPACK_IMPORTED_MODULE_1__.timeValueConverter.runConvertTotalMinutesToTime( tempObj[day][index].availability.endTime)} is outside facility hours. Speak to supervisor about time changes.`
                }     
            })

            _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("renderUpdatedAdminBlockData", {day, blocks: tempObj[day]})
        }
    }
    function setDataBlockDataDeleted(blockData){
        const {day, _id} = blockData
		const newBlocksList = allAdminAvailabilityDataMutable[day].filter(function(block){
			return _id != block._id
		})

		allAdminAvailabilityDataMutable[day] = newBlocksList;
		allAdminAvailabilityDataStable= structuredClone(allAdminAvailabilityDataMutable);
		_src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("renderUpdatedAdminBlockData", {day, blocks: allAdminAvailabilityDataMutable[day]})
	}

})()



/***/ }),

/***/ "./src/adminHomePage/models/allTeamsData.js":
/*!**************************************************!*\
  !*** ./src/adminHomePage/models/allTeamsData.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "adminMainPageAllTeamsData": () => (/* binding */ adminMainPageAllTeamsData)
/* harmony export */ });
/* harmony import */ var _events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../events */ "./src/events.js");


const adminMainPageAllTeamsData = (function(){
	//no obvious work to be done here except connect teamOrder change to database, have changes written to EVERY TEAM and ensure recursion is necessary
	let allTeamsDataStable;
	let allTeamsDataMutable;

	_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("adminDataFetched", setDataNewPageRender);
	_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("allTeamsOrderChangeSaved", setDataNewTeamOrder); //add prompt for successful database post
	_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("cancelAllTeamsOrderChangesClicked", cancelTeamOrderChanges) //add prompt for change cancellation
	_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("updateAllTeamsOrderClicked", saveTeamOrderChanges) //add promprt for save changes
	_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("modifyAllTeamsOrderClicked", modifyTeamOrder);
	_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("enabledStatusChangeClicked", toggleTeamEnabled);
	_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('teamEnableStatusChangeSaved', setDataTeamEnableStatusChange)
	_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('adminTeamOrderChangeClicked', sendTeamData)

	function setDataNewPageRender(adminAllTeams){
        allTeamsDataStable = structuredClone(adminAllTeams.teams); //make sure this is correct property for database initial database fetch
        allTeamsDataMutable = structuredClone(allTeamsDataStable)
    }

	function modifyTeamOrder(teamObj){
		const thisTeamIndex = allTeamsDataMutable.findIndex(function(team){
            return team._id == teamObj.team._id
        })
        
        const thisTeam = allTeamsDataMutable.splice(thisTeamIndex, 1)[0]

        allTeamsDataMutable.splice(thisTeamIndex + teamObj.modifier, 0, thisTeam);
        allTeamsDataMutable.forEach(function(thisTeam){
            thisTeam.rank.allTeams = allTeamsDataMutable.findIndex(function(teams){
                return teams._id == thisTeam._id
            })
        })     
		_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("allTeamsOrderDataUpdated", allTeamsDataMutable);
	}

	function toggleTeamEnabled(_id){
		const teamData = allTeamsDataMutable.filter(function(team){
			return team._id == _id
		})[0]

		teamData.enabled = !teamData.enabled
		_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("teamEnabledUpdateRequested", _id)
	}

	function saveTeamOrderChanges(){
        _events__WEBPACK_IMPORTED_MODULE_0__.events.publish('allTeamsOrderDataUpdateRequested', allTeamsDataMutable)
    }

	function setDataTeamEnableStatusChange(){
		allTeamsDataStable = structuredClone(allTeamsDataMutable);
		_events__WEBPACK_IMPORTED_MODULE_0__.events.publish('modifyTeamGrid', allTeamsDataMutable)
	}

	function sendTeamData(){
        _events__WEBPACK_IMPORTED_MODULE_0__.events.publish('allTeamsOrderChangeRequested', allTeamsDataMutable)
    }

	function cancelTeamOrderChanges(){
        allTeamsDataMutable = structuredClone(allTeamsDataStable);
        _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("allTeamsDataChangesCancelled")
    }

    function setDataNewTeamOrder(){
        allTeamsDataStable = structuredClone(allTeamsDataMutable)
        _events__WEBPACK_IMPORTED_MODULE_0__.events.publish('modifyTeamGrid', allTeamsDataMutable)
    }
	
})()



/***/ }),

/***/ "./src/adminHomePage/models/allUsersData.js":
/*!**************************************************!*\
  !*** ./src/adminHomePage/models/allUsersData.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "allUsersData": () => (/* binding */ allUsersData)
/* harmony export */ });
/* harmony import */ var _src_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../src/events */ "./src/events.js");


const allUsersData = (function(){

	let allUsersDataStable;
	let allUsersDataMutable;

	_src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("adminDataFetched", setDataNewPageRender);
	_src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("updateAllUsersModel", setDataNewDatabasePost)
	_src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("deleteUserClicked", deleteUser)
	_src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("editUserClicked", editUser);
	_src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("userDataDeleted", setDataUserDataDeleted);
	

	function setDataNewPageRender(adminAllUsers){
        allUsersDataStable = structuredClone(adminAllUsers.allUsers);
		allUsersDataMutable = structuredClone(allUsersDataStable)
    }

    function setDataNewDatabasePost(userData){
		const thisUserIndex = allUsersDataMutable.findIndex(function(user){
			return user._id == userData._id
		});
		if(thisUserIndex != -1){
			allUsersDataMutable[thisUserIndex] = userData
		}else{
			allUsersDataMutable.push(userData);
		}
		
        allUsersDataStable= structuredClone(allUsersDataMutable);
		_src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("renderUpdatedUserData", allUsersDataMutable)
    }

	function deleteUser(userId){
		const thisUser = allUsersDataMutable.filter(function(user){
			return userId == user._id
		})[0];

		_src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("deleteUser", thisUser)
	}

	function editUser(userId){
		const thisUser = allUsersDataMutable.filter(function(user){
			return userId == user._id
		})[0];
		
		_src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("userDataEditRequested", thisUser);
	}

	function setDataUserDataDeleted(userId){
		const newUsersList = allUsersDataMutable.filter(function(user){
			return userId != user._id
		})

		allUsersDataMutable = newUsersList;
		allUsersDataStable= structuredClone(allUsersDataMutable);
		_src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("renderUpdatedUserData", allUsersDataMutable)
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


const adminMainPageFacilityDataModel = (function(){
  
    let adminFacilityDataStable;
    let adminFacilityDataMutable;

    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("adminDataFetched", setDataNewPageRender);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("facilityDataSaved", setDataNewDatabasePost); 
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("editFacilityDataClicked", editFacilityData) 

    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("modifyFacilitySelectorValue", modifyFacilitySelectorValue);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("updateFacilityDataClicked", validateFacilityData);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("adminFacilityDataValidated", updateFacilityData);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("cancelFacilityDataChangesClicked", cancelFacilityDataChanges);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('facilityDataValidationFailed', renderFacilityDataValidationErrors)

    function setDataNewPageRender(adminData){
        adminFacilityDataStable= structuredClone(adminData.facilityData); 
        adminFacilityDataMutable = structuredClone(adminFacilityDataStable);
    }

    function setDataNewDatabasePost(){
        adminFacilityDataStable= structuredClone(adminFacilityDataMutable);
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("setNewSelectorRanges", adminFacilityDataMutable)
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("renderUpdatedFacilityData", adminFacilityDataMutable);
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("facilityDataAvailabiltyUpdateComparisonRequested", adminFacilityDataMutable)
    }

    function createFacilityDataDeepCopy(newObj, copyObj){
        for(let prop in copyObj){
            newObj[prop] = copyObj[prop]
        }
    }

    function editFacilityData(){
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("adminFacilityDataEditRequested", {facilityData: adminFacilityDataMutable})
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
        adminFacilityDataMutable= structuredClone(adminFacilityDataStable);
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("adminFacilityDataChangesCancelled")
    }

    function renderFacilityDataValidationErrors(validationErrorData){
        const errors = validationErrorData
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("renderFacilityDataValidationErrors", {facilityData: adminFacilityDataMutable, errors})
    }
})()



/***/ }),

/***/ "./src/adminHomePage/models/timeBlockData.js":
/*!***************************************************!*\
  !*** ./src/adminHomePage/models/timeBlockData.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "singleAdminTimeBlockModel": () => (/* binding */ singleAdminTimeBlockModel)
/* harmony export */ });
/* harmony import */ var _src_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../src/events */ "./src/events.js");


const singleAdminTimeBlockModel = (function(){

    let adminAvailabilityDataStable 
    let adminAvailabilityDataMutable 

    const timeBlockDefault = {
        admin:true,
        season:null,
        day:null,
        availability:{startTime: "default", endTime: "default"}
    };
    
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('adminDataFetched', setSeason)
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("addAdminTimeBlockClicked", addAdminAvailabilityBlock);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("modifyAdminTimeBlockSelectorValue", modifyAdminAvailabilityValue);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("adminAvailabilityBlockEditRequested", setAdminAvailabilityDataEditRequest);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("cancelAdminBlockChangesClicked", setAdminAvailabilityDataCancelRequest);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("updateAdminBlockClicked", validateChanges);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("adminAvailabilityDataValidated", updateBlockData);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("adminAvailabilityDataValidationFailed", renderBlockValidationErrors);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("editAdminBlockDataSaved", publishBlockUpdatesToAllBlocks);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("newAdminBlockDataSaved", addBlockDataToAllBlocks);
    
    function setSeason(adminData){
        timeBlockDefault.season = adminData.season
    }

    function addAdminAvailabilityBlock(day){
        adminAvailabilityDataStable = structuredClone(timeBlockDefault);
        adminAvailabilityDataMutable = structuredClone(adminAvailabilityDataStable);
        adminAvailabilityDataMutable.day = day

        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("adminAvailabilityBlockAddRequested", {timeBlock: adminAvailabilityDataMutable, origin: "add"});
    }

    function setAdminAvailabilityDataEditRequest(timeBlock){
        adminAvailabilityDataStable = structuredClone(timeBlock);
        adminAvailabilityDataMutable = structuredClone(adminAvailabilityDataStable)

        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("adminBlockDataLoaded", {timeBlock: adminAvailabilityDataMutable, origin:"edit"})
    }

    function setAdminAvailabilityDataCancelRequest(){
        adminAvailabilityDataStable = {};

        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("adminAvailabilityDataChangesCancelled")
    }

    function modifyAdminAvailabilityValue(timeBlockObj){
        const {modifiedSelector, value} = timeBlockObj;
        
        adminAvailabilityDataMutable.availability[modifiedSelector] = value;
    }

    function validateChanges(origin){
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("adminBlockDataValidationRequested", {timeBlock: adminAvailabilityDataMutable, origin})
    }

    function updateBlockData(validatedBlockData){
		if(validatedBlockData.origin == "edit"){
			_src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("adminBlockUpdateRequested", validatedBlockData.timeBlock) 
		}else{
			_src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("newAdminBlockAdditionRequested", validatedBlockData.timeBlock)
		}
	}

    function renderBlockValidationErrors(validationErrorData){
        const {errors, origin} = validationErrorData
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("renderAdminBlockValidationErrors", {timeBlock: adminAvailabilityDataMutable, errors, origin})
    }

    function publishBlockUpdatesToAllBlocks(){
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("updateAllAdminBlocksModel", adminAvailabilityDataMutable)
    }

    function addBlockDataToAllBlocks(_id){
        adminAvailabilityDataMutable._id = _id;
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("updateAllAdminBlocksModel", adminAvailabilityDataMutable);
    }

})()



/***/ }),

/***/ "./src/adminHomePage/models/userData.js":
/*!**********************************************!*\
  !*** ./src/adminHomePage/models/userData.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "userData": () => (/* binding */ userData)
/* harmony export */ });
/* harmony import */ var _src_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../src/events */ "./src/events.js");


const userData = (function(){

    const userModel = {
        name: "",
        //password: coming soon
        color: "#000000",
        privilegeLevel: false,
        teams:[], 
        availability:{Sun:[], Mon:[], Tue: [], Wed: [], Thu: [], Fri: [], Sat: []}, 
        lastVerified: null,

        //both of the below properties were checkign to see which page/data was last used , cookies/sessionStorage?

        // adminPageSet: null,
        // season: "fall"
    };

    let userModelStable;
    let userModelMutable;

    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("modifyUserNameValue", setName);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("modifyUserPrivilegeLevelValue", setPrivilegeLevel)
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("modifyUserColorValue", setColor)
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe('modifyUserPasswordValue', setPassword)
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("userDataEditRequested", setUserModelEditRequest);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("addUserClicked", createNewUser);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("updateUserDataClicked", validateChanges);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("cancelUserDataChangesClicked", setUserModelCancelRequest )
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("editUserDataSaved", publishUserUpdatesToAllUsers);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("newUserDataSaved", addUserDataToAllUsers);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("userDataValidationFailed", renderUserValidationErrors);
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("userDataValidated", updateUserData)
    
    function setUserModelEditRequest(userData){
        userModelStable = structuredClone(userData)
        userModelMutable = structuredClone(userModelStable)

        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("userDataLoaded", {userData: userModelMutable, origin:"edit"})
    }

    function setUserModelCancelRequest(){
        userModelMutable = structuredClone(userModelStable);

        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("userDataChangesCancelled")
    }

    function publishUserUpdatesToAllUsers(){
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("updateAllUsersModel", userModelMutable)
    }

    function addUserDataToAllUsers(_id){
        userModelMutable._id = _id;
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("updateAllUsersModel", userModelMutable);
    }
    
    function createNewUser(){
        userModelStable = structuredClone(userModel);
        userModelMutable = structuredClone(userModelStable);

        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("newUserModelBuilt", {userData: userModelMutable, origin:"add"})
    }

    function setName(name){
        userModelMutable.name = name;
    }

    function setColor(color){
        userModelMutable.color = color
    }

    function setPrivilegeLevel(privilege){
        userModelMutable.privilegeLevel = privilege;
    }

    function setPassword(password){
        userModelMutable.password = password;
    }

    function validateChanges(origin){
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("userDataValidationRequested", {userData: userModelMutable, origin})
    }

    function renderUserValidationErrors(validationErrorData){
        const {errors, origin} = validationErrorData
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("renderUserValidationErrors", {data: userModelMutable, errors, origin})
    }

    function updateUserData(validatedUserData){
		if(validatedUserData.origin == "edit"){
			_src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("userUpdateRequested", validatedUserData.userData) 
		}else{
			_src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("newUserAdditionRequested", validatedUserData.userData)
		}
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
                const data = await scheduleResponse.blob()
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
        
        const errorArray = [];
  
        for(let prop in facilityData){
            
            if(facilityData[prop] == "default"){
                const string = "A non-default value must be selected for: ";
                string.concat(prop);
                errorArray.push(string);
            }
        }

        if(facilityData.facilityOpen >= facilityData.facilityClose){
            errorArray.push('Start time overlaps with end time!')
        }

        if(errorArray.length > 0){
            _events__WEBPACK_IMPORTED_MODULE_0__.events.publish('facilityDataValidationFailed', errorArray)
        }else{
            _events__WEBPACK_IMPORTED_MODULE_0__.events.publish("adminFacilityDataValidated", facilityData)
        }
    }
})()



/***/ }),

/***/ "./src/validators/userValidator.js":
/*!*****************************************!*\
  !*** ./src/validators/userValidator.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "userDataValidator": () => (/* binding */ userDataValidator)
/* harmony export */ });
/* harmony import */ var _src_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/events */ "./src/events.js");


const userDataValidator = (function(){
    
    _src_events__WEBPACK_IMPORTED_MODULE_0__.events.subscribe("userDataValidationRequested", validateAllInputs);
    
    //
    function validateAllInputs(adminUserData){
        const {userData, origin} = adminUserData

        const errorArray = [];

        validateUserName(userData, errorArray); 
        validateColor(userData, errorArray)
        validatePassword(userData, errorArray)

        if(errorArray.length > 0){
            _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("userDataValidationFailed", {errors: errorArray, origin});
        }else{
            _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("userDataValidated", adminUserData);
        }
    }

    function validateUserName(userModel, array){
        const userName = userModel.name;
        const userNameRegex = /[^A-Za-z0-9]/;
        try{
            if(userNameRegex.test(userName)){
                throw("User names can only include letters and numbers (no spaces or symbols).");
            }else if(userName == ""){
                throw("User name must have a value.");
            }
        }catch(err){
            array.push(err)
        }
    }

    function validatePassword(userModel, array){
        const password = userModel.password;
        const passwordRegex = /[^A-Za-z0-9]/;
        try{
            if(passwordRegex.test(password)){
                throw("Passwords can only include letters and numbers (no spaces or symbols).");
            }else if(password == ""){
                throw("Password must have a value.");
            }
        }catch(err){
            array.push(err)
        }
    }


    function validateColor(userModel, array){
        const color = userModel.color;
        try{
            if(color == "#000000"){
                throw("Color must have a value not equal to black. Black is default value, and must be changed.")
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
/* harmony import */ var _src_adminHomePage_components_mainModulesRenders_userGrid__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../src/adminHomePage/components/mainModulesRenders/userGrid */ "./src/adminHomePage/components/mainModulesRenders/userGrid.js");
/* harmony import */ var _src_adminHomePage_components_forms_userForm__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../src/adminHomePage/components/forms/userForm */ "./src/adminHomePage/components/forms/userForm.js");
/* harmony import */ var _src_adminHomePage_models_allUsersData__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../src/adminHomePage/models/allUsersData */ "./src/adminHomePage/models/allUsersData.js");
/* harmony import */ var _src_adminHomePage_models_userData__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../src/adminHomePage/models/userData */ "./src/adminHomePage/models/userData.js");
/* harmony import */ var _src_validators_userValidator__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../src/validators/userValidator */ "./src/validators/userValidator.js");
/* harmony import */ var _src_adminHomePage_components_mainModulesRenders_adminTimeBlocksGrid__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../src/adminHomePage/components/mainModulesRenders/adminTimeBlocksGrid */ "./src/adminHomePage/components/mainModulesRenders/adminTimeBlocksGrid.js");
/* harmony import */ var _src_adminHomePage_components_forms_adminTimeBlockForm__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../src/adminHomePage/components/forms/adminTimeBlockForm */ "./src/adminHomePage/components/forms/adminTimeBlockForm.js");
/* harmony import */ var _src_adminHomePage_models_allAdminTimeBlocksData__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../src/adminHomePage/models/allAdminTimeBlocksData */ "./src/adminHomePage/models/allAdminTimeBlocksData.js");
/* harmony import */ var _src_adminHomePage_models_timeBlockData__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../src/adminHomePage/models/timeBlockData */ "./src/adminHomePage/models/timeBlockData.js");
/* harmony import */ var _src_validators_availabilityValidator__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../src/validators/availabilityValidator */ "./src/validators/availabilityValidator.js");
/* harmony import */ var _src_adminHomePage_components_mainModulesRenders_teamGrid__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../src/adminHomePage/components/mainModulesRenders/teamGrid */ "./src/adminHomePage/components/mainModulesRenders/teamGrid.js");
/* harmony import */ var _src_adminHomePage_models_allTeamsData__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../src/adminHomePage/models/allTeamsData */ "./src/adminHomePage/models/allTeamsData.js");
/* harmony import */ var _src_adminHomePage_components_forms_allTeamsOrderForm__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../src/adminHomePage/components/forms/allTeamsOrderForm */ "./src/adminHomePage/components/forms/allTeamsOrderForm.js");
/* harmony import */ var _src_databasePost__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../src/databasePost */ "./src/databasePost.js");


























window.onload = setScriptData;

async function setScriptData(){
    try{
        const adminPageJSON = await fetch('adminHome/adminData'); //change this to accept userId and season
        const adminPageData = await adminPageJSON.json();
        console.log(adminPageData)
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("adminDataFetched", adminPageData);
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("adminDataSet");
        
    }catch(err){
        console.log(err)
    }
}

})();

/******/ })()
;
//# sourceMappingURL=adminHomePage.js.map