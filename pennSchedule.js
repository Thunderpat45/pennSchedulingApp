

const formTeamNameNode = document.querySelector("#formTeamNameName");
const formTeamSizeNode = document.querySelector("#formTeamSize");
const formAllOpts = document.querySelector("#formAllOpts")
const formOptNode = document.querySelector(".formOpt");
const dayOfWeekNode = document.querySelector(".dayOfWeek");
const startTimeNode = document.querySelector(".startTime");
const endTimeNode = document.querySelector(".endTime");
const inWeissNode = document.querySelector(".inWeiss");
const addTrainingDayNode = document.querySelector("#addTrainingDay1")
const addTrainingOptionNode = document.querySelector("#addTrainingOption")
const updateTeamRequestNode = document.querySelector("#updateTeamRequest")
const clearTeamRequestNode = document.querySelector("#clearTeamRequest")
const cancelTeamRequestNode = document.querySelector("#cancelTeamRequest");

//how to implement this(on page load?)


function initializeFirstSelectorNodes(){
    const firstStartTimeSelectorNode = document.querySelector("#startTimeSelectorOpt1Day1")
    addRemoveDOMElementFunctions.populateFormSelectNode(firstStartTimeSelectorNode, 360,1185,15)
    const firstEndTimeSelectorNode = document.querySelector("#endTimeSelectorOpt1Day1")
    addRemoveDOMElementFunctions.populateFormSelectNode(firstEndTimeSelectorNode, 390,1215,15)
    addRemoveDOMElementFunctions.populateFormSelectNode(formTeamSizeNode, 1, scheduleObject.slots+1, 1 )
}

window.addEventListener("load", initializeFirstSelectorNodes)

function assignElementAttributes(el, cl, ident, ihtml, action, callback, forhtml){
    if(cl){
        el.classList.add(cl)
    }

    if(ident){
        el.id = ident
    }

    if(ihtml){
        el.innerHTML = ihtml
    }   

    if(action && callback){
        el.addEventListener(action, callback)
    }

    if(forhtml){
        el.htmlFor =forhtml
    }
}


