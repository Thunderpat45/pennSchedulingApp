/* eslint-disable no-prototype-builtins */
import { events } from "../events";

/*

purpose:  admin interface for creating/editing/deleting users

userObject is modeled as such:

    {
        name,
        color,
        password, //MAKE SURE THIS DOES NOT GET PASSED TO FRONT END
        privilegeLevel,
        teams:{},
        availability:{},
        lastVerified
    }, 

publishes:
    page render requests FOR pageRenderer
    data save requests FOR adminUserDataModel
    data change cancellation FOR adminMainPageModel
    requests to add/delete/modify name/password/privilege/color data FOR adminUserDataModel

subscribes to:
    userModel builds/loads FROM adminUserDataModel
    adminMainPageModel data FROM adminMainPageModel
*/


const adminUserGeneratorDOM = (function(){
    //no obvious issues, make sure hasOwnProperty(password) works as only new users should have password property, existing users passwords should not be brought to front end
    let allUsersList 

    events.subscribe("userModelPopulated", publishUserGeneratorPageRender);
    events.subscribe("adminMainPageModelBuilt", setAllUsers);

    function publishUserGeneratorPageRender(userModel){
        const userGeneratorPage = renderUserGeneratorDOM(userModel);
        events.publish("pageRenderRequested", userGeneratorPage)
    }

    function setAllUsers(adminDataModel){
        allUsersList = adminDataModel.allUsers
    }

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
        cancelButton.addEventListener("click", cancelUserChanges)
        
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
            events.publish("saveUserDataClicked")
        }

        function cancelUserChanges(){
            events.publish("adminMainPageDOMRequested")
        }
    }

    function renderUserName(userNameDOM, userModel){
        
        //this is good, compare this against other validator in singleUser teams to make sure they are comprehensive;
        userNameDOM.value = userModel.name;

        userNameDOM.addEventListener("blur", function modifyUserNameValue(){ 
            if(userModel.name != userNameDOM.value && blockNameDuplication(userNameDOM.value)){
                alert(`Data already exists for ${userNameDOM.value}. Use another name or edit/delete the other user for the name you are trying to switch to.`);
                userNameDOM.value = "";
                userNameDOM.focus()
            }else if(userNameDOM.value == ""){
                alert("User name must have a value");
                userNameDOM.focus();
            }   
            else if(userModel.name != "" && userNameDOM.value != userModel.name){
                const confirmation = confirm(`If you submit changes, this will change the user name from ${userModel.name} to ${userNameDOM.value}. Proceed? `);
                if(confirmation){
                    events.publish("modifyUserNameValue", userNameDOM.value)
                }else{
                    userNameDOM.value = userModel.name;
                }
            }else if(userModel.name != userNameDOM.value){
                events.publish("modifyUserNameValue", userNameDOM.value)
            } 
        })

        return userNameDOM;

        function blockNameDuplication(thisName){
            const nameCheck = allUsersList.some(function(user){
                return user.name.toLowerCase() == thisName.toLowerCase();
            })
            return nameCheck;
        }
    }


    function renderUserPassword(userPasswordDOM, userModel){

        userPasswordDOM.addEventListener("blur", function confirmPasswordChange(){ 
            if(userModel.hasOwnProperty("password") && userPasswordDOM.value == ""){
                alert("A default password must be set.");
                userPasswordDOM.focus();
            }else if(!userModel.hasOwnProperty("password") && userPasswordDOM.value != ""){
                const confirmation = confirm("This will attempt to overwrite the user's previous password. Continue?")
                if(confirmation){
                    events.publish("adminModifyUserPasswordValue", userPasswordDOM.value)
                }else{
                    userPasswordDOM.value = "";
                }
            }else if(userPasswordDOM.value != ""){
                events.publish("adminModifyUserPasswordValue", userPasswordDOM.value)
            }
        })

        return userPasswordDOM;

    }


    function renderUserPrivilege(userPrivilegeDOM, userModel){ 

        if(userModel.privilegeLevel == true){
            userPrivilegeDOM.checked = true
        }
       
        userPrivilegeDOM.addEventListener("blur", updateUserPrivilege)

        return userPrivilegeDOM;

        function updateUserPrivilege(){
            if(userModel.privilegeLevel == true & !userPrivilegeDOM.checked && !checkForLastAdmin()){
                alert("Cannot demote last admin. Create new admin users before demoting this admin.")
                userPrivilegeDOM.checked = true;
            }else if(userPrivilegeDOM.checked != userModel.privilegeLevel){
                events.publish("modifyUserPrivilegeLevelValue", userPrivilegeDOM.checked)
            } 

            function checkForLastAdmin(){
                const adminUsers = allUsersList.filter(function(user){
                    return user.privilegeLevel == true
                })

                return adminUsers.length >1
            }
        }
    }

    function renderUserColor(userColorDOM, userModel){

        userColorDOM.value = userModel.color

        userColorDOM.addEventListener("blur", function verifyColorChange(){
            if(userModel.color != userColorDOM.value && blockColorDuplication()){
                alert(`Another user is already using this color. Considering all the possible colors available, the odds are pretty low. Unlucky pick, I guess!`)
                userColorDOM.value = userModel.color; 
                userColorDOM.focus();
            }else if(userColorDOM.value == "#000000"){
                alert("Color must have a value not equal to black. Black is default value, and must be changed.");
                userColorDOM.focus();
            }else if(userModel.color != userColorDOM.value){
                events.publish("modifyUserColorValue", userColorDOM.value)
            }
            
            function blockColorDuplication(){
                const nameCheck = allUsersList.some(function(user){
                    return (user.name != userModel.name && user.color == userColorDOM.value)
                })
                return nameCheck;
            }
        })

        return userColorDOM
    }

})()

export {adminUserGeneratorDOM}