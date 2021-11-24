import {events} from "../events"

const adminAllUsersDataModel = (function(){

	let allUsers;

	
	events.subscribe("adminMainPageModelBuilt", populateAllUsers)
	events.subscribe("editUser", editUser);
	events.subscribe("deleteUser", deleteUserForDatabaseUpdate);
	events.subscribe("userDataValidated", addEditUserForDatabaseUpdate)

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
		const existingUserIndex = allUsersSlice.findIndex(function(usersList){
			return usersList.userName = user.userName
		})

		allUsersSlice.splice(existingUserIndex, 1);

		events.publish("allUsersDataUpdated", allUsersSlice);
	}

	function addEditUserForDatabaseUpdate(obj){
		const allUsersSlice = allUsers.concat();
		const existingUserIndex = findExistingUser()

		if(existingUserIndex != undefined){
			allUsersSlice.splice(existingUserIndex, 1, obj.newData)
		}else{
			allUsersSlice.push(obj.newData)
		}
		
		events.publish("allUsersDataUpdated", allUsersSlice) //send to DB for save

		function findExistingUser(){
			allUsersSlice.filter(function(user){
				if(obj.existingData.name == user.name){
					return allUsersSlice.findIndex(function(users){ 
						return users.name = user.name
					})
				}
			})
		}
	}


})()

export {adminAllUsersDataModel}