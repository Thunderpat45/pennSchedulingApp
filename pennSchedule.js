
const domElementList = {
    fillFormElement:{
        fillFormPage: document.querySelector("#fillFormPage")
    },
    requestPageElement:{
        viewRequestPage: document.querySelector("#viewRequestPage"),
        addTeamButton: document.querySelector("#teamGridAddTeam")
    },


} 
    const formTeamNameNode = document.querySelector("#formTeamName");
    const formTeamSizeNode = document.querySelector("#formTeamSize");
    const formAllOptsNode = document.querySelector("#formAllOpts")
    const updateTeamRequestNode = document.querySelector("#updateTeamRequest")
    const clearTeamRequestNode = document.querySelector("#clearTeamRequest")
    const cancelTeamRequestNode = document.querySelector("#cancelTeamRequest");
    const teamGridContainer = document.querySelector("#teamGridContainer");
    const teamGrid = document.querySelector("#teamGrid")
    const requestForm = document.querySelector("#teamRequestForm")

    const addTrainingOptionButton = document.querySelector("#addTrainingOption")






    

window.addEventListener("load", generateFormTeamSizeSelectorNodes)

function generateFormTeamSizeSelectorNodes(){
    formTeamSizeNode.addEventListener("change", formElements().disableDefaultOption)
        const defaultNode = eleFactory("option", {value: "default"})
            defaultNode.innerHTML = "--"
            formTeamSizeNode.appendChild(defaultNode)
        for(let i = 1; i < scheduleObject.slots+1; i++){
            let newOption = document.createElement("option")
                newOption.setAttribute("value", `${i}`)
                newOption.innerHTML = `${i}`
            formTeamSizeNode.appendChild(newOption)
        }
}








//create window event  listener for optDayNum and to generate divs on page load

