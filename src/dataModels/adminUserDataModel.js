import { events } from "../events";

/*purpose: dataModel for creating/modifying individual user data 

userObject is modeled as such:

    {
        name,
        color,
        privilegeLevel,
        teams:{},
        availability:{},
        lastVerified,
        adminPageSet,
        season
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
    //no obvious issues, ensure that password does not come to front-end
    let userModel;
    let userModelCopy;

    events.subscribe("modifyUserNameValue", setName);
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
            privilegeLevel: false,
            teams:[], 
            availability:{Sun:[], Mon:[], Tue: [], Wed: [], Thu: [], Fri: [], Sat: []}, 
            lastVerified: null,
            adminPageSet: null,
            season: "fall"
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

    function setPrivilegeLevel(privilege){
        userModelCopy.privilege = privilege;
        if(privilege == false){
            userModelCopy.adminPageSet = null
        }else{
            userModelCopy.adminPageSet = "admin"
        }
    }

    function validateChanges(){
        events.publish("userDataValidationRequested", {newData: userModelCopy, existingData:userModel})
    }

})()
export {adminUserDataModel}