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
        allUsersDataStable = adminAllUsers.allUsers;
		allUsersDataMutable = [];
        createAllUsersDeepCopy(allUsersDataMutable, allUsersDataStable)
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
		
        createAllUsersDeepCopy(allUsersDataStable, allUsersDataMutable);
		events.publish("renderUpdatedUserData", allUsersDataMutable)
    }

    function createAllUsersDeepCopy(newArr, copyArr){
		copyArr.forEach(function(user){
			newArr.push(Object.assign({}, user));
		})
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
		createAllUsersDeepCopy(allUsersDataStable, allUsersDataMutable);
		events.publish("renderUpdatedUserData", allUsersDataMutable)
	}

	
})()

export {allUsersData}