const formElements = function formElements(){
    let dayNum;
    let optNum;

    const setOptDayNum = function setOptDayNum(e){ 
        if(e == undefined){
            optNum = 1;
            dayNum = 1
        }else{
            const target = e.target;   
            if(target.classList.contains("addTrainingDay")){ 
                const option = target.parentElement
                optNum = Array.from(formAllOptsNode.children).indexOf(option)+1
                dayNum = option.children.item(1).childElementCount+1
            }else if(target.id =="addTrainingOption" ||
                    target.id == "teamGridAddTeam" ||
                    target.id == "clearTeamRequest"){
                optNum = formAllOptsNode.childElementCount+1
                dayNum = 1;
            }else if(target.id == "editEDITTHIS" /*&& listener.classList.contains("window")*/){//make sure widnow class is accurate thing
                optNum = formAllOptsNode.childElementCount+1
            }
        }
        return {optNum, dayNum}
    };

    const getOptNum = function getOptNum(){
        return optNum
    };

    const setDayNumWindow = function setDayNumWindow(param){
        if(param.classList.contains("formAllDays")){   
            dayNum = param.childElementCount + 1
        }else{
            throw "Inappropriate DOM parameter"
        }
    };

    const getDayNum = function getDayNum(){
        return dayNum
    };

    const removePreviousOptDeleteButton = function removePreviousOptDeleteButton(){ //check for usage
        const deleteOptButtonDivOfPreviousOpt = formAllOptsNode.lastElementChild.firstElementChild;
            if(deleteOptButtonDivOfPreviousOpt.lastElementChild.classList.contains("deleteOpt")){
                deleteOptButtonDivOfPreviousOpt.removeChild(deleteOptButtonDivOfPreviousOpt.lastElementChild);
            }
    };

    const removePreviousDayDeleteButton = function removePreviousDayDeleteButton(e){//deost this work for window load of multiple days?; check for usage
        const target = e.target;
        if(target.classList.contains("addTrainingDay")){
            const previousDayDeleteButtonDiv = target.previousElementSibling.lastElementChild.firstElementChild
            if(previousDayDeleteButtonDiv.lastElementChild.classList.contains("deleteDay")){
                previousDayDeleteButtonDiv.removeChild(previousDayDeleteButtonDiv.lastElementChild)
            }
        }
    };

    const deleteCurrentOption = function deleteCurrentOption(e){
        const target = e.target;
        const currentOption = target.parentElement.parentElement
        if(optNum>1 && target.classList.contains("deleteOpt")){
            const deleteOptButton = eleFactory("button", {class: "deleteOpt"});
                    deleteOptButton.innerHTML = "X";
                    currentOption.previousElementSibling.firstElementChild.appendChild(deleteOptButton);
        }
        currentOption.parentElement.removeChild(currentOption);
    };

    const deleteCurrentDay = function deleteCurrentDay(e){
        const target = e.target;
        const currentDay = target.parentElement.parentElement;
        if(dayNum>1 && target.classList.contains("deleteDay")){
            const deleteDayButton = eleFactory("button", {class: "deleteDay"});
                deleteDayButton.innerHTML = "X";
                currentDay.previousElementSibling.firstElementChild.appendChild(deleteDayButton);
        }
        currentDay.parentElement.removeChild(currentDay);
    };
 
    const createOptDiv = function createOptDiv(){
        const formOpt = eleFactory("div", {class: "formOpt"});
        if((optNum)%2 == 0){
            formOpt.style.backgroundColor = "white";
            formOpt.style.color = "black";
        }            
            const labelDeleteOptButton = eleFactory("div", {class:"labelDeleteOptButton"});                       
                const optLabel = eleFactory("h2", {class: "optLabel"});
                    optLabel.innerHTML = `Option ${optNum}`;
                const deleteOptButton = eleFactory("button", {class: "deleteOpt"});
                    deleteOptButton.innerHTML = "X";    
                    deleteOptButton.addEventListener("click", deleteCurrentOption)
            labelDeleteOptButton.appendChild(optLabel);
            if(optNum>1){ 
                labelDeleteOptButton.appendChild(deleteOptButton);
            } 

            const allDays = eleFactory("div", {class: "formAllDays"});

            const addTrainingDayButton = eleFactory("button", {class: "addTrainingDay"});
                addTrainingDayButton.innerHTML = "Add Training Day";
                addTrainingDayButton.addEventListener("click", formNew.addFullDayField)

        formOpt.appendChild(labelDeleteOptButton);
        formOpt.appendChild(allDays);
        formOpt.appendChild(addTrainingDayButton);
            
        if(formAllOptsNode.childElementCount>0){
            removePreviousOptDeleteButton();
        }
    
        return {formOpt, allDays}
    };

    const getOptDiv = function(){
        return createOptDiv()
    };

    const createDayDiv = function createDayDiv(){ 
        const formDay = eleFactory("div", {class: "formDay"})

            const labelDeleteDayButton = eleFactory("div", {class: "labelDeleteDayButton"})          
                const dayLabel = eleFactory("h3", {class: "dayLabel"})
                    dayLabel.innerHTML = `Day ${dayNum}`
                const deleteDayButton = eleFactory("button", {class:"deleteDay"})
                    deleteDayButton.innerHTML = "X"
                    deleteDayButton.addEventListener("click", deleteCurrentDay)                     
            labelDeleteDayButton.appendChild(dayLabel)
            if(dayNum>1){
                labelDeleteDayButton.appendChild(deleteDayButton)
            }

            const dayDetails = createDayDetails()      
        
        formDay.appendChild(labelDeleteDayButton);
        formDay.appendChild(dayDetails)           
        return formDay
    };

    const getDayDiv = function getDayDiv(){  
        return createDayDiv()
    };
    
    const createDayDetails = function createDayDetails(){
        const dayDetails = eleFactory("div", {class: "formDayDetails"})  
            
            const weekArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]       
            const dayOfWeekDetails = setSelectorDetails(0, weekArray.length, 1)
            const dayOfWeek = createSelector("Day of Week", "dayOfWeek", dayOfWeekDetails, weekArray)

            const startDetails = setSelectorDetails(360,1185,15)
            const startTimeSelector = createSelector("Start Time", "startTime", startDetails)
            startTimeSelector.addEventListener("change", modifyEndTimeDefaultOption)
        
            const endDetails = setSelectorDetails(390,1215,15)
            const endTimeSelector = createSelector("End Time", "endTime", endDetails)

        dayDetails.appendChild(dayOfWeek)
        dayDetails.appendChild(startTimeSelector)
        dayDetails.appendChild(endTimeSelector)
        dayDetails.appendChild(createInWeissDiv())
        return dayDetails
    };

    const setSelectorDetails = function setSelectorDetails(start, end, incrementer){
        return{start, end, incrementer}
    };

    const createSelector= function createSelector(innHTML, ident, details, array){
//figure out way to make innHTML from ident or vice versa
        const selectorDiv = document.createElement("div")
            const selectorLabel = eleFactory("label", {htmlFor: `${ident}SelectorOpt${optNum}Day${dayNum}`}) 
                selectorLabel.innerHTML = innHTML                 
            const newBreak = document.createElement("br")     
            const selection = eleFactory("select", {class: `${ident}Selector`, id: `${ident}SelectorOpt${optNum}Day${dayNum}`}) 
                selection.addEventListener("change", disableDefaultOption)  //
                
                const defaultNode = eleFactory("option", {value: "default"})
                defaultNode.innerHTML = "--"
                selection.appendChild(defaultNode)
                for(let i = details.start; i < details.end; i+= details.incrementer){
                    let newOption = document.createElement("option")
                    if(array){//day of week
                        newOption.setAttribute("value", `${array[i]}`)
                        newOption.innerHTML = `${array[i]}`
                    }else{
                        newOption.setAttribute("value", `${i}`)
                        if(selection.id == "formTeamSize"){//team size
                            newOption.innerHTML = `${i}`
                        }else{//startTime or endTime
                            newOption.innerHTML = `${convertTotalMinutesToStandardTime(i)}` //check location of this
                        }
                    }   
                    selection.appendChild(newOption)
                } 
        selectorDiv.appendChild(selectorLabel);
        selectorDiv.appendChild(newBreak)
        selectorDiv.appendChild(selection);   
        return selectorDiv
    };

    const createInWeissDiv = function createInWeissDiv(){         
        const inWeissDiv = document.createElement("div")
            const inWeissLabel = eleFactory("p", {class: "inWeissLabel"})
                inWeissLabel.innerHTML = "In Weiss"

            const inWeissYes = createWeissRadio("yes")
            const inWeissNo = createWeissRadio("no")
                    
        inWeissDiv.appendChild(inWeissLabel)
        inWeissDiv.appendChild(inWeissYes)
        inWeissDiv.appendChild(inWeissNo)  
        return inWeissDiv
    };

    const createWeissRadio = function createWeissRadio(value){
        const frag = document.createDocumentFragment()
        const yesNo = value.charAt(0).toUpperCase() + value.slice(1)

        const input = eleFactory("input", {name: `inWeiss${yesNo}SelectorOpt${optNum}Day${dayNum}`, type: "radio", value: `${value}`})
        if(yesNo == "Yes"){
            input.checked = "true"
        }
        const label = eleFactory("label", {htmlFor: `inWeiss${yesNo}SelectorOpt${optNum}Day${dayNum}` })
            label.innerHTML = `${yesNo}`
        
        frag.appendChild(input);
        frag.appendChild(label)

        return frag
    };

    const disableDefaultOption = function disableDefaultOption(e){
        let valueArray = Array.from(e.target.children)
        valueArray[0].disabled = true
    };

    const modifyEndTimeDefaultOption = function modifyEndTimeDefaultOption(e){
        const startTimeSelectedValue = Number(e.target.value)
        const endTimeValuesArray = Array.from(e.target.parentElement.nextElementSibling.lastElementChild.children)
        endTimeValuesArray.forEach(function(time){
            let endTimeValue = time.value               
            if(endTimeValue<startTimeSelectedValue + 30 || endTimeValue == "default"){
                time.disabled = true
            }else{
                time.disabled = false
            }   
            if(endTimeValue == startTimeSelectedValue + 60){
                time.selected = true
            }else{
                time.selected = false
            }  
        })
    };

    return {getOptNum, getDayNum, getOptDiv, getDayDiv, removePreviousDayDeleteButton, setOptDayNum, setDayNumWindow, disableDefaultOption}
}



