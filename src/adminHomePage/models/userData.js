import { events } from "../../../src/events";

const userData = (function(){

    const userModel = {
        name: "",
        //password: coming soon
        color: "#000000",
        privilegeLevel: false,
        teams:[], 
        availability:{Sun:[], Mon:[], Tue: [], Wed: [], Thu: [], Fri: [], Sat: []}, 
        lastVerified: null,

        //both of the below properties were checkign to see which page/data was last used , cookies/sessionStorage?

        // adminPageSet: null,
        // season: "fall"
    };

    let userModelStable;
    let userModelMutable;

    events.subscribe("modifyUserNameValue", setName);
    events.subscribe("modifyUserPrivilegeLevelValue", setPrivilegeLevel)
    events.subscribe("modifyUserColorValue", setColor)
    events.subscribe("userDataEditRequested", setUserModelEditRequest);
    events.subscribe("addUserClicked", createNewUser);
    events.subscribe("updateUserDataClicked", validateChanges);
    events.subscribe("cancelUserDataChangesClicked", setUserModelCancelRequest )
    events.subscribe("editUserDataSaved", publishUserUpdatesToAllUsers);
    events.subscribe("newUserDataSaved", addUserDataToAllUsers);
    events.subscribe("userDataValidationFailed", renderUserValidationErrors);
    events.subscribe("userDataValidated", updateUserData)
        //USE ARRAY.MAP AND OBJ EQUIVALENT (?) IN DATAMODElS FOR DEEP COPIES?
    
    function setUserModelEditRequest(userData){
        userModelStable = userData
        userModelMutable = Object.assign({}, userModelStable)

        events.publish("userDataLoaded", {userData: userModelMutable, origin:"edit"})
    }

    function setUserModelCancelRequest(){
        userModelMutable = Object.assign({}, userModelStable);

        events.publish("userDataChangesCancelled")
    }

    function publishUserUpdatesToAllUsers(){
        events.publish("updateAllUsersModel", userModelMutable)
    }

    function addUserDataToAllUsers(_id){
        userModelMutable._id = _id;
        events.publish("updateAllUsersModel", userModelMutable);
    }
    
    function createNewUser(){
        userModelStable = Object.assign({}, userModel);
        userModelMutable = Object.assign({}, userModelStable);

        events.publish("newUserModelBuilt", {userData: userModelMutable, origin:"add"})
    }

    function setName(name){
        userModelMutable.name = name;
    }

    function setColor(color){
        userModelMutable.color = color
    }

    function setPrivilegeLevel(privilege){
        userModelMutable.privilegeLevel = privilege;
    }

    function validateChanges(origin){
        events.publish("userDataValidationRequested", {userData: userModelMutable, origin})
    }

    function renderUserValidationErrors(validationErrorData){
        const {errors, origin} = validationErrorData
        events.publish("renderUserValidationErrors", {data: userModelMutable, errors, origin})
    }

    function updateUserData(validatedUserData){
		if(validatedUserData.origin == "edit"){
			events.publish("userUpdateRequested", validatedUserData.userData) 
		}else{
			events.publish("newUserAdditionRequested", validatedUserData.userData)
		}
	}
})()

export {userData}

