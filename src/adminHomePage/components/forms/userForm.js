import { events } from "../../../../src/events";

const userDataFormComponent = (function(){

    events.subscribe("userDataLoaded", renderUserDataForm); 
    events.subscribe("newUserModelBuilt", renderUserDataForm)
    events.subscribe("userDataChangesCancelled", unrenderUserDataForm);
    events.subscribe("editUserDataSaved", unrenderUserDataForm)
    events.subscribe("newUserDataSaved", unrenderUserDataForm);
    events.subscribe("renderUserValidationErrors", renderUserDataValidationErrors)

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
                events.publish("updateUserDataClicked", origin)   
            }       
        }

        function cancelUserChanges(){
            events.publish("cancelUserDataChangesClicked")
        }

        function modifyUserNameValue(){ 
            try{
                if(userData.name != "" && userElements.name.value != userData.name){
                    const confirmation = confirm(`If you submit changes, this will change the user name from ${userData.name} to ${userElements.name.value}. Proceed? `);
                    if(confirmation){
                        events.publish("modifyUserNameValue", userElements.name.value)
                    }else{
                        userElements.name.value = userData.name;
                        throw false 
                    }
                }else if(userData.name != userElements.name.value){
                    events.publish("modifyUserNameValue", userElements.name.value)
                } 
            }catch(err){
                return err
            }
        }

        function verifyPasswordValue(){
            const passwordDiv = document.querySelector('#userGeneratorPassword')
            if(passwordDiv){
                events.publish('modifyUserPasswordValue', userElements.password.value)
            } 
        }

        function updateUserPrivilege(){
            
            if(userElements.privilege.checked != userData.privilegeLevel){
                events.publish("modifyUserPrivilegeLevelValue", userElements.privilege.checked)
            } 
        }

        function verifyColorChange(){
            if(userData.color != userElements.color.value){
                events.publish("modifyUserColorValue", userElements.color.value)
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

export {userDataFormComponent}