const formNew = (function formNew(){

    const addFullDayField = function addFullDayField(e){
        let target
        let currentTarget
        
        e.preventDefault();
        target = e.target
        currentTarget = e.currentTarget
        

        const newDayObject = formElements();

        newDayObject.setOptDayNum(e)
        if(target && target.id == "editTeamEDITTHIS" && currentTarget.classList.contains("window")){//check the window thing
            newDayObject.setDayNumWindow(fixthisParam)
        }
                 
        const day = newDayObject.getDayDiv()

        if(target && target.classList.contains("addTrainingDay")){
            let currentOption = target.parentElement
            newDayObject.removePreviousDayDeleteButton(e)
            currentOption.children.item(1).appendChild(day)
        }else{
            return day
        }
    };

    const addFullOptionField = function addFullOptionField(e){
        let target
        let currentTarget
        
        e.preventDefault();
        target = e.target
        currentTarget = e.currentTarget
        

        const fullDayField = addFullDayField(e)
        const newOptionObject = formElements();
        newOptionObject.setOptDayNum(e)
        const option = newOptionObject.getOptDiv();
        const allDaysDiv = option.allDays
        allDaysDiv.appendChild(fullDayField);
        if(target && (target.id =="addTrainingOption" || target.id == "teamGridAddTeam" || target.id == "clearTeamRequest")){
            formAllOptsNode.appendChild(option.formOpt)
        }else{
            return option.formOpt
        }
    }

    return{addFullDayField, addFullOptionField}
})()


addTrainingOptionButton.addEventListener("click", formNew.addFullOptionField)
clearTeamRequestNode.addEventListener("click", clearTeamForm)
cancelTeamRequestNode.addEventListener("click", cancelTeamForm)

function clearTeamForm(e){
    if(confirm("Page will reset, but saved requests will not change until you click `Update`. Continue to clear page?")){
        const allOpts = Array.from(formAllOptsNode.children);
        allOpts.forEach(function(option){
            formAllOptsNode.removeChild(option)
        })
        
        formTeamNameNode.value = "";
        formTeamSizeNode.value = "default";
        formNew.addFullOptionField(e)
    }else{
        e.preventDefault()
    }
    
}

function cancelTeamForm(e){
    if(!confirm("Current request will not save. Continue to cancel request?")){
        e.preventDefault()
    }
}


function eleFactory(el, attributes){
    const element = document.createElement(el)
    for(let key in attributes){
        element.setAttribute(key, attributes[key])
    }
    return element
}

const validateFormElements = function validateFormElements(){
    const validateNameInput = function validateNameInput(){       
        const name = formTeamNameNode.value
        const validNameRegex = /[^A-Za-z0-9]/ 
        if(validNameRegex.test(name)){
            throw("Error: Team Name can only include letters (A-Z, a-z) or numbers (0-9)")
        }else if(name == ""){
            throw("Error: Team Name field must have a value")
        }else if(name.length >30){//do something in name field to ensure short name beforehand?
            throw("Error: Team Name must be less than 30 characters")
        }
        return name
    };

    const validateSizeInput =  function validateSizeInput(){           
        const size = formTeamSizeNode.value
        if(isNaN(Number(size))){ // size === -- ??
            throw("Error: Team Size field must have a value")
        }
        return size
    };

    const getInWeissValue = function getInWeissValue(dayDetailsDiv){
        const yesValue = dayDetailsDiv.children.item(3).children.item(1)
        const noValue = dayDetailsDiv.children.item(3).children.item(3)
        if(yesValue.checked){
            return yesValue.value
        }
        else if(noValue.checked){
            return noValue.value
        }                          
    };

    const validateSchedulePreferences = function validateSchedulePreferences(){//check this for possible function segmentation
        const schedulePreferences = []
        let allOptions = Array.from(formAllOptsNode.children)                   
        allOptions.forEach(function(option){

                const optionArray = []
                let allDaysCurrentOption = Array.from(option.children.item(1).children)
                allDaysCurrentOption.forEach(function getDayDetails(day){

                        const dayArray = [] 
                        const dayDetailsDiv = day.lastElementChild
                        
                            const dayOfWeekValue = dayDetailsDiv.children.item(0).lastElementChild.value
                            if(dayOfWeekValue === "default"){
                                throw(`Option${allOptions.indexOf(option)+1} Day${allDaysCurrentOption.indexOf(day)+1} Day of Week must have a value`)
                            }
                            const startTimeValue = dayDetailsDiv.children.item(1).lastElementChild.value 
                            if(startTimeValue === "default"){
                                throw(`Option${allOptions.indexOf(option)+1} Day${allDaysCurrentOption.indexOf(day)+1} Start Time must have a value`)   
                            } 
                            const endTimeValue = dayDetailsDiv.children.item(2).lastElementChild.value
                            const inWeissValue = getInWeissValue(dayDetailsDiv)
                        
                        dayArray.push(validateNameInput())
                        dayArray.push(dayOfWeekValue);
                        dayArray.push(startTimeValue)
                        dayArray.push(endTimeValue)
                        dayArray.push(inWeissValue)
                        
                        optionArray.forEach(function validateDayDetails(existingDayArray){
                        
                            if(existingDayArray[1] == dayArray[1] && existingDayArray[2] == dayArray[2]){
                                throw(`Option${allOptions.indexOf(option)+1} has a duplicate request at day${optionArray.indexOf(existingDayArray) + 1} and day${optionArray.length + 1}`)
                            }else if(
                                existingDayArray[1] == dayArray[1] && 
                                (Number(existingDayArray[2]) > Number(dayArray[2]) && Number(existingDayArray[2]) < Number(dayArray[3]))){
                                    throw(`Option${allOptions.indexOf(option)+1} day${optionArray.length + 1} end time is in middle of day${optionArray.indexOf(existingDayArray) + 1} requested session time `)
                            }else if(
                                existingDayArray[1] == dayArray[1] && 
                                (Number(existingDayArray[3]) > Number(dayArray[2]) && Number(existingDayArray[3]) < Number(dayArray[3]))){
                                    throw(`Option ${allOptions.indexOf(option)+1} day${optionArray.length + 1} start time is in middle of day${optionArray.indexOf(existingDayArray) + 1} requested session time `)
                            }
                    })
                        optionArray.push(dayArray) 
                    })
                    schedulePreferences.push(optionArray)
                })
                return schedulePreferences 
    };

    const validateAllInputs = function validateAllInputs(){
        const name = validateNameInput()
        const size = validateSizeInput()
        const schedulePreferences = validateSchedulePreferences()                
    return {name, size, schedulePreferences}
    };



    return {validateAllInputs}
}


const togglePageDisplay = function togglePageDisplay(){//better use of CSS??; better location?
        domElementList.fillFormElement.fillFormPage.classList.toggle("hidden");
        domElementList.requestPageElement.viewRequestPage.classList.toggle("hidden") 
}

const saveFormElements = {
    updateTeamObject: function updateTeamObject(e){
        e.preventDefault()
        try{
            const request = validateFormElements().validateAllInputs()
            teamObject[request.name] = {
                "name": request.name,
                "size": request.size,
                "schedulePreferences": request.schedulePreferences
            };
            togglePageDisplay()
        }catch(error){alert(error)}   
    }
}

