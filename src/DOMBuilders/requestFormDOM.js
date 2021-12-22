import {events} from "../events"

/*action: user interface creating/editing team name/size/ schedule requests

teamDataModel object is modeled as such:

obj = 
    { 
        teamName,
        teamSize, 
        rank:
            {
                myTeams,
                allTeams
            },
        allOpts: [[{dayOfWeek, startTime, endTime, inWeiss}, {etc}], [{etc}, {etc}], []],
        coach,
    }

publishes:
    requestForm page render requests FOR pageRenderer
    mainPageDOM requests FOR mainPageData
    update requests FOR teamRequestModel
    team name/size, daySelector value changes for teamRequestModel
    add/delete/reorder options, add/delete days for teamRequest Model
    
subscribes to: 
    allTeamsList FROM mainPageData
    teamData generation/ teamData option/day additions/removals FROM teamRequestModel
    selectors nodes FROM selectorDOMBuilder
    
*/
const requestFormDOM = (function(){
    
    events.subscribe("workingModelPopulated", publishRequestFormRender)
    events.subscribe("optionsModified", renderAllOpts)
    events.subscribe("userSelectorsBuilt", setSelectorNodes)
    events.subscribe("mainPageModelBuilt", setAllTeams);

    
    let allTeams;

    const selectorNodes = {
        startTime: null,
        endTime: null,
        teamSize: null,
        dayOfWeek: null,
        inWeiss: null
    };

    function setAllTeams(mainPageData){
       allTeams = mainPageData.allTeams;      
    }

    function setSelectorNodes(selectorElementObj){
        for(let selectorElement in selectorElementObj){
            switch(selectorElement){
                case `dayOfWeek`:
                case `startTime`:
                case `endTime`:
                case `teamSize`:
                case `inWeiss`:
                    selectorNodes[selectorElement] = selectorElementObj[selectorElement];
                    break;
                default:
                    break;
            }  
        }  
    }

    function publishRequestFormRender(workingModel){
        const requestPage = renderRequestFormPage(workingModel);
        events.publish("pageRenderRequested", requestPage);
    }


    function renderRequestFormPage(workingModel){
        const template = document.querySelector("#requestFormPageTemplate");
        const content = document.importNode(template.content, true);

        const teamName = content.querySelector("#formTeamName");
        const teamSize = content.querySelector("#formTeamSize"); 
        const allOpts = content.querySelector("#formAllOpts");
        const addButton = content.querySelector("#addTrainingOption");
        const updateButton = content.querySelector("#updateTeamRequest");
        const cancelButton = content.querySelector("#cancelTeamRequest");

        const teamNameNew = renderTeamName(teamName, workingModel);
        const teamSizeNew = renderTeamSizeSelection(teamSize, workingModel);
        const allOptsNew = renderAllOpts(workingModel);

        teamName.replaceWith(teamNameNew);
        teamSize.replaceWith(teamSizeNew);
        allOpts.replaceWith(allOptsNew);

        addButton.addEventListener("click", addOption);
        updateButton.addEventListener("click", updateTeamRequest);
        cancelButton.addEventListener("click", cancelTeamRequest);

        return content;

        function addOption(){
            events.publish("addOpt")
        }
        
        function updateTeamRequest(){
            events.publish("updateTeamRequest")
        }
        
        function cancelTeamRequest(){
            events.publish("mainPageDOMRequested")
        }    
    }
    

    function renderTeamName(teamNameDOM, workingModel){
        
        teamNameDOM.value = workingModel.name;

        teamNameDOM.addEventListener("blur", function modifyTeamNameValue(){ 
            if(workingModel.name != teamNameDOM.value && blockTeamDuplication() == true){
                alert(`Data already exists for ${teamNameDOM.value}. Use another team name or select edit for ${teamNameDOM.value}`);
                teamNameDOM.value = workingModel.name;
                teamNameDOM.focus();
            }else if(workingModel.name != "" && teamNameDOM.value != workingModel.name){
                const confirmation = confirm(`If you submit changes, this will change team name from ${workingModel.name} to ${teamNameDOM.value}. Proceed? `);
                if(confirmation){
                    events.publish("modifyTeamNameValue", teamNameDOM.value)
                }else{
                    teamNameDOM.value = workingModel.name;
                }
            }else if(workingModel.name != teamNameDOM.value){
                events.publish("modifyTeamNameValue", teamNameDOM.value)
            } 
        })

        return teamNameDOM;

        function blockTeamDuplication(){
            const teamCheck = allTeams.some(function(thisTeam){
                return thisTeam.name.toLowerCase() == teamNameDOM.value.toLowerCase();
            })
            return teamCheck;
        }
    }

    
    function renderTeamSizeSelection(teamSizeDOM, workingModel){
        const primaryClass = Array.from(teamSizeDOM.classList)[0];
        
        const selection = selectorNodes[`${primaryClass}`].cloneNode(true);  
        selection.id = "formTeamSize";

        const selectedOption= selection.querySelector(`option[value = "${workingModel.size}"]`);
        selectedOption.selected = true;
        if(selectedOption.value != "default"){
            selection.firstChild.disabled = true;
        }


        selection.addEventListener("change", modifyTeamSizeValue)
        selection.addEventListener("change", disableDefaultOption)
        
        teamSizeDOM.replaceWith(selection); //may be able to get rid of this

        return selection

        function modifyTeamSizeValue(){
            const value = selection.value 
            events.publish("modifyTeamSizeValue", value)
        }

        function disableDefaultOption(){ //these are all not working, may need to use event delegation within the modules themselves
            const values = Array.from(this.children);
            values[0].disabled = true;
        }
    }

    
    function renderAllOpts(workingModel){ 
        const allOptsNew = document.createElement("div");
        allOptsNew.id = "formAllOpts"; 

        workingModel.allOpts.forEach(function(optionDetails){
            const optNum = workingModel.allOpts.indexOf(optionDetails) + 1; 
            const option = buildOption(workingModel.allOpts, optionDetails, optNum);
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
        
        events.subscribe("daysModified", renderModifiedDayDetails)
        
        const template = document.querySelector("#optionTemplate");
        const content = document.importNode(template.content, true);

        const labelButtonDiv = content.querySelector(".labelDeleteOptButton");
        const label = content.querySelector(".optLabel");
        const allDaysDOM = content.querySelector(".formAllDays"); 
        const addDayButton = content.querySelector(".addTrainingDay");

        label.innerHTML = `Option ${optNum}`;

        if(allOptsDetails.length >1){
            const deleteButton = document.createElement("button");
            const upButton = document.createElement("button"); //both need class and css
            const downButton = document.createElement("button");
            
            deleteButton.classList.add("deleteOpt");
            upButton.classList.add("myTeamsMoveUpButton");
            downButton.classList.add("myTeamsMoveDownButton");

            deleteButton.addEventListener("click", deleteOpt)
            upButton.addEventListener("click", moveOptionUp);
            downButton.addEventListener("click", moveOptionDown);

            deleteButton.innerText = "X"

            labelButtonDiv.appendChild(deleteButton)

            if(optNum != 1 && optNum != allOptsDetails.length){
                labelButtonDiv.appendChild(upButton)
                labelButtonDiv.appendChild(downButton)
            }
            if(optNum == allOptsDetails.length){
                labelButtonDiv.appendChild(upButton)
            }
            if(optNum == 1){
                labelButtonDiv.appendChild(downButton)
            }
        }

        addDayButton.addEventListener("click", addDay);
        
        renderAllDaysDetails(optionDetails, optNum, allDaysDOM); 

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

        function renderModifiedDayDetails(dayDetailsObj){
            if(dayDetailsObj.publishedOptNum == optNum){
                const allOpts = document.querySelector("#formAllOpts");
                const thisOption = Array.from(allOpts.children)[optNum-1];
                const allDaysDOM = thisOption.querySelector(".formAllDays");

                renderAllDaysDetails(dayDetailsObj.publishedOptionDetails, dayDetailsObj.publishedOptNum, allDaysDOM)
            }
        }
    }


    function renderAllDaysDetails(optionDetails, optNum, allDaysDOM){
        const allDaysDOMNew = document.createElement("div");  
        allDaysDOMNew.classList.add("formAllDays")

        optionDetails.forEach(function(dayDetails){
            const dayNum = optionDetails.indexOf(dayDetails) +1; 
            const day = buildDay(optionDetails, dayDetails, optNum, dayNum);
            allDaysDOMNew.appendChild(day);
        })
        allDaysDOM.replaceWith(allDaysDOMNew);
        
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
            deleteButton.innerText = "X"
            
            deleteButton.addEventListener("click", deleteDay);
            labelButtonDiv.appendChild(deleteButton)
        }
        
        const allDaysDetailsNew = buildDayDetails(dayDetails, optNum, dayNum);

        allDaysDetails.replaceWith(allDaysDetailsNew)

        return content

        function deleteDay(){
            events.publish("deleteDay", {optNum, dayNum})
        } 
    }
    

    function buildDayDetails(dayDetails, optNum, dayNum){        
        const template = document.querySelector("#dayDetailsTemplate");
        const content = document.importNode(template.content, true);

        const selectors = content.querySelectorAll(".selector")

        selectors.forEach(function(selection){
            const primaryClass = Array.from(selection.classList)[0];
            
            const selectionNew = selectorNodes[`${primaryClass}`].cloneNode(true);
            selectionNew.addEventListener("change", publishSelectionValueChange);
            selectionNew.addEventListener("change", disableDefaultOption);
            if(primaryClass == "startTime"){
                selectionNew.addEventListener("click", modifyEndTimeDefaultValue)
            }

            const selectedOption = selectionNew.querySelector(`option[value = "${dayDetails[primaryClass]}"]`);
            selectedOption.selected = true;
            if(selectedOption.value != "default"){
                selectionNew.firstChild.disabled = true;
            }
        
            selection.replaceWith(selectionNew);

            function publishSelectionValueChange(){
                const selector = primaryClass;
                const value = selectionNew.value
                events.publish("modifyTeamSelectorValue", {optNum, dayNum, selector, value})
            }

            function disableDefaultOption(){ //these are all not working, may need to use event delegation within the modules themselves
                const values = Array.from(this.children);
                values[0].disabled = true;
            }


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
        });

        return content

       
    }

})();

export{requestFormDOM}