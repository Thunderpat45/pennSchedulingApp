import {events} from "../../../src/events"

const allUsersData = (function(){

	let allUsersDataStable;
	let allUsersDataMutable;

	events.subscribe("adminDataFetched", setDataNewPageRender);
	events.subscribe("updateAllUsersModel", setDataNewDatabasePost)
	events.subscribe("deleteUserClicked", deleteUser)
	events.subscribe("editUserClicked", editUser);
	events.subscribe("userDataDeleted", setDataUserDataDeleted);
	

	function setDataNewPageRender(adminAllUsers){
        allUsersDataStable = structuredClone(adminAllUsers.allUsers);
		allUsersDataMutable = structuredClone(allUsersDataStable)
    }

    function setDataNewDatabasePost(userData){
		const thisUserIndex = allUsersDataMutable.findIndex(function(user){
			return user._id == userData._id
		});
		if(thisUserIndex != -1){
			allUsersDataMutable[thisUserIndex] = userData
		}else{
			allUsersDataMutable.push(userData);
		}
		
        allUsersDataStable= structuredClone(allUsersDataMutable);
		events.publish("renderUpdatedUserData", allUsersDataMutable)
    }

	function deleteUser(userId){
		const thisUser = allUsersDataMutable.filter(function(user){
			return userId == user._id
		})[0];

		events.publish("deleteUser", thisUser)
	}

	function editUser(userId){
		const thisUser = allUsersDataMutable.filter(function(user){
			return userId == user._id
		})[0];
		
		events.publish("userDataEditRequested", thisUser);
	}

	function setDataUserDataDeleted(userId){
		const newUsersList = allUsersDataMutable.filter(function(user){
			return userId != user._id
		})

		allUsersDataMutable = newUsersList;
		allUsersDataStable= structuredClone(allUsersDataMutable);
		events.publish("renderUpdatedUserData", allUsersDataMutable)
	}
})()

export {allUsersData}