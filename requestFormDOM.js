const events = [] //to shut the linter up until events.js can be imported;

/*
actions: builds DOM for submitting team requests, captures inputs for teamRequestModel

publishes:
    teamName value changes
    teamSize value changes
    dayOfWeek, startTime, endTime, inWeiss value changes
    add/delete/reorder option requests
    add/delete day requests
    teamRequest validation requests

subscribes to:

    workingModel updates to:
        option length
        option rank
        day length
        dayDetail values
    workingModel builds

        FROM: teamRequestModel
    
    selectorOptionUpdates:
        FROM: MongoDB
*/

const requestFormDOM = (function(){
    
    let allTeamsNamesList = [];

    const selectionOptions = {
        startTime: null,
        endTime: null,
        teamSize: null,
        dayOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], //source elsewhere?
        inWeiss: ["yes", "no"]
    };

    events.subscribe("allTeamsUpdated", loadAllTeamsNamesList); //should this instead be an async operation?

    events.subscribe("workingModelPopulated", publishRequestFormRender)

    events.subscribe("optionsModified", function renderUpdatedOpts(workingModel){
        const allOpts = document.querySelector("#formAllOpts");
        renderAllOpts(workingModel, allOpts);
    })

    events.subscribe("someKindOfLoad", setSelectionOptions);

    function loadAllTeamsNamesList(MONGODBSTUFF){ //needs updating
        allTeamsNamesList = [];
        MONGODBSTUFF.forEach(function(team){
            allTeamsNamesList.push(team);
        })
    }

    function setSelectionOptions(MONGODBSTUFF){ //needs updating
        selectionOptions.startTime = MONGODBSTUFF.startTime;
        selectionOptions.endTime = MONGODBSTUFF.endTime;
        selectionOptions.teamSize = MONGODBSTUFF.teamSize;
    }

//figure out how to load selection options/all teams from DB on page load;
//subscribe?, window eventListener?;
//local storage to maintain data on DOM after refresh?




    function publishRequestFormRender(workingModel){
        const requestPage = renderRequestFormPage(workingModel);
        events.publish("renderPage", requestPage);
    }

    function renderRequestFormPage(workingModel){
        //cache DOM
        const template = document.querySelector("#requestFormPageTemplate");
        const content = document.importNode(template.content, true);
        const teamName = content.querySelector("#formTeamNameDiv");
        const teamSize = content.querySelector("#formTeamSizeDiv"); 
        const allOpts = content.querySelector("#formAllOpts");
        const addButton = content.querySelector("#addTrainingOption");
        const updateButton = content.querySelector("#updateTeamRequest");
        const cancelButton = content.querySelector("#cancelTeamRequest");

        //bind events
        addButton.addEventListener("click", addOption);
        updateButton.addEventListener("click", updateTeamRequest);
        cancelButton.addEventListener("click", cancelTeamRequest);

        //add dynamic elements
        const teamNameNew = renderTeamName(workingModel);
        const teamSizeNew = renderTeamSizeSelection(workingModel);
        const allOptsNew = renderAllOpts(workingModel);

        teamName.replaceWith(teamNameNew);
        teamSize.replaceWith(teamSizeNew);
        allOpts.replaceWith(allOptsNew);

        function addOption(){
            events.publish("addOpt")
        }
        
        function updateTeamRequest(){
            events.publish("updateRequest")
        }
        
        function cancelTeamRequest(){
            events.publish()// send control back to homePage data to render;
        }
        
        return content;
    }

    function renderTeamName(workingModel){
        //cache DOM
        const template = document.querySelector("#teamNameTemplate");
        const content = document.importNode(template.content, true);
        const teamName = content.querySelector("#formTeamName");
        const teamNameNew = document.createElement("input");
        
        //set attributes
        teamNameNew.value = workingModel.teamName;

        //bind events
        teamNameNew.addEventListener("blur", function modifyTeamNameValue(){
            if(workingModel.teamName != teamNameNew.value && blockTeamDuplication(teamNameNew.value) == true){
                alert(`Data already exists for ${teamNameNew.value}. Use another team name or select edit for ${teamNameNew.value}`);
                teamNameNew.value = "";
            }   
            else if(workingModel.teamName != "" && teamNameNew.value != workingModel.teamName){// if or else if?
                const confirmation = confirm(`Clicking ok will create a new team ${teamNameNew.value} and delete data for ${workingModel.teamName}. Proceed? `);
                if(confirmation){
                    events.publish("modifyTeamNameValue", teamNameNew.value)
                }else{
                    teamNameNew.value = workingModel.teamName;
                }
            }else{
                events.publish("modifyTeamNameValue", teamNameNew.value)
            } 
        })

        teamName.replaceWith(teamNameNew);
        teamNameNew.id = "formTeamName"

        return content;

        function blockTeamDuplication(thisTeamName){
            const teamCheck = allTeamsNamesList.filter(function(team){
                return team == thisTeamName
            })
            return teamCheck.length>0;
        }
    }
    
    function renderTeamSizeSelection(workingModel){
        //cache DOM
        const template = document.querySelector("#teamSizeTemplate");
        const content = document.importNode(template.content, true);
        const formTeamSize = content.querySelector("#formTeamSize");
        const selection = Object.create(selectorProtos.rangeValuesSelectorProto);
        selection.el = document.createElement("select");
        const primaryClass = Array.from(this.el.classList)[0];
        
        //bind events
        selection.el.addEventListener("change", selection.disableDefaultOption) 
            selection.el.addEventListener("change", function modifyTeamSizevalue(){
                const value = selection.el.value 
                events.publish("modifyTeamSizeValue", value)
            })

            //add dynamic elements
        selection.buildSelectorOptions(primaryClass);

            //set values
        selection.el.value = workingModel.teamSize;
        const selectedOption= content.querySelector(`select#formTeamSize option[value = ${selection.el.value}]`);
        selectedOption.selected = true;
        if(selectedOption.value != "default"){
            selection.el.firstChild.disabled = true;
        }
        
        formTeamSize.replaceWith(selection.el);
        selection.el.id = "formTeamSize"
        
        return content
    }
    
    function renderAllOpts(workingModel){ 
        const allOptsNew = document.createElement("div");
        allOptsNew.id = "formAllOpts";
        workingModel.allOpts.forEach(function(optionDetails){
            const optNum = workingModel.allOpts.indexOf(optionDetails);
            const option = buildOption(workingModel.allopts, optionDetails, optNum);
            allOptsNew.appendChild(option);
        });

        if(document.querySelector("#formAllOpts")){
            const allOpts = document.querySelector("#formAllOpts");
            allOpts.replaceWith(allOptsNew);
        }
        else{
            return allOptsNew
        }  
    }  

    function buildOption(allOptsDetails, optionDetails, optNum){ //rename option to request in HTML/CSS/JS
        //cache DOM
        const template = document.querySelector("#optionTemplate");
        const content = document.importNode(template.content, true);
        const labelButtonDiv = content.querySelector(".labelDeleteOptButton");
        const label = content.querySelector(".optLabel");
        const allDaysModel = content.querySelector(".formAllDays"); 
        const addDayButton = content.querySelector(".addTrainingDay");

        //set attributes
        label.innerHTML = `Option ${optNum}`;

        //bind events
        events.subscribe("daysModified", function renderModifiedDayDetails(publishedOptionDetails, publishedOptNum){
            if(publishedOptNum == optNum){
                const allOpts = document.querySelector("#formAllOpts");
                const thisOption = Array.from(allOpts.children)[optNum-1];
                const allDaysDOM = thisOption.querySelector(".formAllDays");
                renderAllDaysDetails(publishedOptionDetails,publishedOptNum, allDaysDOM)
            }
        })
        addDayButton.addEventListener("click", addDay);

        //build dynamic elements
        if(allOptsDetails.length >1){
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("deleteOpt");
            deleteButton.addEventListener("click", deleteOpt)
            labelButtonDiv.appendChild(deleteButton)

            if(optNum !=1){
                const upButton = document.createElement("button"); //up icon if possible, set class and CSS
                upButton.addEventListener("click", moveOptionUp);
            }
            if(optNum != allOptsDetails.length){
                const downButton = document.createElement("button"); //down icon if possible, set class and CSS
                downButton.addEventListener("click", moveOptionDown);
            }
        }

        renderAllDaysDetails(optionDetails, optNum, allDaysModel); 

        return content
        
        //
        function addDay(){
            events.publish("addDay", optNum)
        }

        function deleteOpt(){
            events.publish("deleteOpt", optNum)
        }

        function moveOptionUp(){
            events.publish("modifyOptOrder", optNum, -1)
        }

        function moveOptionDown(){
            events.publish("modifyOptOrder", optNum, 1)
        }
    }

    function renderAllDaysDetails(optionDetails, optNum, allDays){
        const allDaysNew = document.createElement("div");  
        optionDetails.forEach(function(dayDetails){
            const dayNum = optionDetails.indexOf(dayDetails) +1; 
            const day = buildDay(optionDetails, dayDetails, optNum, dayNum);
            allDaysNew.appendChild(day);
        })
        allDays.replaceWith(allDaysNew);
        allDaysNew.classList.add("formAllDays")
    }

    function buildDay(optionDetails, dayDetails, optNum, dayNum){
        //cache DOM
        const template = document.querySelector("#dayTemplate");
        const content = document.importNode(template.content, true);
        const labelButtonDiv = content.querySelector(".labelDeleteDayButton");
        const label = content.querySelector(".dayLabel");
        const allDaysDetails = content.querySelector(".formAllDayDetails");
        
        // set attributes
        label.innerHTML = `Day ${dayNum}`;
        
        //build dynamic elements
        if(optionDetails.length>1){
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("deleteDay");
            deleteButton.addEventListener("click", deleteDay);
            labelButtonDiv.appendChild(deleteButton)
        }
        renderDayDetails();

        return content
        
        //
        function renderDayDetails(){
            const allDayDetailsNew = buildDayDetails(dayDetails, optNum, dayNum);
            allDaysDetails.replaceWith(allDayDetailsNew);
            allDayDetailsNew.classList.add("formAllDayDetails")
        }

        function deleteDay(){
            events.publish("deleteDay", optNum, dayNum)
        } 
    }
    
    function buildDayDetails(dayDetails, optNum, dayNum){
        //cache DOM
        const template = document.querySelector("#dayDetailsTemplate");
        const content = document.importNode(template.content, true);
        const children = Array.from(content.children);

        children.forEach(function(child){
            let selection;
            switch(children.indexOf(child)){
                case 0:
                case 3: 
                    selection = Object.create(selectorProtos.arrayValuesSelectorProto)
                break;
                case 1:
                case 2:
                    selection = Object.create(selectorProtos.rangeValuesSelectorProto)
                break;
            }
            //cache DOM
            selection.el = child.querySelector(".selector");
            const primaryClass = Array.from(this.el.classList)[0];
            
            //bind events
            if(primaryClass == "startTime"){
                selection.el.addEventListener("change", selection.modifyEndTimeDefaultValue) 
            }
            selection.el.addEventListener("change", selection.disableDefaultOption) 
            selection.el.addEventListener("change", function publishSelectionValueChange(){
                const selector = primaryClass;
                const value = selection.el.value //does this need to be below const value declared below?
                events.publish("modifySelectorValues", optNum, dayNum, selector, value)
            })

            //add dynamic elements
            selection.buildSelectorOptions(primaryClass);

            //set values
            selection.el.value = dayDetails[primaryClass];
            const selectedOption= child.querySelector(`select.selector option[value = ${selection.el.value}]`);
            selectedOption.selected = true;
            if(selectedOption.value != "default"){
                selection.el.firstChild.disabled = true;
            }
        });

        return content
    }

    const selectorProtos = (function(){ //maybe its own module for other selector DOM elements on different pages
        const selectorProto = {
       
            disableDefaultOption: function disableDefaultOption(){
                const values = Array.from(this.children);
                values[0].disabled = true;
            },
    
            modifyEndTimeDefaultValue: function modifyEndTimeDefaultValue(){
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
            },
        };
    
        const arrayValuesSelectorProto = Object.create(selectorProto);
        
        arrayValuesSelectorProto.buildSelectorOptions = function buildSelectorOptions(primaryClass){
            const optionValues = selectionOptions[primaryClass];
            optionValues.forEach(function(optionValue){
                const option = document.createElement("option");
                option.value = optionValue;
                option.innerHTML = optionValue;
                this.el.appendChild(option);
            })
        };
    
        const rangeValuesSelectorProto = Object.create(selectorProto);
    
        rangeValuesSelectorProto.buildSelectorOptions = function buildSelectorOptions(primaryClass){
            const optionValues = selectionOptions[primaryClass];
            for(let i = optionValues.start; i<optionValues.end; i += optionValues.increment){
                const option = document.createElement("option");
                option.value = i;
                if(primaryClass == "teamSize"){
                    option.innerHTML = i;
                }else{
                    //option.innerHTML = CONVERTTIME
                }this.el.appendChild(option);
            }
        }

        return {arrayValuesSelectorProto, rangeValuesSelectorProto}
    })()
})()