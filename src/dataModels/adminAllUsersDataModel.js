import {events} from "../events"

/*purpose: dataModel for selecting individual user from allUsers to add/edit/delete

adminAllUsers array is modeled as such:

allUsers = 
	[
		{
            name,
            color,
            password, //MAKE SURE THIS DOES NOT GET PASSED TO FRONT END
            privilegeLevel,
            teams:{},
            availability:{},
            lastVerified
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
	let allUsers;

	events.subscribe("adminMainPageModelBuilt", populateAllUsers)
	events.subscribe("editUser", editUser);
	events.subscribe("deleteUser", deleteUserForDatabaseUpdate);
	events.subscribe("userDataValidated", addEditUserForDatabaseUpdate)

	function populateAllUsers(adminAllUsers){
		allUsers = adminAllUsers.concat(); //should not need deeper recursive copying
	}

	function editUser(userData){
		const thisUser = allUsers.filter(function(user){
			return userData.userName = user.userName
		})[0];

		events.publish("userEditDataLoaded", thisUser);
	}

	function deleteUserForDatabaseUpdate(userData){
		const allUsersSlice = allUsers.concat();
		const existingUserIndex = allUsersSlice.findIndex(function(users){
			return users.userName = userData.userName
		})

		allUsersSlice.splice(existingUserIndex, 1);

		events.publish("allUsersDataUpdated", allUsersSlice); //find database listener for this
	}

	function addEditUserForDatabaseUpdate(validatedUserData){
		const allUsersSlice = allUsers.concat();
		const existingUserIndex = findExistingUser()

		if(existingUserIndex != -1){
			allUsersSlice.splice(existingUserIndex, 1, validatedUserData.newData)
		}else{
			allUsersSlice.push(validatedUserData.newData)
		}
		
		events.publish("allUsersDataUpdated", allUsersSlice) //find database listener for this

		function findExistingUser(){
			const existingUser = allUsersSlice.findIndex(function(users){
				return validatedUserData.existingData.name == users.name
			})
			return existingUser;
		}
	}


})()

export {adminAllUsersDataModel}