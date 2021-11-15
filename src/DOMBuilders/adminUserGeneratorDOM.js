/* eslint-disable no-prototype-builtins */
import { events } from "../events";

/* displays screen for creating/editing user profiles via admin access */

const adminUserGeneratorDOM = (function(){

    let allUsersList //bad separation of concerns?

    events.subscribe("userModelPopulated", publishUserGeneratorPageRender)
    //event to set allUsersList

    function publishUserGeneratorPageRender(userModel){
        const userGeneratorPage = renderUserGeneratorDOM(userModel);
        events.publish("pageRenderRequested", userGeneratorPage)
    }

    function renderUserGeneratorDOM(userModel){
        const template = document.querySelector("#adminUserGeneratorTemplate");
        const content = document.importNode(template.content, true);
        const userName = content.querySelector("#userGeneratorNameDiv");
        const userPasswordSet = content.querySelector("#userGeneratorPasswordDiv");
        const userPrivilege = content.querySelector("#userPrivilegeDiv");
        const userColor = content.querySelector("#userGeneratorColorDiv");
        const saveButton = content.querySelector("#userGeneratorSaveButton");
        const cancelButton = content.querySelector("#userGeneratorCancelButton");

        saveButton.addEventListener("click", saveUserData) 
        cancelButton.addEventListener("click", cancelUserChanges) //other eventListeners for dataValidation
        
        const userNameNew = renderUserName(userModel) 
        const userPasswordSetNew = renderUserPassword(userModel) //this may not be necessary, but consider for validationFunctions
        const userPrivilegeNew = renderUserPrivilege(userModel)
        const userColorNew = renderUserColor(userModel)

        userName.replaceWith(userNameNew);
        userPasswordSet.replaceWith(userPasswordSetNew);
        userPrivilege.replaceWith(userPrivilegeNew);
        userColor.replaceWith(userColorNew);
       
        return content
        
        function saveUserData(){
            events.publish("saveUserDataClicked", userModel)
        }

        function cancelUserChanges(){
            events.publish("adminMainPageDOMRequested")
        }
    }

    function renderUserName(userModel){
        const template = document.querySelector("#adminUserGeneratorNameTemplate");
        const content = document.importNode(template.content, true);
        const userName = content.querySelector("#userGeneratorName");
       
        userName.value = userModel.name;

        userName.addEventListener("blur", function modifyUserNameValue(){ 
            if(userModel.name != userName.value && blockNameDuplication(userName.value) == true){ //make sure userNameNew.value refers to correct location
                alert(`Data already exists for ${userName.value}. Use another name or edit/delete the other user for the name you are trying to switch to.`);
                userName.value = "";
                userName.focus()
            }else if(userName.value == ""){
                alert("User name must have a value");
                userName.focus();
            }   
            else if(userModel.name != "" && userName.value != userModel.name){
                const confirmation = confirm(`If you submit changes, this will change the user name from ${userModel.name} to ${userName.value}. Proceed? `);
                if(confirmation){
                    events.publish("modifyUserNameValue", userName.value)
                }else{
                    userName.value = userModel.name;
                }
            }else if(userModel.name != userName.value){
                events.publish("modifyUserNameValue", userName.value)
            } 
        })

        return content;

        function blockNameDuplication(thisName){//make sure proper object comparision occurs here
            const nameCheck = allUsersList.filter(function(user){
                return user.name == thisName
            })
            return nameCheck.length>0;
        }
    }


    function renderUserPassword(userModel){ //COME BACK TO THIS
        const template = document.querySelector("#adminUserGeneratorPasswordTemplate");
        const content = document.importNode(template.content, true);
        const userPassword = content.querySelector("#userGeneratorPassword");
        
        

        userPassword.addEventListener("blur", function confirmPasswordChange(){ 
            if(userModel.hasOwnProperty("password") && userModel.password == "" && userPassword.value == ""){
                alert("A default password must be set.");
                userPassword.focus();
            }else if(!userModel.hasOwnProperty("password") && userPassword.value != ""){
                const confirmation = confirm("This will attempt to overwrite the user's previous password. Continue?")
                if(confirmation){
                    events.publish("modifyUserPasswordDefaultValue", userPassword.value)
                }else{
                    userPassword.value = "";
                }
            }else if(userPassword.value != ""){
                events.publish("modifyUserPasswordDefaultValue", userPassword.value)
            }
        })

        return content;

    }


    function renderUserPrivilege(userModel){ 
        const template = document.querySelector("#adminUserGeneratorPrivilegeTemplate");
        const content = document.importNode(template.content, true);
        const userPrivilege = content.querySelector("#userGeneratorPrivilege");
        

        userPrivilege.value = userModel.privilegeLevel
        if(userPrivilege.value == "true"){
            userPrivilege.checked = true
        }
       
        userPrivilege.addEventListener("blur", updateUserPrivilege)

        return content;

        function updateUserPrivilege(){
            if(userModel.privilegeLevel == "true" & !userPrivilege.checked){
                alert("Admins cannot be demoted.")
                userPrivilege.checked = true;
            }else if(userPrivilege.checked){
                const confirmation = confirm("Admins cannot be demoted. Continue?")
                if(confirmation){
                    userPrivilege.value = "true"
                }else{
                    userPrivilege.value = "false"
                   
                }events.publish("modifyUserPrivilegeLevelValue", userPrivilege.value)
            }else{
                userPrivilege.value = "false"
                events.publish("modifyUserPrivilegeLevelValue", userPrivilege.value)
            } 
        }
    }

    function renderUserColor(userModel){
        const template = document.querySelector("#adminUserGeneratorColorTemplate");
        const content = document.importNode(template.content, true);
        const userColor = content.querySelector("#userGeneratorColor");

        userColor.value = userModel.color

        userColor.addEventListener("blur", function verifyColorChange(){
            if(userModel.color != userColor.value && blockColorDuplication() == true){
                alert(`Another user is already using this color. Considering all the possible colors available, the odds are pretty low. Unlucky pick, I guess!`)
                userColor.value = userModel.color; 
                userColor.focus();
            }else if(userColor.value == "default"){
                alert("Color must have a value.");
                userColor.focus();
            }else if(userModel.color != userColor.value){
                events.publish("modifyUserColorValue", userColor.value)
            }
            
            function blockColorDuplication(){//make sure proper object comparision occurs here
                const nameCheck = allUsersList.filter(function(user){
                    return (user.name != userModel.name && user.color == userColor.value)
                })
                return nameCheck.length>0;
            }
        })

        return content
    }

})()

export {adminUserGeneratorDOM}