/*const createMainPageElements = {
    appendTeamProposalToMainPage: function appendTeamProposalToMainPage(){    // .teamGridTeamButtons
        const teamGridTeamNumber = teamGrid.childElementCount+1
        const teamGridTeam = document.createElement("div")
        teamGridTeam.classList.add("teamGridTeam")
        if(teamGridTeamNumber % 2 ==0){ 
            teamGridTeam.style.backgroundColor = "white"
            teamGridTeam.style.color = "black"
        }else{
            teamGridTeam.style.backgroundColor = "rgba(25, 25, 158, 0.8)";
            teamGridTeam.style.color = "white"
        } 
            const teamGridTeamName = document.createElement("div")
            const teamGridTeamSize = document.createElement("div")
            const teamGridTeamOptionContainer = document.createElement("div")
    
            teamGridTeamName.innerHTML = `${name}`
            teamGridTeamSize.innerHTML = `${size}`
            teamGridTeamOptionContainer.classList.add("teamGridTeamOptionContainer")
                
            schedulePreferences.forEach(function(option){
                const teamGridTeamOptionNumber = schedulePreferences.indexOf(option)+1
                const teamGridTeamOption = document.createElement("div")
                const teamGridTeamDayContainer = document.createElement("div")
                
                teamGridTeamOption.innerHTML = `${teamGridTeamOptionNumber}`
                teamGridTeamDayContainer.classList.add("teamGridTeamDayContainer")
                
                option.forEach(function(day){
                    const teamGridTeamDayOfWeek = document.createElement("div")
                    const teamGridTeamStartTime = document.createElement("div")
                    const teamGridTeamEndTime = document.createElement("div")
                    const teamGridTeamInWeiss = document.createElement("div")
    
                    teamGridTeamDayOfWeek.innerHTML = `${day[1]}`
                    teamGridTeamStartTime.innerHTML =  `${convertTotalMinutesToStandardTime(day[2])}`
                    teamGridTeamEndTime.innerHTML =  `${convertTotalMinutesToStandardTime(day[3])}`
                    teamGridTeamInWeiss.innerHTML = `${day[4]}`
                    
                    teamGridTeamDayContainer.appendChild(teamGridTeamDayOfWeek)
                    teamGridTeamDayContainer.appendChild(teamGridTeamStartTime)
                    teamGridTeamDayContainer.appendChild(teamGridTeamEndTime)
                    teamGridTeamDayContainer.appendChild(teamGridTeamInWeiss)
                })
                    
            teamGridTeamOptionContainer.appendChild(teamGridTeamOption)
            teamGridTeamOptionContainer.appendChild(teamGridTeamDayContainer)
    
            })
                    
            const teamGridTeamButtons = createMainPageElements.createTeamGridTeamButtons()
    
        teamGridTeam.appendChild(teamGridTeamName)
        teamGridTeam.appendChild(teamGridTeamSize)
        teamGridTeam.appendChild(teamGridTeamOptionContainer)
        teamGridTeam.appendChild(teamGridTeamButtons)
    
        teamGrid.appendChild(teamGridTeam)
    },

    createTeamGridTeamButtons: function createTeamGridTeamButtons(){
        const teamGridTeamButtons = document.createElement("div")
        teamGridTeamButtons.classList.add("teamGridTeamButtons")

            const teamGridTeamEditButton = document.createElement("button")
            const teamGridTeamDeleteButton = document.createElement("button")
            
            teamGridTeamEditButton.classList.add("teamGridTeamEditButton") //add EVENT LISTENERS
            teamGridTeamEditButton.innerHTML = "Edit"
            teamGridTeamDeleteButton.classList.add("teamGridTeamDeleteButton")
            teamGridTeamDeleteButton.innerHTML = "X"

        teamGridTeamButtons.appendChild(teamGridTeamEditButton)
        teamGridTeamButtons.appendChild(teamGridTeamDeleteButton)
    }


}*/

     /*determines if the day is being created as a product of adding an option (which automatically adds a day) or the add day button, 
        and assigns the value for finding the option number and day number from the event target*/
    
    
  




/*let schedulePreferencesTest = validateFormElements.populateSchedulePreferences(e) //some kind of error here?
if(Array.isArray(schedulePreferencesTest)){
    appendTeamProposalToMainPage()
}*/


function convertTotalMinutesToStandardTime(totalMins){
    let standardTime;
    let hour = Math.floor(totalMins/60)
    let meridian
        if(hour >= 13){
            hour-=12
            meridian = "p"
        }else if(hour <12){
            meridian = "a"
        }else if(hour>=12 && hour/60<13){
            meridian = "p"
        }
    let mins = totalMins%60
        if(mins == 0){
            mins = "00"
        }
    standardTime = `${hour}:${mins}${meridian}`
    return standardTime
}
  



//sorts the scheduling preferences of all teams in teamObject into teamOrderArray by their assigned "rank"
const teamOrderArray = []

function populateteamOrderArray(){
    for(const team in teamObject){
        let name = teamObject[team]
        teamOrderArray[name.rank-1] = name.schedulePreferences;

    }
}

updateTeamRequestNode.addEventListener("click", saveFormElements.updateTeamObject)

domElementList.requestPageElement.addTeamButton.addEventListener("click", togglePageDisplay)
domElementList.requestPageElement.addTeamButton.addEventListener("click", formNew.addFullOptionField)





/*evaluates all possible scheduling combinations for conflicts by coachAvailablity and spaceAvailabity, and returns up to 5 full optimized schedules,
 or, if no full schedule works with the options provided, returns the longest stack that was built during the attempt*/
