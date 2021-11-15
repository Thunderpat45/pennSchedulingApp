import { events } from "../events";


/* */

const adminUserDataModel = (function(){

    let userModel;
    let userModelCopy;

    events.subscribe("modifyUserNameValue", setName);
    events.subscribe("modifyUserPasswordDefaultValue", setPasswordDefault)
    events.subscribe("modifyUserPrivilegeLevelValue", setPrivilegeLevel)
    events.subscribe("modifyUserColorValue", setColor)
    events.subscribe();
    
    function populateUserModelCopy(){
        userModelCopy = Object.assign({}, userModel); //make sure it goes appropriately recursive for necessary levels of each property, as they are fleshed out, add event.publish, DO ALL THIS EXCEPT ENSURE PASSWORD DOES NOT COME TO FRONT END
        events.publish("userModelPopulated", userModel)
    }
    
    function createNewUser(){
        userModel = { //check all these default values
            name: "",
            color: "default",
            password: "",
            privilegeLevel: null,
            teams:{},
            availability:{},
            lastVerified: null
        };
    }

    function setName(name){
        userModelCopy.name = name;
    }

    function setColor(color){
        userModelCopy.color = color
    }

    function setPasswordDefault(password){
        if(password && password.value != ""){
            userModelCopy.password = password
        }
    }

    function setPrivilegeLevel(privilege){
        userModelCopy.privilege = privilege;
    }

    function deleteUser(){} //figure these 3 out, this one doesn't go here(?)

    function saveChanges(){} //send this to userValidator first, especially for password stuff

    function cancelChanges(){}

})()
export {adminUserDataModel}