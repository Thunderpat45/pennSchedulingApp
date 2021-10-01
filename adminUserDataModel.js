/* */

const adminUserDataModel = (function(){

    let userModel;
    let userModelCopy;

    
    function populateUserModelCopy(){
        userModelCopy = Object.assign({}, userModel); //make sure it goes appropriately recursive for necessary levels of each property, as they are fleshed out
    }
    
    function createNewUser(){
        userModel = { //check all these default values
            name: null,
            color: null,
            password: null,
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

    function setPasswordDefault(password){//check this to make sure this makes sense/is allowed
        if(userModelCopy.password == null){
            userModelCopy.password = password
        }
    }

    function setPrivilegeLevel(privilege){
        userModelCopy.privilege = privilege;
    }

    function deleteUser(){} //figure these 3 out

    function saveChanges(){}

    function cancelChanges(){}

})()
export {adminUserDataModel}