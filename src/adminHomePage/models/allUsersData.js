import {events} from "../../../src/events"

const allUsersData = (function(){

	let allUsersDataStable;
	let allUsersDataMutable;

	events.subscribe("adminDataFetched", setDataNewPageRender);
	events.subscribe("updateAllUsersModel", setDataNewDatabasePost)

	events.subscribe("editUserClicked", editUser);
	events.subscribe("deleteUserClicked", deleteUserForDatabaseUpdate); //review/modify this
	events.subscribe("userDataValidated", updateUserData)

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
			const newUserObj = {};
			for(let prop in user){
				newUserObj[prop] = user[prop]
			}
			newArr.push(newUserObj);
		})
    }

	function editUser(userId){
		const thisUser = allUsersDataMutable.filter(function(user){
			return userId == user._id
		})[0];
		
		events.publish("userDataEditRequested", thisUser);
	}

	function deleteUserForDatabaseUpdate(userData){/////review this
		events.publish("allUsersDataUpdated", {userData}); 
		
	}

	function updateUserData(validatedUserData){
		if(validatedUserData.origin == "edit"){
			events.publish("userUpdateRequested", validatedUserData.userData) 
		}else{
			events.publish("newUserAdditionRequested", validatedUserData.userData)
		}
	}
})()

export {allUsersData}