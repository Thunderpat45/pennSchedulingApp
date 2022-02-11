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
    let userModelStable;
    let userModelMutable;

    events.subscribe("modifyUserNameValue", setName);
    events.subscribe("modifyUserPrivilegeLevelValue", setPrivilegeLevel)
    events.subscribe("modifyUserColorValue", setColor)
    events.subscribe("userEditDataLoaded", populateUserModel);
    events.subscribe("addUser", createNewUser);
    events.subscribe("saveUserDataClicked", validateChanges);
    
    
    function populateUserModel(userData){
        userModelStable = Object.assign({}, userData);
        userModelMutable = Object.assign({}, userModelStable)

        events.publish("userModelPopulated", userModelMutable)
    }
    
    function createNewUser(){
        userModelStable = {
            name: "",
            color: "#000000",
            privilegeLevel: false,
            teams:[], 
            availability:{Sun:[], Mon:[], Tue: [], Wed: [], Thu: [], Fri: [], Sat: []}, 
            lastVerified: null,
            adminPageSet: null,
            season: "fall"
        };
        userModelMutable = Object.assign({}, userModelStable);

        events.publish("userModelPopulated", userModelMutable)
    }

    function setName(name){
        userModelMutable.name = name;
    }

    function setColor(color){
        userModelMutable.color = color
    }

    function setPrivilegeLevel(privilege){
        userModelMutable.privilegeLevel = privilege;
        if(privilege == false){
            userModelMutable.adminPageSet = null
        }else{
            userModelMutable.adminPageSet = "admin"
        }
    }

    function validateChanges(){
        events.publish("userDataValidationRequested", {newData: userModelMutable, existingData:userModelStable})
    }

})()
export {adminUserDataModel}

