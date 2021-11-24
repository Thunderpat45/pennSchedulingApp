import { events } from "../events";


/* */

const adminUserDataModel = (function(){

    let userModel;
    let userModelCopy;

    events.subscribe("modifyUserNameValue", setName);
    events.subscribe("adminModifyUserPasswordValue", adminSetPassword)
    events.subscribe("modifyUserPrivilegeLevelValue", setPrivilegeLevel)
    events.subscribe("modifyUserColorValue", setColor)
    events.subscribe("userEditDataLoaded", populateUserModelCopy);
    events.subscribe("addUser", createNewUser);
    events.subscribe("saveUserDataClicked", validateChanges);
    
    
    function populateUserModelCopy(){
        userModelCopy = Object.assign({}, userModel); //make sure it goes appropriately recursive for necessary levels of each property, ENSURE PASSWORD DOES NOT COME TO FRONT END
        events.publish("userModelPopulated", userModel)
    }
    
    function createNewUser(){
        userModelCopy = { //check all these default values
            name: "",
            color: "#000000",
            password: "",
            privilegeLevel: false,
            teams:{},
            availability:{},
            lastVerified: null
        };  
        events.publish("userModelPopulated", userModel)
    }

    function setName(name){
        userModelCopy.name = name;
    }

    function setColor(color){
        userModelCopy.color = color
    }

    function adminSetPassword(password){
         userModelCopy.password = password
    }

    function setPrivilegeLevel(privilege){
        userModelCopy.privilege = privilege;
    }

    function validateChanges(){
        events.publish("userDataValidationRequested", {newData: userModelCopy, existingData:userModel})
    }

})()
export {adminUserDataModel}