const addRemoveDOMElementFunctions = {
        
        /*determines if the day is being created as a product of adding an option (which automatically adds a day) or the add day button, 
        and assigns the value for finding the option number and day number from the event target*/
    findOptAndDayNumber: function findOptAndDayNumber(e){
        let optNumber
        let dayNumber
        if(e.target.classList.contains("addTrainingDay")){
            optNumber = Array.from(e.target.parentNode.parentNode.children).indexOf(e.target.parentNode)+1
            dayNumber = e.target.parentNode.children.item(1).childElementCount+1
        }else{
            optNumber = e.target.parentNode.parentNode.children.item(2).childElementCount+1
            dayNumber = 1
        }
        return [optNumber,dayNumber]
    },
    
    newTrainingOptionDiv : function createNewTrainingOptionDiv(e){

            //creates new option div that alternates color based on its optionNumber
        e.preventDefault();
        const optNumber = addRemoveDOMElementFunctions.findOptAndDayNumber(e)[0]
        const newFormOptionDiv = document.createElement("div");
        assignElementAttributes(newFormOptionDiv, "formOpt", `formOpt${optNumber}`)
            if((optNumber)%2 == 0){
                newFormOptionDiv.style.backgroundColor = "white"
                newFormOptionDiv.style.color = "black"
            }
                //creates new div with the option's label and a remove button
            const newLabelOptionRemoveOption = document.createElement("div")
            assignElementAttributes(newLabelOptionRemoveOption, "labelOptionRemoveOption", `labelOption${optNumber}RemoveOption${optNumber}`)               
                const newLabelOption = document.createElement("h2")
                assignElementAttributes(newLabelOption, "labelOption", `labelOption${optNumber}`, `Option ${optNumber}`)
                const newRemoveOptionButton = document.createElement("button")
                assignElementAttributes(newRemoveOptionButton, "formOptRemoveOpt", `formOptRemoveOpt${optNumber}`, "X", "click", addRemoveDOMElementFunctions.removeCurrentOption)
            newLabelOptionRemoveOption.appendChild(newLabelOption)
            newLabelOptionRemoveOption.appendChild(newRemoveOptionButton)
                //creates a new div holding all day divs added to this option, adds one day to it as the result of running the create day function, and creates an add day button
            const newFormOptionAllDaysDiv = document.createElement("div")
            assignElementAttributes(newFormOptionAllDaysDiv, "formOptAllDays", `formOptAllDaysOpt${optNumber}`)
            newFormOptionAllDaysDiv.appendChild(addRemoveDOMElementFunctions.newTrainingDayDiv(e))    
            const newAddTrainingDayButton = document.createElement("button")
            assignElementAttributes(newAddTrainingDayButton, "addTrainingDay", `addTrainingDay${optNumber}`, "Add Training Day", "click", addRemoveDOMElementFunctions.newTrainingDayDiv)
                //appends all children to new option div
        newFormOptionDiv.appendChild(newLabelOptionRemoveOption)
        newFormOptionDiv.appendChild(newFormOptionAllDaysDiv)
        newFormOptionDiv.appendChild(newAddTrainingDayButton)
            //if the previous option has an "x" button, it is removed and added to the new option
        addRemoveDOMElementFunctions.removeOptionRemovalButtonFromPreviousElement(e)
            //the option is added to the total options div
        formAllOpts.appendChild(newFormOptionDiv)

    },
   
    newTrainingDayDiv: function createNewTrainingDayDiv(e){
        
        let optNumber = addRemoveDOMElementFunctions.findOptAndDayNumber(e)[0]             
        let dayNumber = addRemoveDOMElementFunctions.findOptAndDayNumber(e)[1]
        const currentOptionAllDaysDiv = e.target.parentNode.children.item(1)       
            //creates a new day div 
        e.preventDefault();
        const newFormOptionDayDiv = document.createElement("div")
        assignElementAttributes(newFormOptionDayDiv, "formOptDay", `formOpt${optNumber}Day${dayNumber}`)
            //creates a div for the day's label and the remove day button
        const newFormLabelDayRemoveDay = document.createElement("div");
            assignElementAttributes(newFormLabelDayRemoveDay, "labelDayRemoveDay", `labelOption${optNumber}RemoveDay${dayNumber}`)    
            const newFormLabelDay = document.createElement("h3")
                assignElementAttributes(newFormLabelDay, "labelDay", `labelOption${optNumber}Day${dayNumber}`, `Day ${dayNumber}`)
                const newFormOptRemoveDayButton = document.createElement("button")
                assignElementAttributes(newFormOptRemoveDayButton, "formOptRemoveDay", `formOptRemoveOpt${optNumber}Day${dayNumber}`, "X", "click", addRemoveDOMElementFunctions.removeCurrentDay)
            newFormLabelDayRemoveDay.appendChild(newFormLabelDay)
                //the remove day button is added to the new day ONLY if it is NOT the first day for that option
            if(dayNumber>1){
                newFormLabelDayRemoveDay.appendChild(newFormOptRemoveDayButton)
            }
                //creates a div that wraps the inputs for the day, and appends the children that results from running each one's function
            const newFormOptionDayDetailsDiv = document.createElement("div");
            assignElementAttributes(newFormOptionDayDetailsDiv, "formOptDayDetails", `formOpt${optNumber}DayDetails${dayNumber}`)
            newFormOptionDayDetailsDiv.appendChild(addRemoveDOMElementFunctions.newDayOfWeekDiv(e))
            newFormOptionDayDetailsDiv.appendChild(addRemoveDOMElementFunctions.newStartTimeDiv(e))
            newFormOptionDayDetailsDiv.appendChild(addRemoveDOMElementFunctions.newEndTimeDiv(e))
            newFormOptionDayDetailsDiv.appendChild(addRemoveDOMElementFunctions.newInWeissDiv(e))
            //label, removeButton and dayDetails appended to day div
        newFormOptionDayDiv.appendChild(newFormLabelDayRemoveDay);
        newFormOptionDayDiv.appendChild(newFormOptionDayDetailsDiv)
            /*determines if the day was added by a create day button (in which case it removes the "x" button from the previous day and adds to the new one, and appends the new day),
            or if was created by a new option click, in which case it returns the element to the createOption function*/
        
        if(e.target.classList.contains("addTrainingDay")){
            (function removeDayRemovalButtonFromPreviousElement(){
                const removeDayButtonPreviousElementDiv = e.target.previousElementSibling.lastElementChild.firstElementChild
                    //ensures that there still is an "x" button to remove before removing the element 
                if(removeDayButtonPreviousElementDiv.lastElementChild.classList.contains("formOptRemoveDay")){
                    removeDayButtonPreviousElementDiv.removeChild(removeDayButtonPreviousElementDiv.lastElementChild)
                }
            })()
            currentOptionAllDaysDiv.appendChild(newFormOptionDayDiv)         
        }else{
            return newFormOptionDayDiv
        }
    },

    newDayOfWeekDiv: function createNewDayOfWeekDiv(e){
                
        let optNumber = addRemoveDOMElementFunctions.findOptAndDayNumber(e)[0]             
        let dayNumber = addRemoveDOMElementFunctions.findOptAndDayNumber(e)[1]
            //creates days of week array to populate selector
        const weekArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]      
            //creates new day of week div with label and selector
        const newDayOfWeekDiv = document.createElement("div");
        assignElementAttributes(newDayOfWeekDiv, "dayOfWeek", `dayOfWeekOpt${optNumber}Day${dayNumber}`)   
            const newDayOfWeekLabel = document.createElement("label");
            assignElementAttributes(newDayOfWeekLabel, "", ``, "Day of Week", null , null, `dayOfWeekSelectorOpt${optNumber}Day${dayNumber}` )   
            const newBreak = document.createElement("br")   
            const newDayOfWeekSelection = document.createElement("select")
            assignElementAttributes(newDayOfWeekSelection, "dayOfWeekSelector", `dayOfWeekSelectorOpt${optNumber}Day${dayNumber}`)
                //adds options to selector
            addRemoveDOMElementFunctions.populateFormSelectNode(newDayOfWeekSelection, 0, weekArray.length, 1, weekArray)  
        newDayOfWeekDiv.appendChild(newDayOfWeekLabel)
        newDayOfWeekDiv.appendChild(newBreak)
        newDayOfWeekDiv.appendChild(newDayOfWeekSelection)   
        return newDayOfWeekDiv
    },
   
    newStartTimeDiv: function createNewStartTimeDiv(e){
              
        let optNumber = addRemoveDOMElementFunctions.findOptAndDayNumber(e)[0]             
        let dayNumber = addRemoveDOMElementFunctions.findOptAndDayNumber(e)[1]
            //creates new startTime div with label and selector 
        const newStartTimeDiv = document.createElement("div");
        assignElementAttributes(newStartTimeDiv, "startTime", `startTimeOpt${optNumber}Day${dayNumber}`)
            const newStartTimeLabel = document.createElement("label");
            assignElementAttributes(newStartTimeLabel, "", ``, "Start Time", null, null, `startTimeSelectorOpt${optNumber}Day${dayNumber}`)
            const newBreak = document.createElement("br")
            const newStartTimeSelection = document.createElement("select")
            assignElementAttributes(newStartTimeSelection, "startTimeSelector", `startTimeSelectorOpt$${optNumber}Day${dayNumber}`)
                //adds options to selector
            addRemoveDOMElementFunctions.populateFormSelectNode(newStartTimeSelection, 360,1185,15)  
        newStartTimeDiv.appendChild(newStartTimeLabel);
        newStartTimeDiv.appendChild(newBreak)
        newStartTimeDiv.appendChild(newStartTimeSelection);   
        return newStartTimeDiv
    },

    newEndTimeDiv: function createNewEndTimeDiv(e){
        
        
        let optNumber = addRemoveDOMElementFunctions.findOptAndDayNumber(e)[0]             
        let dayNumber = addRemoveDOMElementFunctions.findOptAndDayNumber(e)[1]
            //creates new endTime div with label and selector 
        const newEndTimeDiv = document.createElement("div");
        assignElementAttributes(newEndTimeDiv, "endTime", `endTimeOpt${optNumber}Day${dayNumber}`)
        newEndTimeDiv.classList.add("endTime") 
        newEndTimeDiv.id = `endTimeOpt${optNumber}Day${dayNumber}`;
            const newEndTimeLabel = document.createElement("label");
            assignElementAttributes(newEndTimeLabel, "", ``, "End Time", null, null, `endTimeSelectorOpt${optNumber}Day${dayNumber}`)   
            const newBreak = document.createElement("br")   
            const newEndTimeSelection = document.createElement("select")
            assignElementAttributes(newEndTimeSelection, "endTimeSelector", `endTimeSelectorOpt${optNumber}Day${dayNumber}`)     
                //adds optins to selector
            addRemoveDOMElementFunctions.populateFormSelectNode(newEndTimeSelection, 390,1215,15)   
        newEndTimeDiv.appendChild(newEndTimeLabel);
        newEndTimeDiv.appendChild(newBreak)
        newEndTimeDiv.appendChild(newEndTimeSelection);   
        return newEndTimeDiv
            
    },

    newInWeissDiv: function createNewInWeissDiv(e){ 

        let optNumber = addRemoveDOMElementFunctions.findOptAndDayNumber(e)[0]             
        let dayNumber = addRemoveDOMElementFunctions.findOptAndDayNumber(e)[1]       
            //creates new endTime div with label and radio options, yes by default
        const newInWeissDiv = document.createElement("div")
        assignElementAttributes(newInWeissDiv, "inWeiss", `inWeissOpt${optNumber}Day${dayNumber}`)      
            const newInWeissLabel = document.createElement("p")
            assignElementAttributes(newInWeissLabel, "inWeissLabel", ``, "In Weiss")   
            const newInWeissYesInput = document.createElement("input")
            assignElementAttributes(newInWeissYesInput, "inWeissYes", `inWeissYesSelectorOpt${optNumber}Day${dayNumber}`)
                newInWeissYesInput.setAttribute("name", `inWeissSelectorOpt${optNumber}Day${dayNumber}`)
                newInWeissYesInput.setAttribute("type", "radio")
                newInWeissYesInput.setAttribute("value", "yes")
                newInWeissYesInput.checked = "true"   
            const newInWeissYesLabel = document.createElement("label")
            assignElementAttributes(newInWeissYesLabel, "", ``, "Yes", null, null, `inWeissYesSelectorOpt${optNumber}Day${dayNumber}`)
                newInWeissYesLabel.innerHTML = "Yes";
                newInWeissYesLabel.htmlFor = `inWeissYesSelectorOpt${optNumber}Day${dayNumber}`            
            const newInWeissNoInput = document.createElement("input")
            assignElementAttributes(newInWeissNoInput, "inWeissNo", `inWeissNoSelectorOpt${optNumber}Day${dayNumber}`)
                newInWeissNoInput.setAttribute("name", `inWeissSelectorOpt${optNumber}Day${dayNumber}`)
                newInWeissNoInput.setAttribute("type", "radio")
                newInWeissNoInput.setAttribute("value", "no")                
            const newInWeissNoLabel = document.createElement("label")
            assignElementAttributes(newInWeissNoLabel, "", ``, "No", null, null, `inWeissNoSelectorOpt${optNumber}Day${dayNumber}`)
                newInWeissNoLabel.innerHTML = "No";
                newInWeissNoLabel.htmlFor = `inWeissNoSelectorOpt${optNumber}Day${dayNumber}` 
        newInWeissDiv.appendChild(newInWeissLabel)
        newInWeissDiv.appendChild(newInWeissYesInput)
        newInWeissDiv.appendChild(newInWeissYesLabel)
        newInWeissDiv.appendChild(newInWeissNoInput)
        newInWeissDiv.appendChild(newInWeissNoLabel)    
        return newInWeissDiv
    },

    removeCurrentDay: function removeCurrentDay(e){
            //event listener function for remove day buttons
            //determines element of day div preceding that of div in which "x" button was clicked, as well as the current option div, and their numbers
        const previousDayElement = e.target.parentElement.parentElement.previousSibling
        const optDiv = previousDayElement.parentElement.parentElement
        const optNumber = Array.from(optDiv.parentElement.children).indexOf(optDiv)+1     
        const dayNumber = Array.from(previousDayElement.parentElement.children).indexOf(previousDayElement)+1
        /*if the day for which the button is clicked is the third or more day, the "x" button will be added to the previous day
        (this was not applied to day 2, so that if day 2 were deleted, it would still be not possible to delete day 1)*/
        if(dayNumber>1){
            (function addDayRemovalButtonToPreviousElement(){   
                const newFormOptRemoveDayButton = document.createElement("button")
                assignElementAttributes(newFormOptRemoveDayButton, "formOptRemoveDay", `formOptRemoveOpt${optNumber}Day${dayNumber}`, "X", "click", addRemoveDOMElementFunctions.removeCurrentDay)
                previousDayElement.firstElementChild.appendChild(newFormOptRemoveDayButton)  
            })()
        }
        //removes the day on which the button was clicked
        (function removeDay(){
            previousDayElement.parentElement.removeChild(previousDayElement.nextElementSibling)
        })()
    },

    removeCurrentOption: function removeCurrentOption(e){
            //event listener for remove options button
            //determines element of option div preceding that of div in which "x" button was clicked, as well as the number
        const previousOptionElement = e.target.parentElement.parentElement.previousElementSibling
        const optNumber = Array.from(previousOptionElement.parentElement.children).indexOf(previousOptionElement)+1
            /*if the option for which the button is clicked is the third or more option, the "x" button will be added to the previous option
            (this was not applied to option 2, so that if option 2 were deleted, it would still be not possible to delete option 1)*/
        if(optNumber>1){
            (function addOptionRemovalButtonToPreviousElement(){
                const newRemoveOptButton = document.createElement("button");
                assignElementAttributes(newRemoveOptButton, "formOptRemoveOpt", `formOptRemoveOpt${optNumber}`, "X", "click", addRemoveDOMElementFunctions.removeCurrentOption)
                previousOptionElement.firstElementChild.appendChild(newRemoveOptButton)
            })()
        }
            //remove current option
        (function removeOption(e){
            previousOptionElement.parentElement.removeChild(previousOptionElement.nextElementSibling)
        })()
    },

    removeOptionRemovalButtonFromPreviousElement: function removeOptionRemovalButtonFromPreviousElement(e){

        let removeOptionButtonPreviousElementDiv = e.target.parentElement.previousElementSibling.lastElementChild.firstElementChild
        if(removeOptionButtonPreviousElementDiv.lastElementChild.classList.contains("formOptRemoveOpt")){
            removeOptionButtonPreviousElementDiv.removeChild(removeOptionButtonPreviousElementDiv.lastElementChild)
        }
    },

    populateFormSelectNode: function populateFormSelectNode(selector, valueRangeStart, valueRangeEnd, valueIncrementer, array){
        let defaultNode = document.createElement("option")
            defaultNode.setAttribute("value", "default")
            if(!selector.classList.contains("dayOfWeekSelector")){
                defaultNode.innerHTML = "--"
                selector.appendChild(defaultNode)
            }
             

        if(array){
            for(let i = valueRangeStart; i < valueRangeEnd; i+= valueIncrementer){
                let newOption = document.createElement("option")
                newOption.setAttribute("value", `${array[i]}`)
                newOption.innerHTML = `${array[i]}`
                selector.appendChild(newOption)
            }
        }else{
            for(let i = valueRangeStart; i < valueRangeEnd; i+= valueIncrementer){
                let newOption = document.createElement("option")
                newOption.setAttribute("value", `${i}`)
                if(selector.id == "formTeamSize"){
                    newOption.innerHTML = `${i}`
                }else{
                    newOption.innerHTML = `${convertTotalMinutesToStandardTime(i)}`
                }               
                selector.appendChild(newOption)
            }
            if(selector.classList.contains("startTimeSelector")){
                selector.addEventListener("change", addRemoveDOMElementFunctions.modifyEndTimeDefaultOption)
            }else if(selector.id == "formTeamSize"){
                selector.addEventListener("change", addRemoveDOMElementFunctions.disableDefaultOption)
            }
        }
    },

    modifyEndTimeDefaultOption : function modifyEndTimeDefaultOption(e){

        const startTimeValue = Number(e.target.value)
        const endTimeValuesArray = Array.from(e.target.parentElement.nextElementSibling.lastElementChild.children)
        endTimeValuesArray.forEach(function(time){
            let endTimeValue = time.value
            
            if(endTimeValue<startTimeValue + 30 || endTimeValue == "default"){
                time.disabled = true
            }else{
                time.disabled = false
            }

            if(endTimeValue == startTimeValue + 60){
                time.selected = true
            }else{
                time.selected = false
            }

        })

        addRemoveDOMElementFunctions.disableDefaultOption(e)

    },

    disableDefaultOption: function disableDefaultOption(e){
        let valueArray = Array.from(e.target.children)
        valueArray[0].disabled = true

    }

}

