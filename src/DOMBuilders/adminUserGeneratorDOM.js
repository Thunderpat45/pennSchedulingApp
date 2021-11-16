/* eslint-disable no-prototype-builtins */
import { events } from "../events";

/*

actions:  admin interface for creating/editing/deleting users

publishes:
    request to render adminUserGeneratorPage
    data update requests for database
    cancellation of data changes
    requests to add/delete/modify name/password/privilege/color data

subscribes to:
    userModel builds/loads
        FROM: adminUserModel
    ANOTHER

*/


const adminUserGeneratorDOM = (function(){

    let allUsersList //bad separation of concerns?

    events.subscribe("userModelPopulated", publishUserGeneratorPageRender);
    events.subscribe("adminMainPageModelBuilt", setAllUsersAndAllSOMETHING);

    function publishUserGeneratorPageRender(userModel){
        const userGeneratorPage = renderUserGeneratorDOM(userModel);
        events.publish("pageRenderRequested", userGeneratorPage)
    }

    function setAllUsersAndAllSOMETHING(){}

    function renderUserGeneratorDOM(userModel){
        const template = document.querySelector("#adminUserGeneratorTemplate");
        const content = document.importNode(template.content, true);
        const userName = content.querySelector("#userGeneratorName");
        const userPasswordSet = content.querySelector("#userGeneratorPassword");
        const userPrivilege = content.querySelector("#userGeneratorPrivilege");
        const userColor = content.querySelector("#userGeneratorColor");
        const saveButton = content.querySelector("#userGeneratorSaveButton");
        const cancelButton = content.querySelector("#userGeneratorCancelButton");

        saveButton.addEventListener("click", saveUserData) 
        cancelButton.addEventListener("click", cancelUserChanges) //other eventListeners for dataValidation
        
        const userNameNew = renderUserName(userName, userModel) 
        const userPasswordSetNew = renderUserPassword(userPasswordSet, userModel)
        const userPrivilegeNew = renderUserPrivilege(userPrivilege, userModel)
        const userColorNew = renderUserColor(userColor, userModel)

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

    function renderUserName(userName, userModel){  
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

        return userName;

        function blockNameDuplication(thisName){//make sure proper object comparision occurs here
            const nameCheck = allUsersList.filter(function(user){
                return user.name == thisName
            })
            return nameCheck.length>0;
        }
    }


    function renderUserPassword(userPassword, userModel){

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

        return userPassword;

    }


    function renderUserPrivilege(userPrivilege, userModel){ 

        userPrivilege.value = userModel.privilegeLevel
        if(userPrivilege.value == "true"){ //make sure this isn't circular with template loading value as true
            userPrivilege.checked = true
        }
       
        userPrivilege.addEventListener("blur", updateUserPrivilege)

        return userPrivilege;

        function updateUserPrivilege(){
            if(userModel.privilegeLevel == "true" & !userPrivilege.checked && !checkForLastAdmin()){
                alert("Cannot demote last admin.")
                userPrivilege.checked = true;
            }else if(userPrivilege.value != userModel.privilegeLevel){
                events.publish("modifyUserPrivilegeLevelValue", userPrivilege.value)
            } 

            function checkForLastAdmin(){
                const adminUsers = allUsersList.filter(function(user){
                    return user.privilegeLevel == "true"
                })

                return adminUsers.length >1


            }
        }
    }

    function renderUserColor(userColor, userModel){

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

        return userColor
    }

})()

export {adminUserGeneratorDOM}