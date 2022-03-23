import {events} from "../../../events"
import { selectorBuilder } from "../../../../src/selectorDOMBuilder"
import { timeValueConverter } from "../../../../src/timeConverter";

const teamDataFormComponent = (function(){
    
    events.subscribe("teamAddRequested", renderTeamDataForm)
    events.subscribe('teamDataLoaded', renderTeamDataForm)
    events.subscribe("teamDataChangesCancelled", unrenderTeamDataForm);
  
    events.subscribe("optionsModified", rerenderTeamDataForm)



    events.subscribe("renderTeamDataValidationErrors", renderTeamDataValidationErrors)
    events.subscribe("editTeamDataSaved", unrenderTeamDataForm);
   events.subscribe('newTeamDataSaved', unrenderTeamDataForm)

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

        const teamSizeSelectorNew = selectorBuilder.runBuildSelector('teamSize');

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
            events.publish("modifyTeamSizeValue", value)
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
            events.publish("addDay", {optNum, origin: teamData.origin})
        }

        function deleteOpt(){
            events.publish("deleteOpt", {optNum, origin: teamData.origin})
        }

        function moveOptionUp(){
            events.publish("modifyOptOrder", {optNum, modifier:-1, origin: teamData.origin}) 
        }

        function moveOptionDown(){
            events.publish("modifyOptOrder", {optNum, modifier:1, origin: teamData.origin})
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
            events.publish("deleteDay", {optNum, dayNum, origin: teamData.origin})
        } 
    }
    

    function buildDayDetails(dayData, optNum, dayNum){        
        const template = document.querySelector("#dayDetailsTemplate");
        const content = document.importNode(template.content, true);

        const selectors = content.querySelectorAll(".selector")

        selectors.forEach(function(selection){
            const primaryClass = Array.from(selection.classList)[0];
    
            const selectorNew = selectorBuilder.runBuildSelector(primaryClass);
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
                events.publish("modifyTeamSelectorValue", {optNum, dayNum, modifiedSelector, value})

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
            events.publish("addOpt", teamData)
         }

        function saveTeamData(){
            if(modifyTeamNameValue() == false){
                return
            }else{
                events.publish("updateTeamClicked", teamData.origin)   
            }    
        }
        function cancelTeamChanges(){
           events.publish("cancelTeamChangesClicked")
        }

       

        function modifyTeamNameValue(){ 
            try{
                if(teamData.team.name != "" && elements.teamName.value != teamData.team.name){
                    const confirmation = confirm(`If you submit changes, this will change team name from ${teamData.team.name} to ${elements.teamName.value}. Proceed? `);
                    if(confirmation){
                        events.publish("modifyTeamNameValue", elements.teamName.value)
                    }else{
                        elements.teamName.value = teamData.team.name;
                        throw false 
                    }
                }else if(teamData.team.name != elements.teamName.value){
                    events.publish("modifyTeamNameValue", elements.teamName.value)
                }
            }catch(err){
                return err
            }
        }
    }

    function createErrorText(data, selector){
        const errorText = document.createElement("p");
        errorText.innerText = `Your selected value of ${timeValueConverter.runConvertTotalMinutesToTime(data[selector])} for ${selector} has been invalidated by a change to the opening/closing times for the facility. Speak with your supervisor to address this or change this value.`;
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

export{teamDataFormComponent}