function modifiedCartesian(...teamRequestArray) {
    
    /*variables for optimized schedule; longest stack built; any non-viable training day requests,
    and the total amount of teams in the list, respectively*/
    const completeSchedules = [];
    let longestStack = [];
    const conflictArray = []
    const totalTeamRequests = teamRequestArray.length-1;
 
    /*function accepting parameters of current scheduling stack to formNew point, and the index of current team (from teamRequestArray parameter) 
    being evaluated for availability, with variables for the currentTeam subArray, and the length of the currentTeam which is the amount of requests
    they submitted*/

    function helper(currentScheduleStack, currentTeamIndex){
        const currentTeam = teamRequestArray[currentTeamIndex]
        const currentTeamTotalRequests = currentTeam.length;
        
        /*loop that iterates through each request for current Team, with variables for slice of current scheduling stack, 
        a freshly addd blank schedule, and an empty array to push options that work */
        loop1:for (let currentRequestIndex=0; currentRequestIndex<currentTeamTotalRequests; currentRequestIndex++){
            let currentRequest = currentTeam[currentRequestIndex];
            const currentScheduleStackSlice = currentScheduleStack.slice(0); 
            let scheduleObject = scheduleObject.buildScheduleObjectNew();
            let bestChoice = []           
            
            //function that checks active Team availability against current scheduling stack


            checkCurrentTeamOptions


            //if a day in the current proposal cannot fit after all variations, moves on to the next full proposal set for that team
            if(checkCoachSpaceAvailability(currentRequest,currentScheduleStackSlice) == "completeConflict"){
                continue loop1;
            }
            //if successful at finding a time for each day proposed, pushes the team's option to the current schedule stack    
            currentScheduleStackSlice.push(bestChoice);

            //if the current size of the schedule stack is longer than the longest stack length, the current schedule stack becomes the longest stack
            if(currentScheduleStackSlice.length > longestStack.length){
                longestStack = currentScheduleStackSlice
            }
            /*if the stack adds every team and reaches formNew point, it is a full schedule, 
            and it is pushed to the completeSchedules array as a viable schedule to use,
            otherwise, the helper function runs again for the next team in the teamRequestArray */
            if (currentTeamIndex==totalTeamRequests){
                completeSchedules.push(currentScheduleStackSlice);
            }else{
                helper(currentScheduleStackSlice, currentTeamIndex+1);
            }
            //if 5 full schedules can be made, stops evaluating any more options, returns 5 full schedules and conflictArray
            if(completeSchedules.length == 5){
                return [completeSchedules, conflictArray];
            }
        }
    
    }

    //initiates an empty "previous team" stack, and starts evaluation of first team
    helper([], 0);

    /*if no full schedule can be made, return the longest stack that was able to be created to see the best schedule that was attempted, 
    and where it failed, otherwise, after all possible combinations have been assessed, return all full schedules created, both return with 
    conflictArray*/
    if(completeSchedules.length == 0){
        return [longestStack, conflictArray]
    }else{
        return [completeSchedules, conflictArray];
    }
}

/*object that holds coaches preferred or known unavailabilities to schedule teams */
const coachPreferencesObject = {
    Dolan:{
        Sun:[[360, 1200]],
        Mon:[],
        Tue:[],
        Wed:[],
        Thu:[],
        Fri:[],
        Sat:[[360,540], [720,1200]]

    },
        
    
    Pifer:{
        Sun:[],
        Mon:[],
        Tue:[],
        Wed:[],
        Thu:[],
        Fri:[],
        Sat:[]

    },

    Brindle:{
        Sun:[],
        Mon:[],
        Tue:[],
        Wed:[],
        Thu:[],
        Fri:[],
        Sat:[]

    },
    Walts:{
        Sun:[],
        Mon:[],
        Tue:[],
        Wed:[],
        Thu:[],
        Fri:[],
        Sat:[],

    },

    Weeks:{
        Sun:[],
        Mon:[],
        Tue:[],
        Wed:[],
        Thu:[],
        Fri:[],
        Sat:[]

    },

    Rivera:{
        Sun:[],
        Mon:[],
        Tue:[],
        Wed:[],
        Thu:[],
        Fri:[],
        Sat:[]

    },
}



/*function to build blank schedule object for each new team evaluation, for each day of week, 6am-8pm, with every 15m(we have 15 mins in our intervals for scheduling)
having x slots (available training spaces, an array to indicate each coach's availability, (accounting for requests in coachPreference Object),
 and an empty array to fill with teams that schedule in that block.
The reason for building a blank object each time was to ensure that previous attempts down a different tree line didn't "mark up" the schedule as filled
for teams that were no longer actually scheduled due to the recursion backtracking*/     

//edit formNew to be object with buildScheudleObject method, and slot as property

