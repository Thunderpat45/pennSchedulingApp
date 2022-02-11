import {events} from "../../events"

/*purpose: dataModel for selecting individual user from allUsers to add/edit/delete

adminAllUsers array is modeled as such:

allUsers = 
	[
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
		{etc}, {etc}
	]

	teamOrderObj obj is modeled as follows: {index, modifier}

publishes:
    user data FOR adminUserDataModel edits /adminUserGenerator DOM display
	verified user addition/edits or deletions FOR database

subscribes to: 
    adminMainPageModel builds FROM adminMainPageModel
    userData change validations FROM userValidator
	requests to edit/delete a user FROM adminMainPageDOM
*/

const adminAllUsersDataModel = (function(){ //continue REVIEW HERE
	//no obvious issues, find database update listeners for delete/modify/add allUsers, make sure password does not get passed to front-end
	let allUsersDataStable;
	let allUsersDataMutable;

	events.subscribe("adminDataFetched", setDataNewPageRender);
	events.subscribe("", setDataNewDatabasePost) //add prompt for successful save

	events.subscribe("editUser", editUser);
	events.subscribe("deleteUser", deleteUserForDatabaseUpdate);
	events.subscribe("userDataValidated", postUserForDatabaseUpdate)

	function setDataNewPageRender(adminAllUsers){
        allUsersDataStable = adminAllUsers.allUsers; //make sure this is correct property for database initial database fetch
        createAllUsersDeepCopy(allUsersDataMutable, allUsersDataStable)
    }

    function setDataNewDatabasePost(){
        createAllUsersDeepCopy(allUsersDataStable, allUsersDataMutable);
    }

    function createAllUsersDeepCopy(newArr, copyArr){
        newArr = copyArr.concat();
    }

	function editUser(userData){
		const thisUser = allUsersDataMutable.filter(function(user){
			return userData._id == user._id
		})[0];

		events.publish("userEditDataLoaded", thisUser);
	}

	function deleteUserForDatabaseUpdate(userData){
		if(userData.privilegeLevel == true && !checkForLastAdmin()){
			const errorString = "Cannot demote last admin. Create new admin users before deleting this admin."
			events.publish("", errorString); //add prompt about invalidation
		}else{
			events.publish("allUsersDataUpdated", {userData}); //find database listener for this, change thsi to deleteRequested?
		} 	
	}

	function postUserForDatabaseUpdate(validatedUserData){	
		events.publish("allUsersDataUpdated", validatedUserData) //find database listener for this, change to postRequested?
	}

	function checkForLastAdmin(){
		const adminUsers = allUsersDataMutable.filter(function(user){
			return user.privilegeLevel == true
		})

		return adminUsers.length >1
	}
})()

export {adminAllUsersDataModel}