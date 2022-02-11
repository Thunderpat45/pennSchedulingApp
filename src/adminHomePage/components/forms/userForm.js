import { events } from "../../../events";


//add events to listen for button to do this
function renderFacilityDataForm(userData){
    const formDiv = document.querySelector("#entryForm")

    const elements = setElements();
    populateFields(elements, userData);
    setEventListeners(elements, userData);

    if(formDiv.firstChild){
        while(formDiv.firstChild){
            formDiv.remove(formDiv.firstChild)
        }
    }

    formDiv.appendChild(elements.content);
} 


function setElements(){
    const template = document.querySelector("#adminUserGeneratorTemplate");
    const content = document.importNode(template.content, true);

    const name = content.querySelectorAll("#userGeneratorName");                  
    const privilege = content.querySelector("#userGeneratorPrivilege");
    const color = content.querySelector("#userGeneratorColor");

    const saveButton = content.querySelector("#userGeneratorSaveButton");
    const cancelButton = content.querySelector("#userGeneratorCancelButton"); 

    return {content, name, privilege, color, saveButton, cancelButton}
}


function populateFields(userElements, userData){
    userElements.name.value = userData.name;
    if(userData.privilege == true){
        userElements.privilege.checked = true;
    }
    userElements.color.value = userData.color;
}


function setEventListeners(userElements, userData){
    userElements.name.addEventListener("blur", modifyUserNameValue);
    userElements.privilege.addEventListener("blur", updateUserPrivilege);
    userElements.color.addEventListener("blur", verifyColorChange);
    userElements.saveButton.addEventListener("click", saveUserData);
    userElements.cancelButton.addEventListener("click", cancelUserChanges);

    function saveUserData(){
        events.publish("saveUserDataClicked")
    }

    function cancelUserChanges(){
        events.publish("adminMainPageDOMRequested")
    }

    function modifyUserNameValue(){ 
        if(userData.name != "" && userElements.name.value != userData.name){
            const confirmation = confirm(`If you submit changes, this will change the user name from ${userData.name} to ${userElements.name.value}. Proceed? `);
            if(confirmation){
                events.publish("modifyUserNameValue", userElements.name.value)
            }else{
                userElements.name.value = userData.name; 
            }
        }else if(userData.name != userElements.name.value){
            events.publish("modifyUserNameValue", userElements.name.value)
        } 

        // add this to server side validation
        // if(userData.name != userElements.name.value && blockNameDuplication(userElements.name.value)){
        //     alert(`Data already exists for ${userElements.name.value}. Use another name or edit/delete the other user for the name you are trying to switch to.`);
        //     userElements.name.value = "";
        //     userElements.name.focus()
        //}
    }

    function updateUserPrivilege(){
        
        if(userElements.privilege.checked != userData.privilegeLevel){
            events.publish("modifyUserPrivilegeLevelValue", userElements.privilege.checked)
        } 

        // add to server-side validation
        // if(userData.privilegeLevel == true & !userElements.privilege.checked && !checkForLastAdmin()){
        //     alert("Cannot demote last admin. Create new admin users before demoting this admin.")
        //     userElements.privilege.checked = true;
        // }
    }

    function verifyColorChange(){
        if(userData.color != userElements.color.value){
            events.publish("modifyUserColorValue", userElements.color.value)
        }
        
        // add to server-side validation
        // if(userData.color != userColorDOM.value && blockColorDuplication()){
        //     alert(`Another user is already using this color. Considering all the possible colors available, the odds are pretty low. Unlucky pick, I guess!`)
        //     userColorDOM.value = userData.color; 
        //     userColorDOM.focus();
        // }
    }
}

export {renderFacilityDataForm}

