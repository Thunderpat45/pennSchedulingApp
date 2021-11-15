import {events} from "../events"

const adminAllUsersDataModel = (function(){

	let allUsers;

	//events (edit, populate allUsers, validate(?));   decide on validate for the editUserForDatabaseUpdate function
	events.subscribe("editUser", editUser);
	events.subscribe("deleteUser", deleteUserForDatabaseUpdate);

	function populateAllUsers(adminAllUsers){
		allUsers = adminAllUsers.concat(); //does this need any more recursive copying?
	}

	function editUser(userData){
		const thisUser = allUsers.filter(function(user){
			return userData.userName = user.userName
		})[0];

		events.publish("userEditDataLoaded", thisUser);
	}

	function deleteUserForDatabaseUpdate(user){
		const allUsersSlice = allUsers.concat();
		const existingUserIndex = allUsersSlice.findIndex(function(users){
			return users.userName = user.userName
		})

		allUsersSlice.splice(existingUserIndex, 1);

		events.publish("allUsersDataUpdated", allUsersSlice);
	}

})()

export {adminAllUsersDataModel}