addTrainingOptionNode.addEventListener("click", addRemoveDOMElementFunctions.newTrainingOptionDiv)
addTrainingDayNode.addEventListener("click", addRemoveDOMElementFunctions.newTrainingDayDiv)
    

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

updateTeamRequestNode.addEventListener("click", updateTeamObjectThisTeam)

function updateTeamObjectThisTeam(e){

    e.preventDefault()
    
    let nameTest = e.target.parentElement.parentElement.firstElementChild.children.item(2).value
    let validNameRegex = /[^A-Za-z0-9]/ 
    let name
        if(validNameRegex.test(nameTest)){
            alert("Error: Team Name can only include letters (A-Z, a-z) or numbers (0-9)")
            return
        }else if(nameTest == ""){
            alert("Error: Team Name field must have a value")
            return
        }else{
            name = nameTest
        }
    let size = e.target.parentElement.parentElement.children.item(1).children.item(2).value //?Automate?

    
        function populateSchedulePreferences(){
            let schedulePreferences = []
            let allOptionsDivChildrenArray = Array.from(e.target.parentElement.parentElement.children.item(2).children)
            allOptionsDivChildrenArray.forEach(function(option){
                let optionArray = []
                let allDaysDivThisOptionChildrenArray = Array.from(option.children.item(1).children)
                allDaysDivThisOptionChildrenArray.forEach(function(day){
                    let dayArray = []
                    let dayDetailsDiv = day.lastElementChild
                    let dayOfWeekValue = dayDetailsDiv.children.item(0).lastElementChild.value
                    let startTimeValue = dayDetailsDiv.children.item(1).lastElementChild.value
                    let endTimeValue = dayDetailsDiv.children.item(2).lastElementChild.value
                        if(startTimeValue >= endTimeValue){
                            alert(`Error @ Option${allOptionsDivChildrenArray.indexOf(option)+1} Day${allDaysDivThisOptionChildrenArray.indexOf(day)+1} : End Time must be later than Start Time`)
                            return //make this stop code execution
                        }
                    function getInWeissValue(){
                        let yesValue = dayDetailsDiv.children.item(3).children.item(1)
                        let noValue = dayDetailsDiv.children.item(3).children.item(3)
                        if(yesValue.checked){
                            return yesValue.value
                        }
                        else if(noValue.checked){
                            return noValue.value
                        }
                        else{
                            alert(`Error @ Option${allOptionsDivChildrenArray.indexOf(option)+1} Day${allDaysDivThisOptionChildrenArray.indexOf(day)+1} : In Weiss must have a value`)
                            return //make this stop code execution
                        }
                    }
                        
                    let inWeissValue = getInWeissValue()
                        dayArray.push(name)
                        dayArray.push(dayOfWeekValue)
                        dayArray.push(startTimeValue)
                        dayArray.push(endTimeValue)
                        dayArray.push(inWeissValue)
                    optionArray.push(dayArray)
                })
                schedulePreferences.push(optionArray)
            })   
            return schedulePreferences
        }

        let schedulePreferences = populateSchedulePreferences()

        teamObject[name] = {
            "name": name,
            "size": size,
            "schedulePreferences": schedulePreferences
        }

}


