import {events} from "../events"
/*
actions: single team interface for creating/editing/deleting teamRequest data

publishes:
    teamName changes
    teamSize changes
    dayOfWeek, startTime, endTime, inWeiss changes
    add/delete/reorder option requests
    add/delete day requests
    teamRequest validation requests

subscribes to:

    workingModel updates to:
        option length/ option rank/ day length/ dayDetail values
    workingModel generation

        FROM: teamRequestModel
    
    selectorNodeDOM:
        FROM: selectorDOM
*/

const requestFormDOM = (function(){
    
    events.subscribe("workingModelPopulated", publishRequestFormRender)
    events.subscribe("optionsModified", renderAllOpts)
    events.subscribe("selectorsBuilt", setSelectorNodes)
    events.subscribe("allTeamsDataLoaded", loadAllTeamsNamesList); //this seems like bad separation of concerns/SR principle, but this is my current solution

    
    let allTeamsNamesList;

    const selectorNodes = {
        startTime: null,
        endTime: null,
        teamSize: null,
        dayOfWeek: null,
        inWeiss: null
    };

    function loadAllTeamsNamesList(allTeams){ //make sure data types align here
        allTeamsNamesList = [];
        allTeamsNamesList = [...allTeams]
        
    }

    function setSelectorNodes(obj){
        for(let prop in obj){
            switch(prop){
                case `dayOfWeek`:
                case `startTime`:
                case `endTime`:
                case `teamSize`:
                case `inWeiss`:
                    selectorNodes[prop] = prop.value;
                    break;
                default:
                    return;
            }  
        }  
    }

    function publishRequestFormRender(workingModel){
        const requestPage = renderRequestFormPage(workingModel);
        events.publish("renderPage", requestPage);
    }


    function renderRequestFormPage(workingModel){
        
        const template = document.querySelector("#requestFormPageTemplate");
        const content = document.importNode(template.content, true);
        const teamName = content.querySelector("#formTeamNameDiv");
        const teamSize = content.querySelector("#formTeamSizeDiv"); 
        const allOpts = content.querySelector("#formAllOpts");
        const addButton = content.querySelector("#addTrainingOption");
        const updateButton = content.querySelector("#updateTeamRequest");
        const cancelButton = content.querySelector("#cancelTeamRequest");

        addButton.addEventListener("click", addOption);
        updateButton.addEventListener("click", updateTeamRequest);
        cancelButton.addEventListener("click", cancelTeamRequest);

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
            events.publish("updateTeamRequest")
        }
        
        function cancelTeamRequest(){
            events.publish("mainPageDOMRequested")
        }
    
        
        return content;
    }
    

    function renderTeamName(workingModel){ //check this
        
        const template = document.querySelector("#teamNameTemplate");
        const content = document.importNode(template.content, true);
        const teamName = content.querySelector("#formTeamName");
        const teamNameNew = document.createElement("input");
        
        teamNameNew.value = workingModel.teamName;

        teamNameNew.addEventListener("blur", function modifyTeamNameValue(){ 
            if(workingModel.teamName != teamNameNew.value && blockTeamDuplication(teamNameNew.value) == true){ //make sure teamNameNew.value refers to correct location
                alert(`Data already exists for ${teamNameNew.value}. Use another team name or select edit for ${teamNameNew.value}`);
                teamNameNew.value = "";
            }   
            else if(workingModel.teamName != "" && teamNameNew.value != workingModel.teamName){
                const confirmation = confirm(`If you submit changes, this will change team name from ${workingModel.teamName} to ${teamNameNew.value}. Proceed? `);
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

        function blockTeamDuplication(thisTeamName){//make sure proper object comparision occurs here
            const teamCheck = allTeamsNamesList.filter(function(team){
                return team == thisTeamName
            })
            return teamCheck.length>0;
        }
    }

    
    function renderTeamSizeSelection(workingModel){

        const template = document.querySelector("#teamSizeTemplate");
        const content = document.importNode(template.content, true);
        const formTeamSize = content.querySelector("#formTeamSize");
        const selection = selectorNodes[`${primaryClass}`].cloneNode(true);
        const primaryClass = Array.from(this.classList)[0];
            
        selection.value = workingModel.teamSize;
        const selectedOption= selection.querySelector(`option[value = ${selection.value}]`);
        selectedOption.selected = true;
        if(selectedOption.value != "default"){
            selection.firstChild.disabled = true;
        }
        
        formTeamSize.replaceWith(selection);
        selection.id = "formTeamSize";

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
        
        const allOpts = document.querySelector("#formAllOpts");
        if(allOpts != null){
            allOpts.replaceWith(allOptsNew);
        }
        else{
            return allOptsNew
        }  
    }  


    function buildOption(allOptsDetails, optionDetails, optNum){
        
        const template = document.querySelector("#optionTemplate");
        const content = document.importNode(template.content, true);
        const labelButtonDiv = content.querySelector(".labelDeleteOptButton");
        const label = content.querySelector(".optLabel");
        const allDaysModel = content.querySelector(".formAllDays"); 
        const addDayButton = content.querySelector(".addTrainingDay");

        label.innerHTML = `Option ${optNum}`;

        events.subscribe("daysModified", renderModifiedDayDetails)
        addDayButton.addEventListener("click", addDay);

        if(allOptsDetails.length >1){
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("deleteOpt");
            deleteButton.addEventListener("click", deleteOpt)
            labelButtonDiv.appendChild(deleteButton)

            if(optNum !=1){
                const upButton = document.createElement("button"); //up icon if possible, set class and CSS
                upButton.addEventListener("click", moveOptionUp);
                labelButtonDiv.appendChild(upButton)
            }
            if(optNum != allOptsDetails.length){
                const downButton = document.createElement("button"); //down icon if possible, set class and CSS
                downButton.addEventListener("click", moveOptionDown);
                labelButtonDiv.appendChild(downButton)
            }
        }
        renderAllDaysDetails(optionDetails, optNum, allDaysModel); 

        return content
        
        function addDay(){
            events.publish("addDay", optNum)
        }

        function deleteOpt(){
            events.publish("deleteOpt", optNum)
        }

        function moveOptionUp(){
            events.publish("modifyOptOrder", {optNum, modifier:-1}) 
        }

        function moveOptionDown(){
            events.publish("modifyOptOrder", {optNum, modifier:1})
        }

        function renderModifiedDayDetails(obj){
            if(obj.publishedOptNum == optNum){
                const allOpts = document.querySelector("#formAllOpts");
                const thisOption = Array.from(allOpts.children)[optNum-1];
                const allDaysDOM = thisOption.querySelector(".formAllDays");
                renderAllDaysDetails(obj.publishedOptionDetails, obj.publishedOptNum, allDaysDOM)
            }
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
      
        const template = document.querySelector("#dayTemplate");
        const content = document.importNode(template.content, true);
        const labelButtonDiv = content.querySelector(".labelDeleteDayButton");
        const label = content.querySelector(".dayLabel");
        const allDaysDetails = content.querySelector(".formAllDayDetails");
        
        label.innerHTML = `Day ${dayNum}`;
        
        if(optionDetails.length>1){
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("deleteDay");
            deleteButton.addEventListener("click", deleteDay);
            labelButtonDiv.appendChild(deleteButton)
        }
        renderDayDetails();

        return content
        
        function renderDayDetails(){
            const allDayDetailsNew = buildDayDetails(dayDetails, optNum, dayNum);
            allDaysDetails.replaceWith(allDayDetailsNew);
            allDayDetailsNew.classList.add("formAllDayDetails")
        }

        function deleteDay(){
            events.publish("deleteDay", {optNum, dayNum})
        } 
    }
    

    function buildDayDetails(dayDetails, optNum, dayNum){
        
        const template = document.querySelector("#dayDetailsTemplate");
        const content = document.importNode(template.content, true);
        const children = Array.from(content.children);

        children.forEach(function(child){
            const selection = child.querySelector(".selector");
            const primaryClass = Array.from(selection.classList)[0];
            
            const selectionNew = selectorNodes[`${primaryClass}`].cloneNode(true);
            selectionNew.addEventListener("change", publishSelectionValueChange)

            selectionNew.value = dayDetails[primaryClass];
            const selectedOption = selectionNew.querySelector(`option[value = ${selectionNew.value}]`);
            selectedOption.selected = true;
            if(selectedOption.value != "default"){
                selectionNew.firstChild.disabled = true;
            }
        
            selection.replaceWith(selectionNew);

            function publishSelectionValueChange(){
                const selector = primaryClass;
                const value = selectionNew.value
                events.publish("modifySelectorValue", {optNum, dayNum, selector, value})
            }
        });

        return content

       
    }

})();

export{requestFormDOM}