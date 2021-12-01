import { events } from "../events";

/*purpose: dataModel for creating/modifying individual user data 

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
    userModel data FOR adminUserGeneratorDOM
    validation requests to save data FOR userValidator
   
subscribes to: 
    addUser requests FROM adminMainPageModel
    editUser data FROM adminAllUsersDataModel
	userData save requests FROM adminUserGeneratorDOM
    data modifications for name/password/color/privelege FROM adminUserGeneratorDOM
*/

const adminUserDataModel = (function(){
    //no obvious issues, ensure that password does not come to front-end, ensure empty obj for newUser teams/availability is compatible with teamRequest and availabilty on userDOM
    let userModel;
    let userModelCopy;

    events.subscribe("modifyUserNameValue", setName);
    events.subscribe("adminModifyUserPasswordValue", adminSetPassword)
    events.subscribe("modifyUserPrivilegeLevelValue", setPrivilegeLevel)
    events.subscribe("modifyUserColorValue", setColor)
    events.subscribe("userEditDataLoaded", populateUserModel);
    events.subscribe("addUser", createNewUser);
    events.subscribe("saveUserDataClicked", validateChanges);
    
    
    function populateUserModel(userData){
        userModel = Object.assign({}, userData);
        userModelCopy = Object.assign({}, userModel)

        events.publish("userModelPopulated", userModel)
    }
    
    function createNewUser(){
        userModel = {
            name: "",
            color: "#000000",
            password: "",
            privilegeLevel: false,
            teams:{},
            availability:{},
            lastVerified: null
        };
        userModelCopy = Object.assign({}, userModel);

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