const scheduleObject = { //add conflict array, completeSchedules, longestStack arrays as properties
    Sun:{},
    Mon:{},
    Tue:{},
    Wed:{},
    Thu:{},
    Fri:{},
    Sat:{},
    slots: 6,
    buildScheduleObjectNew: function buildScheduleObjectNew(){
    
    
        for(let day in scheduleObject){
            if(day != "slots" && day != "buildScheduleObjectNew"){
            for(let time = 360; time<1200; time+=15){
        
                scheduleObject[day][time] =
                    {
                        slots : scheduleObject.slots,
                        strengthCoachAvailability:{
                            Dolan: "yes",
                            Pifer: "yes",
                            Rivera: "yes",
                            Brindle: "yes",
                            Walts: "yes",
                            Weeks: "yes",
                        },
                        existingTeams:[],
                    }
                for(let name in coachPreferencesObject){
                    if(coachPreferencesObject[name][day]){
                        let coach = coachPreferencesObject[name][day]
                        for(let preference = 0; preference<coach.length; preference++){ 
                            if(time>=coach[preference][0] && time<coach[preference][1]){
                                scheduleObject[day][time].strengthCoachAvailability[name] = "no"
                            }
                        }
                    }
                }
            }
        }
        }
        return scheduleObject
    },

    trackLongestStack: function trackLongestStack(){},

    checkCurrentTeamOptions: function checkCurrentTeamOptions(currentRequest, currentTeam, cachedTeamStack, schedObj, validOption){
        this.insertAllCachedTeams(cachedTeamStack, schedObj);
        if(this.checkCurrentTeamDays(currentRequest, currentTeam, schedObj, validOption) == "conflict"){
            return "conflict" //more to this?
        }
    },

    insertAllCachedTeams: function insertAllCachedTeams(cachedTeamStack, schedObj){
        for(let i = 0; i< cachedTeamStack.length; i++){
            const cachedTeam = cachedTeamStack[i];
            this.insertCachedTeam(cachedTeam, schedObj)
        }
    },

    insertCachedTeam: function insertCachedTeam(cachedTeam, schedObj){
        const totalCachedDays = Object.keys(cachedTeam.schedulePreferences).length;
        for(let i = 0; i< totalCachedDays; i++){
            const cachedDay = cachedTeam[`day${i}`];
            this.insertCachedDay(cachedDay, cachedTeam, schedObj)
        }
    },

    insertCachedDay: function insertCachedDay(cachedDay, cachedTeam, schedObj){ //recursion?
        const {dayOfWeek, startTime, endTime, inWeiss} = cachedDay;
        const {coach, size, name} = cachedTeam;
        for(let time = startTime; time < endTime; time +=15){
            schedObj[dayOfWeek][time].strengthCoachAvailability[coach] = "no"
            if(inWeiss == "yes"){
                schedObj[dayOfWeek][time].slots -= size;
                schedObj[dayOfWeek][time].existingTeams.push({name: name, coach:coach});
            }else{
                schedObj[dayOfWeek][time].existingTeams.push({name: name, coach:coach, location: "off-site"})
            }
        }
    },

    checkCurrentTeamDays: function checkCurrenTeamDays(currentRequest, currentTeam, schedObj, validOption){ //recursion?
        const currentRequestTotalDays = Object.keys(currentRequest.length);
        for(let i = 0; i < currentRequestTotalDays; i++){
            const currentDay = currentRequest[`day${i+1}`];
            if(this.evaluateTimeBlock(currentDay, currentTeam, schedObj, validOption, 0) == "conflict"){
                return "conflict"
            }
        }
    },

    evaluateTimeBlock: function evaluateTimeBlock(currentDay, currentTeam, schedObj, validOption, i){
        const modifierArr = [0, -15, 15, -30, 30];
        const timeRequest = this.checkConflicts(modifierArr[i], currentDay, currentTeam, schedObj);
        if(i < modifierArr.length-1 && timeRequest == "conflict"){
            evaluateTimeBlock(currentDay, currentTeam, schedObj, validOption, i++)
        }else if(i == modifierArr.length-1 && timeRequest == "conflict"){
            this.conflictArray.push(currentDay) //more content to this?
            return "conflict" //more content to this?
        }else{
            const validDay = {day: currentDay};
            validDay.startTime += modifierArr[i];
            validDay.endTime += modifierArr[i];
            const {coach, name} = currentTeam;
            validOption.coach = coach;
            validOption.name = name;
            validOption.validDays.push(validDay);
        }
    },

    checkConflicts: function checkConflicts(modifier, currentDay, currentTeam, schedObj){ //recursion?
        const {coach, size} = currentTeam;
        const {dayOfWeek, startTime, endTime} = currentDay;
        for(let time = startTime + modifier; time < endTime + modifier; time += 15){
            if(
                schedObj[dayOfWeek][time].strengthCoachAvailability[coach] == "no" ||
                schedObj[dayOfWeek][time].slots - size < 0){
                    return "conflict"
            }       
        }
    },
};


    
    
    
 
    

    /*sample schedule object built from previous attempt in F2019, 
    with subObject by team name, and listing name, coach, rank, team size (relative to slots), and schedule preferences
    schedulePreferences per day arrayFormat = [team, dayOfWeek, start, stop, inWeightRoom, BBnecessary]*/

    const teamObject = {
        football:{
            name: "football",
            coach:"Rivera",
            rank:1,
            size: 3,
            schedulePreferences:
                [
                    [
                        ["football","Tue", 870, 915, "yes", "yes"],
                        ["football","Thu", 870, 915, "yes", "yes"],
                        ["football","Fri", 945, 975, "yes", "yes"]
                    ],

                   /* [
                        ["football","Mon", 1300, 840,"yes", "yes"],
                        ["football","Wed", 1300, 840,"yes", "yes"]

                    ]*/
                ]
            
        
        
        },
    
        basketballWomen:{
            name:"basketballWomen",
            coach: "Brindle",
            rank:6,
            size: 1,
            schedulePreferences:
                
                [
                    [
                        ["basketballWomen","Tue", 420, 495,"yes", "yes"],
                        ["basketballWomen","Thu", 420, 495,"yes", "yes"],
                        ["basketballWomen","Fri", 420, 495,"yes", "yes"],
                    ],

                    /*[
                        ["basketballWomen","Mon", 840, 900,"yes", "yes"],
                        ["basketballWomen","Wed", 840, 900,"yes", "yes"],
                    ],*/
                ]
        },
        
        basketballMen:{
            name:"basketballMen",
            coach: "Brindle",
            rank:5,
            size: 1,
            schedulePreferences:
            
                [
                    [
                        ["basketballMen","Tue", 930, 990,"yes", "yes"],
                        ["basketballMen","Thu", 915, 975,"yes", "yes"],
                        ["basketballMen","Fri", 870, 930,"yes", "yes"],
                    ],

                    /*[
                        ["basketballMen","Mon", 900, 960,"yes", "yes"],
                        ["basketballMen","Wed", 960, 1020,"yes", "yes"],
                    ],*/
                ]
        },

        sprintFootball:{
            name:"sprintFootball",
            coach: "Dolan",
            rank:15,
            size: 2,
            schedulePreferences:
            
                [
                    [
                        ["sprintFootball","Tue", 960, 1020,"yes", "yes"],
                        ["sprintFootball","Sat", 540, 600,"yes", "yes"],
                    ],

                    /*[
                        ["sprintFootball","Mon", 900, 960,"yes", "yes"],
                        ["sprintFootball","Wed", 960, 1020,"yes", "yes"],
                    ],*/
                ]
        },

        fieldHockey:{
            name:"fieldHockey",
            coach: "Walts",
            rank:14,
            size: 2,
            schedulePreferences:
            
                [
                    [
                        ["fieldHockey","Mon", 555, 615,"yes", "yes"],
                        ["fieldHockey","Wed", 555, 615,"yes", "yes"],
                        ["fieldHockey","Fri", 555, 615,"yes", "yes"],
                    ],

                    /*[
                        ["sprintFootball","Mon", 900, 960,"yes", "yes"],
                        ["sprintFootball","Wed", 960, 1020,"yes", "yes"],
                    ],*/
                ]
        },

        soccerMen:{
            name:"soccerMen",
            coach: "Brindle",
            rank:17,
            size: 1,
            schedulePreferences:
            
                [
                    [
                        ["soccerMen","Tue", 1035, 1095,"yes", "yes"],
                        ["soccerMen","Thu", 1035, 1095,"yes", "yes"],
                    ],

                    /*[
                        ["sprintFootball","Mon", 900, 960,"yes", "yes"],
                        ["sprintFootball","Wed", 960, 1020,"yes", "yes"],
                    ],*/
                ]
        },

        soccerWomen:{
            name:"soccerWomen",
            coach: "Pifer",
            rank:18,
            size: 1,
            schedulePreferences:
            
                [
                    [
                        ["soccerWomen","Tue", 360, 420,"yes", "yes"],
                        ["soccerWomen","Thu", 360, 420,"yes", "yes"],
                    ],
                ]
        },

        volleyball:{
            name:"volleyball",
            coach: "Weeks",
            rank:19,
            size: 1,
            schedulePreferences:
            
                [
                    [
                        ["volleyball","Mon", 450, 510,"yes", "yes"],
                        ["volleyball","Wed", 450, 510,"yes", "yes"],
                    ],

                    [
                        ["volleyball","Mon", 480, 540,"yes", "yes"],
                        ["volleyball","Wed", 450, 510,"yes", "yes"],
                    ],
                    
                    [
                        ["volleyball","Mon", 420, 480,"yes", "yes"],
                        ["volleyball","Wed", 450, 510,"yes", "yes"],
                    ],

                    [
                        ["volleyball","Mon", 450, 510,"yes", "yes"],
                        ["volleyball","Wed", 480, 540,"yes", "yes"],
                    ],

                    [
                        ["volleyball","Mon", 450, 510,"yes", "yes"],
                        ["volleyball","Wed", 420, 480,"yes", "yes"],
                    ],
                    
                    [
                        ["volleyball","Mon", 480, 540,"yes", "yes"],
                        ["volleyball","Wed", 480, 540,"yes", "yes"],
                    ],

                    [
                        ["volleyball","Mon", 420, 480,"yes", "yes"],
                        ["volleyball","Wed", 420, 480,"yes", "yes"],
                    ],
                      
                ]
        },

        crossCountry:{
            name:"crossCountry",
            coach: "Pifer",
            rank:4,
            size: 2,
            schedulePreferences:
            
                [
                    [
                        ["crossCountry","Mon", 1020, 1050,"yes", "yes"],
                        ["crossCountry","Wed", 1020, 1050,"yes", "yes"],
                    ],
                ]
        },

        wrestling:{
            name:"wrestling",
            coach: "Weeks",
            rank:9,
            size: 2,
            schedulePreferences:
            
                [
                    [
                        ["wrestling","Mon", 420, 480,"yes", "yes"],
                        ["wrestling","Wed", 960, 1020,"yes", "yes"],
                        ["wrestling","Sat", 540, 600,"yes", "yes"]
                    ],

                    [
                        ["wrestling","Mon", 420, 480,"yes", "yes"],
                        ["wrestling","Wed", 1020, 1080,"yes", "yes"],
                        ["wrestling","Sat", 540, 600,"yes", "yes"]
                    ],

                    [
                        ["wrestling","Mon", 420, 480,"yes", "yes"],
                        ["wrestling","Wed", 960, 1020,"yes", "yes"],
                        ["wrestling","Sat", 600, 660,"yes", "yes"]
                    ],

                    [
                        ["wrestling","Mon", 450, 510,"yes", "yes"],
                        ["wrestling","Wed", 960, 1020,"yes", "yes"],
                        ["wrestling","Sat", 540, 600,"yes", "yes"]
                    ],

                    [
                        ["wrestling","Mon", 420, 480,"yes", "yes"],
                        ["wrestling","Wed", 1020, 1080,"yes", "yes"],
                        ["wrestling","Sat", 600, 660,"yes", "yes"]
                    ],

                    [
                        ["wrestling","Mon", 450, 510,"yes", "yes"],
                        ["wrestling","Wed", 1020, 1080,"yes", "yes"],
                        ["wrestling","Sat", 540, 600,"yes", "yes"]
                    ],

                    [
                        ["wrestling","Mon", 450, 510,"yes", "yes"],
                        ["wrestling","Wed", 960, 1020,"yes", "yes"],
                        ["wrestling","Sat", 600, 660,"yes", "yes"]
                    ],

                    [
                        ["wrestling","Mon", 450, 510,"yes", "yes"],
                        ["wrestling","Wed", 1020, 1080,"yes", "yes"],
                        ["wrestling","Sat", 600, 660,"yes", "yes"]
                    ],

                ]
        },

        swimDive:{
            name:"swimDive",
            coach: "Rivera",
            rank:8,
            size: 3,
            schedulePreferences:
            
                [
                    [
                        ["swimDive","Mon", 480, 540,"yes", "yes"],
                        ["swimDive","Wed", 480, 540,"yes", "yes"],
                        ["swimDive","Fri", 480, 540,"yes", "yes"],
                    ],
                ]
        },

        trackFieldPifer:{
            name:"trackFieldPifer",
            coach: "Pifer",
            rank:2,
            size: 2,
            schedulePreferences:
            
                [
                    [
                        ["trackFieldPifer","Mon", 1050, 1110,"yes", "yes"],
                        ["trackFieldPifer","Wed", 1050, 1110,"yes", "yes"],
                        ["trackFieldPifer","Fri", 1050, 1110,"yes", "yes"],
                    ],
                ]
        },

        trackFieldDolan:{
            name:"trackFieldDolan",
            coach: "Dolan",
            rank:3,
            size: 2,
            schedulePreferences:
            
                [
                    [
                        ["trackFieldDolan","Mon", 1050, 1110,"yes", "yes"],
                        ["trackFieldDolan","Wed", 1050, 1110,"yes", "yes"],
                        ["trackFieldDolan","Fri", 1050, 1110,"yes", "yes"],
                    ],
                ]
        },

        lacrosseMen:{
            name:"lacrosseMen",
            coach: "Walts",
            rank:7,
            size: 3,
            schedulePreferences:
            
                [
                    [
                        ["lacrosseMen","Mon", 960, 1020,"yes", "yes"],
                        ["lacrosseMen","Wed", 915, 975,"yes", "yes"],
                        ["lacrosseMen","Fri", 960, 1020,"yes", "yes"],
                    ],
                ]
        },

        lacrosseWomen:{
            name:"lacrosseWomen",
            coach: "Walts",
            rank:16,
            size: 2,
            schedulePreferences:
            
                [
                    [
                        ["lacrosseWomen","Tue", 450, 510,"yes", "yes"],
                        ["lacrosseWomen","Fri", 480, 540,"yes", "yes"],
                    ],
                ]
        },

        baseball:{
            name:"baseball",
            coach: "Weeks",
            rank:10,
            size: 2,
            schedulePreferences:
            
                [
                    [
                        ["baseball","Tue", 420, 480,"yes", "yes"],
                        ["baseball","Thu", 960, 1020,"yes", "yes"],
                        ["baseball","Sat", 840, 900,"yes", "yes"],
                    ],
                ]
        },

        softball:{
            name:"softball",
            coach: "Weeks",
            rank:20,
            size: 2,
            schedulePreferences:
            
                [
                    [
                        ["softball","Tue", 840, 900,"yes", "yes"],
                        ["softball","Thu", 840, 900,"yes", "yes"],
                    ],
                ]
        },

        golfMen:{
            name:"golfMen",
            coach: "Walts",
            rank:27,
            size: 1,
            schedulePreferences:
            
                [
                    [
                        ["golfMen","Tue", 360, 420,"yes", "yes"],
                        ["golfMen","Thu", 360, 420,"yes", "yes"],
                    ],
                ]
        },

        golfWomen:{
            name:"golfWomen",
            coach: "Walts",
            rank:28,
            size: 1,
            schedulePreferences:
            
                [
                    [
                        ["golfWomen","Tue", 420, 480,"yes", "yes"],
                        ["golfWomen","Thu", 420, 480,"yes", "yes"],
                    ],

                    [
                        ["golfWomen","Mon", 420, 480,"yes", "yes"],
                        ["golfWomen","Wed", 420, 480,"yes", "yes"],
                    ],
                ]
        },

        tennisMen:{
            name:"tennisMen",
            coach: "Pifer",
            rank:25,
            size: 1,
            schedulePreferences:
            
                [
                    [
                        ["tennisMen","Tue", 975, 1020,"yes", "yes"],
                        ["tennisMen","Thu", 975, 1020,"yes", "yes"],
                    ],
                ]
        },

        tennisWomen:{
            name:"tennisWomen",
            coach: "Pifer",
            rank:26,
            size: 1,
            schedulePreferences:
            
                [
                    [
                        ["tennisWomen","Tue", 975, 1020,"yes", "yes"],
                        ["tennisWomen","Thu", 975, 1020,"yes", "yes"],
                    ],

                    [
                        ["tennisWomen","Mon", 975, 1020,"yes", "yes"],
                        ["tennisWomen","Wed", 975, 1020,"yes", "yes"],
                    ],
                ]
        },

        lightweightCrewMen:{
            name:"lightweightCrewMen",
            coach: "Dolan",
            rank:11,
            size: 2,
            schedulePreferences:
            
                [
                    [
                        ["lightweightCrewMen","Tue", 1020, 1080,"yes", "yes"],
                        ["lightweightCrewMen","Sat", 690, 750,"yes", "yes"],
                    ],

                    [
                        ["lightweightCrewMen","Tue", 990, 1050,"yes", "yes"],
                        ["lightweightCrewMen","Sat", 690, 750,"yes", "yes"],
                    ],

                    [
                        ["lightweightCrewMen","Tue", 1050, 1110,"yes", "yes"],
                        ["lightweightCrewMen","Sat", 690, 750,"yes", "yes"],
                    ],

                    
                ]
        },

        crewWomen:{
            name:"crewWomen",
            coach: "Dolan",
            rank:12,
            size: 2,
            schedulePreferences:
            
                [
                    [
                        ["crewWomen","Mon", 390, 435,"yes", "yes"],
                        ["crewWomen","Tue", 390, 435,"yes", "yes"],
                        ["crewWomen","Thu", 390, 435,"yes", "yes"],
                        ["crewWomen","Fri", 390, 435,"yes", "yes"],
                    ],

                    [
                        ["crewWomen","Mon", 960, 1005,"yes", "yes"],
                        ["crewWomen","Tue", 960, 1005,"yes", "yes"],
                        ["crewWomen","Thu", 960, 1005,"yes", "yes"],
                        ["crewWomen","Fri", 390, 435,"yes", "yes"],
                    ],
                    
                ]
        },
        
        heavyweightCrewMen:{
            name:"heavyweightCrewMen",
            coach: "Dolan",
            rank:13,
            size: 2,
            schedulePreferences:
            
                [
                    [
                        ["heavyweightCrewMen","Mon", 480, 540,"yes", "yes"],
                        ["heavyweightCrewMen","Wed", 480, 540,"yes", "yes"],
                    ],
                    
                ]
        },

        cheerleading:{
            name:"cheerleading",
            coach: "Pifer",
            rank:29,
            size: 1,
            schedulePreferences:
            
                [
                    [
                        ["cheerleading","Mon", 960, 1020,"yes", "yes"],
                        ["cheerleading","Thu", 1020, 1080,"yes", "yes"],
                    ],

                    [
                        ["cheerleading","Mon", 1020, 1080,"yes", "yes"],
                        ["cheerleading","Thu", 1020, 1080,"yes", "yes"],
                    ],

                    [
                        ["cheerleading","Mon", 1080, 1140,"yes", "yes"],
                        ["cheerleading","Thu", 1080, 1140,"yes", "yes"],
                    ],
                    
                ]
        },

        fencing:{
            name:"fencing",
            coach: "Pifer",
            rank:23,
            size: 1,
            schedulePreferences:
            
                [
                    [
                        ["fencing","Mon", 1020, 1080,"yes", "yes"],
                        ["fencing","Wed", 1020, 1080,"yes", "yes"],
                    ],

                    [
                        ["fencing","Tue", 1020, 1080,"yes", "yes"],
                        ["fencing","Thu", 1020, 1080,"yes", "yes"],
                    ],

                    [
                        ["fencing","Mon", 960, 1020,"yes", "yes"],
                        ["fencing","Wed", 960, 1020,"yes", "yes"],
                    ],

                    [
                        ["fencing","Tue", 960, 1020,"yes", "yes"],
                        ["fencing","Thu", 960, 1020,"yes", "yes"],
                    ],
                    
                ]
        },

        gymnastics:{
            name:"gymnastics",
            coach: "Dolan",
            rank:24,
            size: 1,
            schedulePreferences:
            
                [
                    [
                        ["gymnastics","Thu", 1020, 1080,"yes", "yes"],
                        
                    ],
                    
                ]
        },

        squashMen:{
            name:"squashMen",
            coach: "Weeks",
            rank:21,
            size: 1,
            schedulePreferences:
            
                [
                    [
                        ["squashMen","Tue", 450, 510,"yes", "yes"],
                        ["squashMen","Thu", 450, 510,"yes", "yes"],    
                    ],
                    
                ]
        },

        squashWomen:{
            name:"squashWomen",
            coach: "Pifer",
            rank:22,
            size: 1,
            schedulePreferences:
            
                [
                    [
                        ["squashWomen","Tue", 450, 510,"yes", "yes"],
                        ["squashWomen","Thu", 450, 510,"yes", "yes"],    
                    ],
                ]
        },

        

        
     
    }
    
    