/*evaluates all possible scheduling combinations for conflicts by coachAvailablity and spaceAvailabity, and returns up to 5 full optimized schedules,
 or, if no full schedule works with the options provided, returns the longest stack that was built during the attempt*/
function modifiedCartesian(...teamRequestArray) {
    
    /*variables for optimized schedule; longest stack built; any non-viable training day requests,
    and the total amount of teams in the list, respectively*/
    const completeSchedules = [];
    let longestStack = [];
    const conflictArray = []
    const totalTeamRequests = teamRequestArray.length-1;
 
    /*function accepting parameters of current scheduling stack to this point, and the index of current team (from teamRequestArray parameter) 
    being evaluated for availability, with variables for the currentTeam subArray, and the length of the currentTeam which is the amount of requests
    they submitted*/

    function helper(currentScheduleStack, currentTeamIndex){
        const currentTeam = teamRequestArray[currentTeamIndex]
        const currentTeamTotalRequests = currentTeam.length;
        
        /*loop that iterates through each request for current Team, with variables for slice of current scheduling stack, 
        a freshly generated blank schedule, and an empty array to push options that work */
        loop1:for (let currentRequestIndex=0; currentRequestIndex<currentTeamTotalRequests; currentRequestIndex++){
            let currentRequest = currentTeam[currentRequestIndex];
            const currentScheduleStackSlice = currentScheduleStack.slice(0); 
            let scheduleObject = scheduleObject.buildScheduleObjectNew();
            let bestChoice = []           
            
            //function that checks active Team availability against current scheduling stack
            function checkCoachSpaceAvailability(activeTeam, activeScheduleStack){
    
                /*function that populates the blank schedule with each team of the current scheduling stack, 
                by "occupying" (subtracting) the appropriate # of slots out of total weight room space (unless they are training in remote location), 
                marking the respective strength coach as no longer available, and adding the team to a list of teams in that slot;
                doing it for every 15 mins that the team has up to the duration of the session*/
                function populateScheduleObjectWithExistingScheduleStack(){
                    for(let existingTeamIndex = 0; existingTeamIndex < activeScheduleStack.length; existingTeamIndex++){
                        let existingTeamTrainingWeek = activeScheduleStack[existingTeamIndex];
                        for(let day = 0; day<existingTeamTrainingWeek.length; day++){
                            let existingTeamTrainingDay = existingTeamTrainingWeek[day];
                            let team = existingTeamTrainingDay[0]
                            let dayOfWeek = existingTeamTrainingDay[1]
                            let start = existingTeamTrainingDay[2];
                            let stop = existingTeamTrainingDay[3]
                            let inWeightRoom = existingTeamTrainingDay[4]
                            for(let time = start; time < stop; time += 15){
                                if(inWeightRoom == "yes"){
                                    scheduleObject[dayOfWeek][time].slots -= teamObject[team].size;
                                    scheduleObject[dayOfWeek][time].existingTeams.push(teamObject[team].name)
                                }else{
                                    scheduleObject[dayOfWeek][time].existingTeams.push(`${teamObject[team].name} off-site`)
                                }
                                scheduleObject[dayOfWeek][time].strengthCoachAvailability[teamObject[team].coach] = "no";
                            }    
                        }
                    }
                }
                /* function that compares each day of the "to be scheduled" team's current proposal, checking that for every 15min
                between start and stop, both the space and coach is free, with a variable that imitates (but does not shallow copy) the current proposal */
                function checkActiveTeam(){
                    for(let dayProposalIndex = 0; dayProposalIndex<activeTeam.length; dayProposalIndex++){
                        let trainingDay = activeTeam[dayProposalIndex]
                        let team = trainingDay[0];
                        let dayOfWeek = trainingDay[1]
                        let start = trainingDay[2];
                        let stop = trainingDay[3];
                        let inWeightRoom = trainingDay[4]
                        let validTime = [team, dayOfWeek, start, stop, inWeightRoom, "yes"  ];
                       
                        
                        function evaluateTime(modifier){                                                     
                            for(let time = start + modifier; time < stop + modifier;time+=15){
                                if(scheduleObject[dayOfWeek][time].strengthCoachAvailability[teamObject[team].coach] == "no"){                                    
                                    return "conflict"
                                }else if(scheduleObject[dayOfWeek][time].slots - teamObject[team].size <0){                                  
                                    return "conflict"
                                }
                            }   
                        }
                        /*conditions of checkActiveTeam that assess: if original proposed day works, push it to bestChoice array;
                        if not, if adding/subtracting up to 30 mins from start and end time will allow a conflicting proposed time to still fit in a relatively similar spot, 
                        modify the proposal imitation to change the start/end times appropriately(without modifiying the actual proposed times, just in case). 
                        Otherwise, returns completeConflict to indicate that no variation of the time proposed for that day works,
                        and pushes conflicting day/time to conflictArray*/
                        if(evaluateTime(0) == "conflict"){
                            if(evaluateTime(-15) == "conflict"){
                                if(evaluateTime(15) == "conflict"){
                                    if(evaluateTime(-30) == "conflict"){
                                        if(evaluateTime(30) == "conflict"){
                                            conflictArray.push([`${team}`,`${dayOfWeek}`,`${start}(+/-30)`])
                                            return "completeConflict"
                                        }else{
                                            validTime[2] = start + 30
                                            validTime[3] = stop + 30
                                            bestChoice.push(validTime)  
                                        }
                                    }else{
                                        validTime[2] = start + -30
                                        validTime[3] = stop + -30
                                        bestChoice.push(validTime)
                                    }
                                }else{
                                    validTime[2] = start + 15
                                    validTime[3] = stop + 15
                                    bestChoice.push(validTime)
                                }
                            }else{
                                validTime[2] = start + -15
                                validTime[3] = stop + -15
                                bestChoice.push(validTime)
                            }
                        }else{
                            bestChoice.push(validTime)
                        }
                    }                              
                }
                populateScheduleObjectWithExistingScheduleStack()
                if(checkActiveTeam() == "completeConflict"){
                   return "completeConflict"
                }             
        
            }
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
            /*if the stack adds every team and reaches this point, it is a full schedule, 
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
        Sunday:[[360, 1200]],
        Monday:[],
        Tuesday:[],
        Wednesday:[],
        Thursday:[],
        Friday:[],
        Saturday:[[360,540], [720,1200]]

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

//edit this to be object with buildScheudleObject method, and slot as property

const scheduleObject = {
    Sunday:{},
    Monday:{},
    Tuesday:{},
    Wednesday:{},
    Thursday:{},
    Friday:{},
    Saturday:{},
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
    }
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
    
    