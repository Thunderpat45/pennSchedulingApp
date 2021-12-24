

//this is a test object
let userTestObj = {
    name: "Brindle",
    privilegeLevel:false,
    availability:{
        Sun:[{startTime: "420", endTime: "540", admin: "no"}],
        Mon:[],
        Tue:[],
        Wed:[],
        Thu:[],
        Fri:[],
        Sat:[]
    },
    teams:
    [
        {
        name:"basketballWomen",
        coach: "Brindle",
        rank:
            {
                myTeams: 0,
                allTeams:6
            },
        size: 15,
        allOpts:
            [
                [
                    {dayOfWeek:"Tue", startTime: 420, endTime:495, inWeiss:"yes"},
                    {dayOfWeek:"Thu", startTime: 420, endTime:495, inWeiss:"yes"},
                    {dayOfWeek:"Fri", startTime: 420, endTime:495, inWeiss:"yes"},
                ],
            ]
        },
        
        {
            name:"basketballMen",
            coach: "Brindle",
            rank:
                {
                    myTeams: 1,
                    allTeams:5
                },
            size: 25,
            allOpts:
            
                [
                    [
                        {dayOfWeek:"Tue", startTime: 930, endTime:990, inWeiss:"yes"},
                        {dayOfWeek:"Thu", startTime: 915, endTime:975, inWeiss:"yes"},
                        {dayOfWeek:"Fri", startTime: 870, endTime:930, inWeiss:"yes"},
                    ],
                ]
        },

        {
        name: "football",
        coach:"Brindle",
        rank:
            {
                myTeams: 2,
                allTeams:1
            },
        size: 110,
        allOpts:
            [
                [
                    {dayOfWeek:"Tue", startTime: 870, endTime:915, inWeiss:"yes"},
                    {dayOfWeek:"Thu", startTime: 870, endTime:915, inWeiss:"yes"},
                    {dayOfWeek:"Fri", startTime: 945, endTime:975, inWeiss:"yes"},
                ],

                [
                    {dayOfWeek:"Wed", startTime: 870, endTime:915, inWeiss:"yes"},
                    {dayOfWeek:"Thu", startTime: 870, endTime:915, inWeiss:"yes"},
                    {dayOfWeek:"Sat", startTime: 945, endTime:975, inWeiss:"yes"},
                ],
            ]
        },
    ],
    lastVerified: null,
    adminPageSet:null,
    season:"fall",
    allTeams:
        [
            {
            name: "football",
            coach:"Brindle",
            rank:
                {
                    myTeams: 2,
                    allTeams:1
                },
            size: 110,
            allOpts:
                [
                    [
                        {dayOfWeek:"Tue", startTime: 870, endTime:915, inWeiss:"yes"},
                        {dayOfWeek:"Thu", startTime: 870, endTime:915, inWeiss:"yes"},
                        {dayOfWeek:"Fri", startTime: 945, endTime:975, inWeiss:"yes"},
                    ],
                ]
            },

            {
            name:"basketballWomen",
            coach: "Brindle",
            rank:
                {
                    myTeams: 2,
                    allTeams:6
                },
            size: 15,
            allOpts:
                
                [
                    [
                        {dayOfWeek:"Tue", startTime: 420, endTime:495, inWeiss:"yes"},
                        {dayOfWeek:"Thu", startTime: 420, endTime:495, inWeiss:"yes"},
                        {dayOfWeek:"Fri", startTime: 420, endTime:495, inWeiss:"yes"},
                    ],
                ]
            },
            
            {
                name:"basketballMen",
                coach: "Brindle",
                rank:
                    {
                        myTeams: 1,
                        allTeams:5
                    },
                size: 25,
                allOpts:
                
                    [
                        [
                            {dayOfWeek:"Tue", startTime: 930, endTime:990, inWeiss:"yes"},
                            {dayOfWeek:"Thu", startTime: 915, endTime:975, inWeiss:"yes"},
                            {dayOfWeek:"Fri", startTime: 870, endTime:930, inWeiss:"yes"},
                        ],
                    ]
                },

                {
                name:"sprintFootball",
                coach: "Dolan",
                rank:
                    {
                        myTeams: 4,
                        allTeams:4
                    },
                size: 50,
                allOpts:
                
                    [
                        [
                            {dayOfWeek:"Tue", startTime: 960, endTime:1020, inWeiss:"yes"},
                            {dayOfWeek:"Sat", startTime: 540, endTime:600, inWeiss:"yes"},
                        ],
                    ]
                },
        ],
    facilitySelectors:{
        facilityOpen:360,
        facilityClose: 1200,
        facilityMaxCapacity:150
    }

}

let adminTestObj = {
    name: "Brindle",
    privilegeLevel:true,
    availability:{
        Sun:[{startTime: "420", endTime: "540", admin: "no"}],
        Mon:[],
        Tue:[],
        Wed:[],
        Thu:[],
        Fri:[],
        Sat:[]
    },
    teams:
        [
            {
            name:"basketballWomen",
            coach: "Brindle",
            rank:
                {
                    myTeams: 0,
                    allTeams:0
                },
            size: 15,
            allOpts:
                
                [
                    [
                        {dayOfWeek:"Tue", startTime: 420, endTime:495, inWeiss:"yes"},
                        {dayOfWeek:"Thu", startTime: 420, endTime:495, inWeiss:"yes"},
                        {dayOfWeek:"Fri", startTime: 420, endTime:495, inWeiss:"yes"},
                    ],
                ]
            },
            
            {
            name:"basketballMen",
            coach: "Brindle",
            rank:
                {
                    myTeams: 1,
                    allTeams:1
                },
            size: 25,
            allOpts:
            
                [
                    [
                        {dayOfWeek:"Tue", startTime: 930, endTime:990, inWeiss:"yes"},
                        {dayOfWeek:"Thu", startTime: 915, endTime:975, inWeiss:"yes"},
                        {dayOfWeek:"Fri", startTime: 870, endTime:930, inWeiss:"yes"},
                    ],
                ]
            },
        ],
    lastVerified: null,
    adminPageSet:"admin",
    season:"fall",

    allTeams:
        [
            {
            name:"basketballWomen",
            coach: "Brindle",
            rank:
                {
                    myTeams: 0,
                    allTeams:0
                },
            size: 15,
            allOpts:
                [
                    [
                        {dayOfWeek:"Tue", startTime: 420, endTime:495, inWeiss:"yes"},
                        {dayOfWeek:"Thu", startTime: 420, endTime:495, inWeiss:"yes"},
                        {dayOfWeek:"Fri", startTime: 420, endTime:495, inWeiss:"yes"},
                    ],
                ]
            },
        
            {
            name:"basketballMen",
            coach: "Brindle",
            rank:
                {
                    myTeams: 1,
                    allTeams:1
                },
            size: 25,
            allOpts:
            
                [
                    [
                        {dayOfWeek:"Tue", startTime: 930, endTime:990, inWeiss:"yes"},
                        {dayOfWeek:"Thu", startTime: 915, endTime:975, inWeiss:"yes"},
                        {dayOfWeek:"Fri", startTime: 870, endTime:930, inWeiss:"yes"},
                    ],
                ]
            },

            {
            name: "football",
            coach:"Rivera",
            rank:
                {
                    myTeams: 0,
                    allTeams:2
                },
            size: 110,
            allOpts:
                [
                    [
                        {dayOfWeek:"Tue", startTime: 870, endTime:915, inWeiss:"yes"},
                        {dayOfWeek:"Thu", startTime: 870, endTime:915, inWeiss:"yes"},
                        {dayOfWeek:"Fri", startTime: 945, endTime:975, inWeiss:"yes"},
                    ],
                ]
            },

            {
            name:"sprintFootball",
            coach: "Dolan",
            rank:
                {
                    myTeams: 0,
                    allTeams:3
                },
            size: 50,
            allOpts:
            
                [
                    [
                        {dayOfWeek:"Tue", startTime: 960, endTime:1020, inWeiss:"yes"},
                        {dayOfWeek:"Sat", startTime: 540, endTime:600, inWeiss:"yes"},
                    ],
                ]
        },
    ],
    facilitySelectors:{
        facilityOpen:360,
        facilityClose: 1200,
        facilityMaxCapacity:120
    },

	allUsers:
	[
        {
        name: "Brindle",
        color: "#00ff00",
        privilegeLevel:true,
        availability:{
            Sun:[{startTime: "420", endTime: "540", admin: "no"}],
            Mon:[],
            Tue:[],
            Wed:[],
            Thu:[],
            Fri:[],
            Sat:[]
        },
        teams:
            [
                {
                name:"basketballWomen",
                coach: "Brindle",
                rank:
                    {
                    myTeams: 0,
                    allTeams:0
                    },
                size: 15,
                allOpts:
                    [
                        [
                            {dayOfWeek:"Tue", startTime: 420, endTime:495, inWeiss:"yes"},
                            {dayOfWeek:"Thu", startTime: 420, endTime:495, inWeiss:"yes"},
                            {dayOfWeek:"Fri", startTime: 420, endTime:495, inWeiss:"yes"},
                        ],
                    ]
                },

                {
                name:"basketballMen",
                coach: "Brindle",
                rank:
                    {
                        myTeams: 1,
                        allTeams:1
                    },
                size: 25,
                allOpts:

                    [
                        [
                            {dayOfWeek:"Tue", startTime: 930, endTime:990, inWeiss:"yes"},
                            {dayOfWeek:"Thu", startTime: 915, endTime:975, inWeiss:"yes"},
                            {dayOfWeek:"Fri", startTime: 870, endTime:930, inWeiss:"yes"},
                        ],
                    ]
                },
            ],
        lastVerified: null,
        adminPageSet:"admin",
        season:"fall"
        },

        {    
        name: "Rivera",
        color: "#0000ff",
        privilegeLevel:false,
        availability:{
            Sun:[{startTime: "420", endTime: "540", admin: "no"}],
            Mon:[],
            Tue:[],
            Wed:[],
            Thu:[],
            Fri:[],
            Sat:[]
        },
        teams:
            [
                {
                name: "football",
                coach:"Rivera",
                rank:
                    {
                        myTeams: 0,
                        allTeams:2
                    },
                size: 110,
                allOpts:
                    [
                        [
                            {dayOfWeek:"Tue", startTime: 870, endTime:915, inWeiss:"yes"},
                            {dayOfWeek:"Thu", startTime: 870, endTime:915, inWeiss:"yes"},
                            {dayOfWeek:"Fri", startTime: 945, endTime:975, inWeiss:"yes"},
                        ],
                    ]
                },
            ],
        lastVerified: null,
        adminPageSet:null,
        season:"fall",
        },

        {    
        name: "Dolan",
        privilegeLevel:false,
        color: "#ffa500",
        availability:{
            Sun:[{startTime: "420", endTime: "540", admin: "no"}],
            Mon:[],
            Tue:[],
            Wed:[],
            Thu:[],
            Fri:[],
            Sat:[]
        },
        teams:
            [
                {
                name:"sprintFootball",
                coach: "Dolan",
                rank:
                    {
                        myTeams: 0,
                        allTeams:3
                    },
                size: 50,
                allOpts:

                    [
                        [
                            {dayOfWeek:"Tue", startTime: 960, endTime:1020, inWeiss:"yes"},
                            {dayOfWeek:"Sat", startTime: 540, endTime:600, inWeiss:"yes"},
                        ],
                    ]
                },
            ],
        lastVerified: null,
        adminPageSet:null,
        season:"fall"
        }
    ],

    adminTimeBlocks:
        {
        Sun:[],
        Mon:[{startTime: "420", endTime: "540", admin: "yes"}],
        Tue:[],
        Wed:[],
        Thu:[{startTime: "780", endTime: "840", admin: "yes"}],
        Fri:[],
        Sat:[]
        }
}










const events = {
    events: {},
    
    subscribe: function(eventName, fn){
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    },

    unsubscribe: function (eventName, fn){
        if(this.events[eventName]){
            for(let i = 0; i< this.events[eventName].length; i++){
                if(this.events[eventName][i] === fn){
                    this.events[eventName].splice(i, 1);
                    break;
                }
            }
        }
    },

    publish: function (eventName, data){
        if(this.events[eventName]){
            this.events[eventName].forEach(function(fn){
                fn(data);
            })
        }
    }
}

const adminAllUsersDataModel = (function(){ //continue REVIEW HERE
	//no obvious issues, find database update listeners for delete/modify/add allUsers, make sure password does not get passed to front-end
	let allUsers;

	events.subscribe("adminMainPageModelBuilt", populateAllUsers)
	events.subscribe("editUser", editUser);
	events.subscribe("deleteUser", deleteUserForDatabaseUpdate);
	events.subscribe("userDataValidated", addEditUserForDatabaseUpdate)

	function populateAllUsers(adminAllUsers){
		allUsers = adminAllUsers.allUsers.concat(); //should not need deeper recursive copying
	}

	function editUser(userData){
		const thisUser = allUsers.filter(function(user){
			return userData.name == user.name
		})[0];

		events.publish("userEditDataLoaded", thisUser);
	}

	function deleteUserForDatabaseUpdate(userData){
		const allUsersSlice = allUsers.concat();
		
		if(userData.privilegeLevel == true && !checkForLastAdmin()){
			alert("Cannot demote last admin. Create new admin users before deleting this admin.")
		}else{
			
			const existingUserIndex = allUsersSlice.findIndex(function(users){
				return users.name ==userData.name
			})

			allUsersSlice.splice(existingUserIndex, 1);
	
			events.publish("allUsersDataUpdated", allUsersSlice); //find database listener for this
		} 	

		function checkForLastAdmin(){
			const adminUsers = allUsersSlice.filter(function(user){
				return user.privilegeLevel == true
			})

			return adminUsers.length >1
		}
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

const adminMainPageAdminTimeBlockModel = (function(){
    //find subscriber to databse update
    //updates here would need to pushed to all users, should this publish to allUsers here, or do this on backEnd before DB save? Look at Node/Mongo scripts to determine how viable this is one way or another
    let adminAvailabilityModel;
    let adminAvailabilityModelCopy;
    let timeBlockDefault = {
        startTime:"default",
        endTime:"default",
        admin:"yes"
    };

    events.subscribe("adminMainPageModelBuilt", setAdminAvailabilityModel);
    events.subscribe("deleteAdminTimeBlockClicked", deleteAdminAvailabilityRow);
    events.subscribe("addAdminTimeBlockClicked", addAdminAvailabilityRow);
    events.subscribe("modifyAdminTimeBlockSelectorValue", modifyAdminAvailabilityValue);
    events.subscribe("updateAdminAvailabilityClicked", validateAdminAvailability);
    events.subscribe("adminAvailabilityDataValidated", updateAdminAvailability)
    events.subscribe("cancelAdminAvailabilityChangesClicked", cancelAdminAvailabilityChanges)

    function setAdminAvailabilityModel(adminData){
        adminAvailabilityModel = adminData.adminTimeBlocks;
        setAdminAvailabilityModelCopy()
    }

    function setAdminAvailabilityModelCopy(){
        adminAvailabilityModelCopy = Object.assign({}, adminAvailabilityModel);
        for(let day in adminAvailabilityModelCopy){
            adminAvailabilityModelCopy[day] = adminAvailabilityModel[day].concat();
            adminAvailabilityModel[day].forEach(function(timeBlock){
                adminAvailabilityModelCopy[day][timeBlock] = Object.assign({}, adminAvailabilityModel[day][timeBlock])
            });
        }
    }

    function addAdminAvailabilityRow(obj){
        adminAvailabilityModelCopy[obj.day].push(Object.assign({}, timeBlockDefault));

        events.publish("adminAvailabilityModelModified", {adminTimeBlockDiv : obj.adminTimeBlockDiv, adminMainPageData: adminAvailabilityModelCopy, pageRenderOrigin: "dataChange"});
    }

    function deleteAdminAvailabilityRow(rowObj){
        const blockIndex = rowObj.blockNumber;
        adminAvailabilityModelCopy[rowObj.day].splice(blockIndex, 1);

        events.publish("adminAvailabilityModelModified", {adminTimeBlockDiv: rowObj.adminTimeBlockDiv, adminMainPageData: adminAvailabilityModelCopy, pageRenderOrigin: "dataChange"});
    }

    function modifyAdminAvailabilityValue(rowObj){
        const blockIndex = rowObj.blockNumber;
        adminAvailabilityModelCopy[rowObj.day][blockIndex][rowObj.selector] = rowObj.value
    }

    function validateAdminAvailability(){
        events.publish("adminAvailabilityValidationRequested", adminAvailabilityModelCopy)
    }

    function updateAdminAvailability(){
        events.publish("adminAvailabilityDataUpdated", adminAvailabilityModelCopy) //find subscriber 
    }

    function cancelAdminAvailabilityChanges(adminTimeBlockDiv){
        setAdminAvailabilityModelCopy();
        events.publish("adminAvailabilityModelModified", {adminTimeBlockDiv, adminMainPageData: adminAvailabilityModel, pageRenderOrigin: "dataChange"})
    }
})()

const adminMainPageAllTeamsData = (function(){
	//no obvious work to be done here except connect teamOrder change to database, have changes written to EVERY TEAM and ensure recursion is necessary
	let allTeams;

	events.subscribe("adminMainPageModelBuilt", populateAllTeams)
	events.subscribe("modifyAdminTeamOrder", modifyTeamOrder);

	function populateAllTeams(adminAllTeams){
		allTeams = adminAllTeams.allTeams.concat(); //does this need recursive copying? depth should be sufficient if so
		for(let team in adminAllTeams.allTeams){
			allTeams[team] = Object.assign({}, adminAllTeams.allTeams[team])
			allTeams[team].rank = Object.assign({}, adminAllTeams.allTeams[team].rank)
		}
	}

	function modifyTeamOrder(teamOrderObj){
		const {index, modifier} = teamOrderObj;

		const allTeamsSlice = allTeams.concat();
		for(let team in allTeams){
			allTeamsSlice[team] = Object.assign({}, allTeams[team])
			allTeamsSlice[team].rank = Object.assign({}, allTeams[team].rank)
		}

		const team = allTeamsSlice.splice(index, 1)[0];
		allTeamsSlice.splice(index + modifier, 0, team);
		allTeamsSlice.forEach(function(team){
			team.rank.allTeams = allTeamsSlice.findIndex(function(thisTeam){
				return thisTeam.name == team.name
			})
		})
		events.publish("adminAllTeamsDataUpdated", allTeamsSlice); //find listener
	}
})()

const adminMainPageFacilityDataModel = (function(){
    //no obvious issues, find database listener for data update
    let adminFacilityDataModel;
    let adminFacilityDataModelCopy;
    
    events.subscribe("adminMainPageModelBuilt", setAdminFacilityDataModel);
    events.subscribe("modifyFacilitySelectorValue", modifyFacilitySelectorValue);
    events.subscribe("updateFacilityDataClicked", validateFacilityData);
    events.subscribe("adminFacilityDataValidated", updateFacilityData);
    events.subscribe("cancelFacilityDataChangesClicked", cancelFacilityDataChanges);

    function setAdminFacilityDataModel(adminData){
        adminFacilityDataModel = adminData.facilitySelectors
        setAdminFacilityDataModelCopy()
    }

    function setAdminFacilityDataModelCopy(){
        adminFacilityDataModelCopy = Object.assign({}, adminFacilityDataModel);
        
    }
    function modifyFacilitySelectorValue(facilityDataObj){
        adminFacilityDataModelCopy[facilityDataObj.selector] = facilityDataObj.value;
    }

    function validateFacilityData(){
        events.publish("adminFacilityDataValidationRequested", adminFacilityDataModelCopy)
    }

    function updateFacilityData(){
        events.publish("adminFacilityDataUpdated", adminFacilityDataModelCopy);
    }
    
    function cancelFacilityDataChanges(adminFacilityDataContainer){
        setAdminFacilityDataModelCopy();
        events.publish("adminFacilityModelModified", {adminFacilityDataContainer, adminMainPageData: adminFacilityDataModel, pageRenderOrigin: "dataChange"})
    }



})()

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
        userModelCopy.privilegeLevel = privilege;
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

const availabilityModel = (function(){
    //no obvious issues, find subscriber for database updates
    let availabilityModel;
    let availabilityModelCopy;
    let timeBlockDefault = {
        startTime:"default",
        endTime:"default",
        admin: "no"
    };

    events.subscribe("mainPageModelBuilt", setAvailabilityModel); 
    events.subscribe("availabilityModelRequested", publishAvailabilityModel)
    events.subscribe("deleteTimeBlockClicked", deleteAvailabilityRow);
    events.subscribe("addTimeBlockClicked", addAvailabilityRow);
    events.subscribe("modifyAvailabilitySelectorValues", modifyAvailabilityValue);
    events.subscribe("updateAvailabilityClicked", validateAvailability);
    events.subscribe("userAvailabilityDataValidated", updateAvailability)

    
    function setAvailabilityModel(userAvailability){
        availabilityModel = userAvailability.availability
    }

    function setAvailabilityModelCopy(){
        availabilityModelCopy = Object.assign({}, availabilityModel);
        for(let day in availabilityModel){
            availabilityModelCopy[day] = availabilityModel[day].concat();
            availabilityModel[day].forEach(function(timeBlock){
                availabilityModelCopy[day][timeBlock] = Object.assign({}, availabilityModel[day][timeBlock])
            });
        }
    }

    function publishAvailabilityModel(){
        setAvailabilityModelCopy();
        events.publish("availabilityDOMPageRequested", availabilityModelCopy)
    }


    function addAvailabilityRow(day){
        availabilityModelCopy[day].push(Object.assign({}, timeBlockDefault));

        events.publish("availabilityModelModified", availabilityModelCopy);
    }

    function deleteAvailabilityRow(rowObj){
        const blockIndex = rowObj.blockNumber;
        availabilityModelCopy[rowObj.day].splice(blockIndex, 1);

        events.publish("availabilityModelModified", availabilityModelCopy);
    }

    function modifyAvailabilityValue(rowObj){
        const blockIndex = rowObj.blockNumber;
        availabilityModelCopy[rowObj.day][blockIndex][rowObj.selector] = rowObj.value
    }

    function validateAvailability(){
        events.publish("userAvailabilityValidationRequested", availabilityModelCopy)
    }

    function updateAvailability(){
        events.publish("availabilityDataUpdated", availabilityModelCopy)
    }

})()

const mainPageModel = (function(){
    //facilitySelectors/adminPageSet/season all have to have a default value in databse to start
    //ensure proper database connection
    //determine if recursive copying for immutability is necessary directly off database
    //check lastVerified and season for proper execution

    let userPageModel = {
        name: null,
        privilegeLevel: null,
        availability: null,
        teams: null,
        lastVerified:null,
        adminPageSet: null,
        season: null,
        allTeams: null,
        facilitySelectors:null,
    }

    
    /*{
        name: "Brindle",
        privilegeLevel:"user",
        availability:{
            Sun:[],
            Mon:[],
            Tue:[],
            Wed:[],
            Thu:[],
            Fri:[],
            Sat:[]
        },
        teams:
        [
            {
            name:"basketballWomen",
            coach: "Brindle",
            rank:{
                myTeams: 2,
                allTeams:6
            },
            size: 15,
            allOpts:
                
                [
                    [
                        {dayOfWeek:"Tue", startTime: 420, endTime:495, inWeiss:"yes"},
                        {dayOfWeek:"Thu", startTime: 420, endTime:495, inWeiss:"yes"},
                        {dayOfWeek:"Fri", startTime: 420, endTime:495, inWeiss:"yes"},
                    ],
                ]
            },
            
            {
                name:"basketballMen",
                coach: "Brindle",
                rank:{
                    myTeams: 1,
                    allTeams:5
                },
                size: 25,
                allOpts:
                
                    [
                        [
                            {dayOfWeek:"Tue", startTime: 930, endTime:990, inWeiss:"yes"},
                            {dayOfWeek:"Thu", startTime: 915, endTime:975, inWeiss:"yes"},
                            {dayOfWeek:"Fri", startTime: 870, endTime:930, inWeiss:"yes"},
                        ],
                    ]
            },
        ],
        lastVerified: null,
        adminPageSet:null,
        season:"fall",
        allTeams:
        [
            {
            name: "football",
            coach:"Rivera",
            rank:{
                myTeams: 1,
                allTeams:1
            },
            size: 110,
            allOpts:
                [
                    [
                        {dayOfWeek:"Tue", startTime: 870, endTime:915, inWeiss:"yes"},
                        {dayOfWeek:"Thu", startTime: 870, endTime:915, inWeiss:"yes"},
                        {dayOfWeek:"Fri", startTime: 945, endTime:975, inWeiss:"yes"},
                    ],
                ]
            
        
        
        },
    
        {
            name:"basketballWomen",
            coach: "Brindle",
            rank:{
                myTeams: 2,
                allTeams:6
            },
            size: 15,
            allOpts:
                
                [
                    [
                        {dayOfWeek:"Tue", startTime: 420, endTime:495, inWeiss:"yes"},
                        {dayOfWeek:"Thu", startTime: 420, endTime:495, inWeiss:"yes"},
                        {dayOfWeek:"Fri", startTime: 420, endTime:495, inWeiss:"yes"},
                    ],
                ]
            },
            
            {
                name:"basketballMen",
                coach: "Brindle",
                rank:{
                    myTeams: 1,
                    allTeams:5
                },
                size: 25,
                allOpts:
                
                    [
                        [
                            {dayOfWeek:"Tue", startTime: 930, endTime:990, inWeiss:"yes"},
                            {dayOfWeek:"Thu", startTime: 915, endTime:975, inWeiss:"yes"},
                            {dayOfWeek:"Fri", startTime: 870, endTime:930, inWeiss:"yes"},
                        ],
                    ]
            },
    
            {
                name:"sprintFootball",
                coach: "Dolan",
                rank:{
                    myTeams: 4,
                    allTeams:4
                },
                size: 50,
                allOpts:
                
                    [
                        [
                            {dayOfWeek:"Tue", startTime: 960, endTime:1020, inWeiss:"yes"},
                            {dayOfWeek:"Sat", startTime: 540, endTime:600, inWeiss:"yes"},
                        ],
                    ]
            },
        ],
        facilitySelectors:{
            facilityOpen:360,
            facilityClose: 1200,
            facilityMaxCapacity:150
        }

    }*/
    

    let adminMainPageModel = {
        name: null,
        privilegeLevel: null,
        season: null,
        allTeams: null,
        allUsers: null,
        facilitySelectors:null,
        adminTimeBlocks: null,
        
    }

    events.subscribe("dataLoadedFromDatabase", populateAndDistributeDataModels);
    events.subscribe("mainPageDOMRequested", distributeMainPageModel);
    events.subscribe("adminMainPageDOMRequested", distributeAdminMainPageModel)

    function populateAndDistributeDataModels(databaseObj){//check these for recursive immutable copying properly/necessary, if not jsut do destructuring assingment

        if(databaseObj.adminPageSet == "admin"){
            populateAdminUserModel(databaseObj);
            events.publish("adminSelectorsRequested", adminMainPageModel.facilitySelectors)
            distributeAdminMainPageModel()
        }else{
            populateGeneralUserModel(databaseObj);
            events.publish("userSelectorsRequested", userPageModel.facilitySelectors)
            distributeMainPageModel();
        }
    }


    function populateGeneralUserModel(databaseObj){
        userPageModel.name = databaseObj.name;
        userPageModel.privilegeLevel = databaseObj.privilegeLevel
        userPageModel.availability = databaseObj.availability;
        userPageModel.teams = databaseObj.teams; 
        userPageModel.lastVerified = databaseObj.lastVerified;
        userPageModel.season = databaseObj.season;
        userPageModel.adminPageSet = databaseObj.adminPageSet
        
        userPageModel.facilitySelectors = databaseObj.facilitySelectors
        userPageModel.allTeams = databaseObj.allTeams; 
    }

    function populateAdminUserModel(databaseObj){
        adminMainPageModel.name = databaseObj.name
        adminMainPageModel.privilegeLevel = databaseObj.privilegeLevel
        adminMainPageModel.season = databaseObj.season

        adminMainPageModel.allUsers = databaseObj.allUsers;
        adminMainPageModel.allTeams = databaseObj.allTeams;
        adminMainPageModel.facilitySelectors = databaseObj.facilitySelectors;
        adminMainPageModel.adminTimeBlocks = databaseObj.adminTimeBlocks;
    }

    function distributeMainPageModel(){
        events.publish("mainPageModelBuilt", userPageModel)
    }

    function distributeAdminMainPageModel(){
        events.publish("adminMainPageModelBuilt", adminMainPageModel)
    }

})();

const myTeamsModel = (function(){
    // find subscribers for database updates (teamOrder, validatedTeamDataChanges, deletions)
    let myTeams;

    events.subscribe("editTeam", editTeam)
    events.subscribe("modifyMyTeamOrder", modifyTeamOrder) 
    events.subscribe("mainPageModelBuilt", populateMyTeams)
    events.subscribe("workingModelValidated", addEditTeamForDatabaseUpdate)
    events.subscribe("deleteTeam", deleteTeamForDatabaseUpdate)
    events.subscribe("setTeamVerification", verifyTeam)

     function populateMyTeams(userMyTeams){ 
         myTeams = userMyTeams.teams.concat();
         for(let team in userMyTeams.teams){
			myTeams[team] = Object.assign({}, userMyTeams.teams[team])
			myTeams[team].rank = Object.assign({}, userMyTeams.teams[team].rank)
		} 
    }

    function editTeam(teamRequest){ 
        const thisTeam = myTeams.filter(function(team){
            return teamRequest.name == team.name
        })[0];
        events.publish("teamEditDataLoaded", thisTeam); //follow this
    }

    function modifyTeamOrder(teamInfoObj){
        const myTeamsSlice = myTeams.concat();
        const team = myTeamsSlice.splice(teamInfoObj.index, 1)[0];
        myTeamsSlice.splice(teamInfoObj.index + teamInfoObj.modifier, 0, team);
        myTeamsSlice.forEach(function(thisTeam){
            thisTeam.rank.myTeams = myTeamsSlice.findIndex(function(teams){
                return teams.name == thisTeam.name
            })
        })     
        events.publish("myTeamsDataUpdated", myTeamsSlice); //send to DB for save
    }

    function addEditTeamForDatabaseUpdate(teamObject){
        const myTeamsSlice = myTeams.concat();
        const existingTeamIndex = findExistingTeam()
        
       if(existingTeamIndex != -1){
            myTeamsSlice.splice(existingTeamIndex, 1, teamObject.workingModel)
       }else{
            myTeamsSlice.push(teamObject.workingModel)
       }
       myTeamsSlice.forEach(function(thisTeam){
        thisTeam.rank.myTeams = myTeamsSlice.findIndex(function(teams){
                return teams.name == thisTeam.name
            })
        })
        events.publish("myTeamsDataUpdated", myTeamsSlice) //send to DB for save

        function findExistingTeam(){
            const existingTeam = myTeamsSlice.findIndex(function(teams){
                return teamObject.teamRequest.name == teams.name
            })
            return existingTeam
            
        }
    }

    function deleteTeamForDatabaseUpdate(thisTeam){
        const myTeamsSlice = myTeams.concat();
        const existingTeamIndex = myTeamsSlice.findIndex(function(teams){ 
            return teams.name == thisTeam.name
        })

        myTeamsSlice.splice(existingTeamIndex, 1)
        myTeamsSlice.forEach(function(thisTeam){
            thisTeam.rank.myTeams = myTeamsSlice.findIndex(function(teams){ 
                return teams.name == thisTeam.name
            })
        })
        events.publish("myTeamsDataUpdated", myTeamsSlice) //send to DB for save
    }

    function verifyTeam(thisTeam){
        const myTeamsSlice = myTeams.concat();
        const existingTeamIndex = myTeamsSlice.findIndex(function(teams){ 
            return teams.name == thisTeam.name
        })
        
        const now = new Date();
        const nowParsed = `${now.getMonth()+1}-${now.getDate()}-${now.getFullYear()}`

        myTeamsSlice[existingTeamIndex].lastVerified = nowParsed;
        
        events.publish("myTeamsDataUpdated", myTeamsSlice) //send to DB for save
    }


})();

const teamRequestModel = (function(){
    
    let coach
    
    events.subscribe("mainPageModelBuilt", setCoach)

    events.subscribe("addTeam", createWorkingModel);
    events.subscribe("teamEditDataLoaded", populateWorkingModel); 
    events.subscribe("updateTeamRequest", validateTeamUpdate);
   
    events.subscribe("addOpt", addOption);
    events.subscribe("deleteOpt", deleteOption);
    events.subscribe("modifyOptOrder", modifyOptionsOrder);
   
    events.subscribe("addDay", addDay);
    events.subscribe("modifyTeamSelectorValue", modifySelectorValue);
    events.subscribe("deleteDay", deleteDay);
    
    events.subscribe("modifyTeamSizeValue", modifyTeamSizeValue);
    events.subscribe("modifyTeamNameValue", modifyTeamNameValue);
    
    let workingModel; 
    let teamRequest;

    function setCoach(mainPageData){
        coach = mainPageData.name
    }
    
    function createWorkingModel(){
        teamRequest = {
            name: "",
            size: "default", 
            rank: {
                myTeams: null,
                allTeams: null
            },
            allOpts: [[createDefaultDayDetails()]],
           coach:coach,
           lastVerified: null
        };

        workingModel = buildWorkingModelDeepCopy(teamRequest)
        
        events.publish("workingModelPopulated", workingModel)
    }

    function populateWorkingModel(thisTeamRequest){
        teamRequest = thisTeamRequest
        workingModel = buildWorkingModelDeepCopy(thisTeamRequest)

        events.publish("workingModelPopulated", workingModel) //follow this
    }

    function buildWorkingModelDeepCopy(thisTeamRequest){
        const workingModel = Object.assign({}, thisTeamRequest);
        workingModel.rank = Object.assign({}, thisTeamRequest.rank);

        workingModel.allOpts = thisTeamRequest.allOpts.concat();
        thisTeamRequest.allOpts.forEach(function(option){

            const optIndex = thisTeamRequest.allOpts.indexOf(option);
            workingModel.allOpts[optIndex] = thisTeamRequest.allOpts[optIndex].concat();
            option.forEach(function(day){

                const dayIndex = option.indexOf(day);
                workingModel.allOpts[optIndex][dayIndex] = Object.assign({}, thisTeamRequest.allOpts[optIndex][dayIndex])
            })
        })
        return workingModel;
    }

    function createDefaultDayDetails(){
        const defaultDayDetails = {
            dayOfWeek: "default",
            startTime: "default",
            endTime: "default",
            inWeiss: "default"
        };
        return defaultDayDetails
    }

    function validateTeamUpdate(){ //follow this
        events.publish("validateTeamRequest", {workingModel, teamRequest}) 
    }

    function addOption(){
        workingModel.allOpts.push([createDefaultDayDetails()]);
        events.publish("optionsModified", workingModel);
    }

    function deleteOption(optNum){
        const index = optNum - 1;
        workingModel.allOpts.splice(index, 1);
        events.publish("optionsModified", workingModel);
    }

    function modifyOptionsOrder(optionDetailsObj){
        const index = optionDetailsObj.optNum - 1;
        const option = workingModel.allOpts.splice(index, 1)[0];
        workingModel.allOpts.splice(index + optionDetailsObj.modifier, 0, option);
        events.publish("optionsModified", workingModel);
    }

    function addDay(optNum){
        const optIndex = optNum - 1;
        const optionDetails = workingModel.allOpts[optIndex];
        optionDetails.push(createDefaultDayDetails());
        events.publish("daysModified", {publishedOptionDetails: optionDetails, publishedOptNum: optNum})
    }

    function deleteDay(dayDetailsObj){
        const optIndex = dayDetailsObj.optNum - 1;
        const dayIndex = dayDetailsObj.dayNum - 1;
        const optionDetails = workingModel.allOpts[optIndex];
        optionDetails.splice(dayIndex, 1);
        events.publish("daysModified", {publishedOptionDetails: optionDetails, publishedOptNum:dayDetailsObj.optNum})
    }

    function modifySelectorValue(dayDetailsObj){
        const optIndex = dayDetailsObj.optNum - 1;
        const dayIndex = dayDetailsObj.dayNum - 1;
        workingModel.allOpts[optIndex][dayIndex][dayDetailsObj.selector] = dayDetailsObj.value
    }

    function modifyTeamSizeValue(size){
        workingModel.size = size;
    }

    function modifyTeamNameValue(name){
        workingModel.name = name
    }


    

})();

const adminMainPageDOM = (function(){

    let season
    
    events.subscribe("adminSelectorsBuilt", setSelectorNodes);
    events.subscribe("adminMainPageModelBuilt", setSeason)
    events.subscribe("adminMainPageModelBuilt", publishAdminMainPageRender);
    events.subscribe("adminAvailabilityModelModified", renderAdminAllTimeBlocks);
    events.subscribe("adminFacilityModelModified", renderFacilityDataGrid)
    
    
    const selectorNodes = {
        facilityOpen: null,
        facilityClose: null,
        facilityMaxCapacity: null,
        startTime: null,
        endTime: null
    }
    //watch for CSS conflicts on start/endTime between this, userAvailability and requestFormDOMs
    function setSelectorNodes(selectorElementObj){
        for(let selectorElement in selectorElementObj){
            switch(selectorElement){
                case `facilityOpen`:
                case `facilityClose`:
                case `facilityMaxCapacity`:
                case `startTime`: //watch CSS between this and requestFormDOM
                case `endTime`:
                    selectorNodes[selectorElement] = selectorElementObj[selectorElement]
                    break;
                default:
                    break;
            }	
        }
    }
    
    function setSeason(adminMainPageData){ //make sure this happens before publishAdminMainPageRender, it should
        season = adminMainPageData.season
    }

    function publishAdminMainPageRender(adminMainPageData){
        const adminMainPageDOM = buildAdminMainPageDOM(adminMainPageData);
        events.publish("pageRenderRequested", adminMainPageDOM);
    }
    //find subscribers to changeSeasons and runScheduler, issue NOT TO BE ADDRESSED:  scheduler could be run with unsaved modifications to adminAvail and facilityData
    function buildAdminMainPageDOM(adminMainPageData){
        const template = document.querySelector("#adminMainPageTemplate");
        const content = document.importNode(template.content, true);
        
        const seasonButtons = content.querySelector("#adminSeasonButtons");
        const seasonButtonsChildren = Array.from(seasonButtons.children)
        const adminAllTeams = content.querySelector("#adminMainPageTeamGrid");
        const adminAllUsers = content.querySelector("#adminUsersGridContainer");
        const adminFacilityData = content.querySelector("#facilityDataGridContainer");
        const adminAddTimeBlock = content.querySelector("#setAllUsersAvailabilityGridContainer");
        const schedulerButton = content.querySelector("#runScheduleBuilderButton");
    
        const adminAllTeamsNew = renderAdminAllTeamsGrid(adminAllTeams, adminMainPageData.allTeams);
        const adminAllUsersNew = renderAdminAllUsersGrid(adminAllUsers, adminMainPageData.allUsers);
        const adminFacilityDataNew = renderFacilityDataGrid({adminFacilityDataContainer: adminFacilityData, adminMainPageData: adminMainPageData.facilitySelectors, pageRenderOrigin: "template"});
        const adminAddTimeBlockNew = renderAdminTimeBlocker({adminTimeBlockDiv: adminAddTimeBlock, adminMainPageData: adminMainPageData.adminTimeBlocks, pageRenderOrigin: "template"});
    
        adminAllTeams.replaceWith(adminAllTeamsNew);
        adminAllUsers.replaceWith(adminAllUsersNew); 
        adminFacilityData.replaceWith(adminFacilityDataNew);
        adminAddTimeBlock.replaceWith(adminAddTimeBlockNew);
    
        seasonButtonsChildren.forEach(function(child){
            if(child.id == `${season}Button`){
                child.disabled = true;
            }else{
                child.addEventListener("click", changeSeason)
               
            }
        })

        schedulerButton.addEventListener("click", runScheduler)
    
        return content
    
        function changeSeason(){
            let string = "Button";
            const seasonButtonId = this.id;
            const truncateIndex = seasonButtonId.indexOf(string);
            const seasonName = seasonButtonId.slice(0, truncateIndex);
            
            events.publish("adminSeasonChangeRequested", seasonName)
        }

        function runScheduler(){
            events.publish("runSchedulerRequested") 
        }
    }
    //no obvious issues with this or allTeamsData
    function renderAdminAllTeamsGrid(teamGrid, allTeamsData){ 
        const teamGridNew = document.createElement("div")

        allTeamsData.forEach(function(team){
            const teamRow = buildAdminTeamRow(team, allTeamsData);
            teamGridNew.appendChild(teamRow);
        })

        teamGrid.replaceWith(teamGridNew);
        teamGridNew.id = "adminMainPageTeamGrid"
    
        return teamGridNew
    }

    //adminTeamRow display is: teamName, coach, lastVerified, teamRank, up and downrank buttons
    function buildAdminTeamRow(teamData, allTeamsData){ //after viewing full page, determine whether to add allOpts for admin viewing
        const template = document.querySelector("#adminMainPageTeamTemplate");
        const content = document.importNode(template.content, true);
    
        const teamName = content.querySelector(".adminMainPageTeamGridTeamName");
        const teamCoach = content.querySelector(".adminMainPageTeamGridTeamCoach");
        const teamSize = content.querySelector(".adminMainPageTeamGridTeamSize");
        const teamRank = content.querySelector(".adminMainPageTeamGridTeamRank");
        const teamButtons = content.querySelector(".adminMainPageTeamGridTeamButtons");
        
        const uprankButton = document.createElement("button");
        const downrankButton = document.createElement("button");

        teamName.innerText = teamData.name;
        teamCoach.innerText = teamData.coach;
        teamSize.innerText = `${teamData.size} athletes`;
        teamRank.innerText = teamData.rank.allTeams +1;

        uprankButton.id = "adminMainPageTeamGridTeamUprankButton"
        downrankButton.id = "adminMainPageTeamGridTeamDownrankButton"
    
        uprankButton.addEventListener("click", moveAdminRankUp);
        downrankButton.addEventListener("click", moveAdminRankDown);
    
        if(allTeamsData.length > 1 && teamData.rank.allTeams != 0 && teamData.rank.allTeams != allTeamsData.length - 1){
            teamButtons.appendChild(uprankButton);
            teamButtons.appendChild(downrankButton);
        }else if(allTeamsData.length > 1 && teamData.rank.allTeams == allTeamsData.length - 1){
            teamButtons.appendChild(uprankButton)
        }else if(allTeamsData.length > 1 && teamData.rank.allTeams == 0){
            teamButtons.appendChild(downrankButton)
        }   
    
        return content
    
        function moveAdminRankUp(){ 
            events.publish("modifyAdminTeamOrder", {index: teamData.rank.allTeams, modifier: -1})
        }
        function moveAdminRankDown(){
            events.publish("modifyAdminTeamOrder", {index: teamData.rank.allTeams, modifier: 1})
        }
    }
    //no obvious issues with this or dataModel, display is usersGrid and addUserButton
    function renderAdminAllUsersGrid(adminAllUsersContainer, adminMainPageData){
    
        const userGrid = adminAllUsersContainer.querySelector("#adminUsersGrid");
        const addUserButton = adminAllUsersContainer.querySelector("#adminUsersGridAddUser");
        const userGridNew = renderAdminAllUsers(adminMainPageData);
    
        userGrid.replaceWith(userGridNew);
        
        addUserButton.addEventListener("click", addUser)
    
        return adminAllUsersContainer

        function addUser(){
            events.publish("addUser")
        }
    }
    
    function renderAdminAllUsers(adminMainPageData){
        const allUsers = document.createElement("div");
        allUsers.id = "adminUsersGrid";
    
        adminMainPageData.forEach(function(user){
            const userRow = buildAdminUserRow(user);
            allUsers.appendChild(userRow);
        })

        return allUsers;
    }
    //userRow display is: name, privilegeLevel, color, lastVerified date, edit and deleteButtons
    function buildAdminUserRow(userData){
        const template = document.querySelector("#adminMainPageUserGridUserTemplate");
        const content = document.importNode(template.content, true);
    
        const userName = content.querySelector(".adminUserGridUserName");
        const userPrivilege = content.querySelector(".adminUserGridUserPrivilege");
        const userLastVerified = content.querySelector(".adminUserGridUserLastVerified");
        const userColorBlock = content.querySelector(".adminUserColor");
    
        const editButton = content.querySelector(".adminUserGridUserEditButton");
        const deleteButton = content.querySelector(".adminUserGridUserDeleteButton");
    
        editButton.addEventListener("click", editUser);
        deleteButton.addEventListener("click", deleteUser);
    
        userName.innerText = userData.name;
        if(userData.privilegeLevel){
            userPrivilege.innerText = "admin"
        }else{
            userPrivilege.innerText = "user"
        }
        userLastVerified.innerText = userData.lastVerified;
        userColorBlock.style.backgroundColor = userData.color
    
        return content
    
        function editUser(){
            events.publish("editUser", userData)
        }
        function deleteUser(){
            events.publish("deleteUser", userData)	
        }
    }

    //renderFacilityDataGrid display is: facilityOpen selector, facilityClose selector, facility maxCapacity, saveButton, cancelButton
    function renderFacilityDataGrid(dataDomObj){
        
        const adminFacilityDataContainer = dataDomObj.adminFacilityDataContainer;
        const adminMainPageData = dataDomObj.adminMainPageData;
        const pageRenderOrigin = dataDomObj.pageRenderOrigin

        const template = document.querySelector("#adminMainPageFacilityDataGridTemplate");
        const content = document.importNode(template.content, true);

        const facilityGridNew = content.querySelector("#facilityDataGrid");
        const facilitySelectorsNodes = content.querySelectorAll(".selector");
        const saveButton = content.querySelector("#adminMainPageFacilitySelectorsSaveButton");
        const cancelButton = content.querySelector("#adminMainPageFacilitySelectorsCancelButton");
    
        facilitySelectorsNodes.forEach(function(selector){
            const primaryClass = Array.from(selector.classList)[0];
            
            const selectionNew = selectorNodes[`${primaryClass}`].cloneNode(true);
            selectionNew.addEventListener("change", publishSelectionValueChange)
            selectionNew.addEventListener("change", disableDefaultOption)
            if(primaryClass == "facilityOpen"){
                selectionNew.addEventListener("click", modifyEndTimeDefaultValue)
            }

            const selectedOption = selectionNew.querySelector(`option[value = "${adminMainPageData[primaryClass]}"]`);
            selectedOption.selected = true;
            if(selectedOption.value != "default"){
                selectionNew.firstChild.disabled = true;
            }
            
            selector.replaceWith(selectionNew);
    
            function publishSelectionValueChange(){
                const selector = primaryClass
                const value = selectionNew.value;
                events.publish("modifyFacilitySelectorValue", {selector, value})
            }

            function disableDefaultOption(){ //these are all not working, may need to use event delegation within the modules themselves
                const values = Array.from(this.children);
                values[0].disabled = true;
            }

            function modifyEndTimeDefaultValue(){
                const startTimeSelectedValue = Number(this.value);
                const endTimeValuesArray = Array.from(this.parentElement.nextElementSibling.lastElementChild.children);
                endTimeValuesArray.forEach(function(time){
                    const endTimeValue = Number(time.value);
                    if(endTimeValue < startTimeSelectedValue + 30 || endTimeValue == "default"){
                        time.disabled = true;
                    }else{
                        time.disabled = false;
                    }
                })
            }
        })

        saveButton.addEventListener("click", updateFacilityData);
        cancelButton.addEventListener("click", cancelFacilityDataChanges);
    
        function updateFacilityData(){
            events.publish("updateFacilityDataClicked");
        }
        function cancelFacilityDataChanges(){
            events.publish("cancelFacilityDataChangesClicked", adminFacilityDataContainer)
        }
        
        const facilityGrid = document.querySelector("#facilityDataGrid");
        if(pageRenderOrigin == "dataChange"){
            facilityGrid.replaceWith(facilityGridNew)
        }else{
            adminFacilityDataContainer.appendChild(facilityGridNew)
            return adminFacilityDataContainer
        }
    } 
    
    //adminTimeBlocker display is blockGrid (allTimeBlocks), saveChanges, cancelChanges buttons; dataModel issue to determine when to write changes to allUsers (FE or BE)
    function renderAdminTimeBlocker(adminDomObj){
        const adminTimeBlockDiv = adminDomObj.adminTimeBlockDiv

        const adminTimeBlockGrid = adminTimeBlockDiv.querySelector("#adminMainPageAddAvailabilityBlockAllUsersGrid");
        const adminSaveTimeBlockButton = adminTimeBlockDiv.querySelector("#adminMainPageAddAvailabilityBlockAllUsersSaveButton");
        const adminCancelTimeBlockChangesButton = adminTimeBlockDiv.querySelector("#adminMainPageAddAvailabilityBlockAllUsersCancelButton");
        
        const adminTimeBlockGridNew = renderAdminAllTimeBlocks(adminDomObj);

        adminTimeBlockGrid.replaceWith(adminTimeBlockGridNew);
    
        adminSaveTimeBlockButton.addEventListener("click", updateAdminAvailability);
        adminCancelTimeBlockChangesButton.addEventListener("click", cancelAdminAvailabilityChanges);

        return adminTimeBlockDiv

        function updateAdminAvailability(){
            events.publish("updateAdminAvailabilityClicked")
        }
        function cancelAdminAvailabilityChanges(){
            events.publish("cancelAdminAvailabilityChangesClicked", adminTimeBlockDiv)
        }
    }
    //allTimeBlocks display is forEach day (Day Label, addButton, [row for each timeBlock])
    function renderAdminAllTimeBlocks(dataDomObj){
        const adminTimeBlockDiv = dataDomObj.adminTimeBlockDiv;
        const adminMainPageData = dataDomObj.adminMainPageData
        const pageRenderOrigin = dataDomObj.pageRenderOrigin

        const allTimeBlocksNew = document.createElement("div")
        allTimeBlocksNew.id = "adminMainPageAddAvailabilityBlockAllUsersGrid";
    
        for(let day in adminMainPageData){
            const dayDiv = document.createElement("div");
            dayDiv.classList.add("adminTimeBlockDay");

            const label = document.createElement("h3");
            const addButton = document.createElement("button");

            label.innerText = `${day}`;
            addButton.innerText = "Add Block"

            dayDiv.appendChild(label);
            dayDiv.appendChild(addButton)

            adminMainPageData[day].forEach(function(timeBlock){
                const blockNumber = adminMainPageData[day].indexOf(timeBlock);
                const row = buildAdminTimeBlockRow(adminTimeBlockDiv, day, timeBlock, blockNumber);
                dayDiv.appendChild(row)
            })

            allTimeBlocksNew.appendChild(dayDiv);

            addButton.addEventListener("click", function addAdminTimeBlock(){
                events.publish('addAdminTimeBlockClicked', {adminTimeBlockDiv, day})
            });
        }

        const allTimeBlocks = document.querySelector("#adminMainPageAddAvailabilityBlockAllUsersGrid");
        if(pageRenderOrigin == "dataChange"){
            allTimeBlocks.replaceWith(allTimeBlocksNew)
        }else{
            return allTimeBlocksNew
        }
    }

    //adminBlockRow display is (startTime selector, endTime selector, deleteButton)
    function buildAdminTimeBlockRow(adminTimeBlockDiv, day, timeBlock, blockNumber){
        const template = document.querySelector("#adminMainPageAddAvailabilityBlockAllUsersBlockTemplate");
        const content = document.importNode(template.content, true);

        const selectorsNodes = content.querySelectorAll(".selector");
        const deleteButton = content.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockDeleteButton")
    
        selectorsNodes.forEach(function(selector){
            const primaryClass = Array.from(selector.classList)[0];
            
            const selectionNew = selectorNodes[`${primaryClass}`].cloneNode(true);
            selectionNew.addEventListener("change", publishSelectionValueChange)
            selectionNew.addEventListener("change", disableDefaultOption);
            if(primaryClass == "startTime"){
                selectionNew.addEventListener("click", modifyEndTimeDefaultValue)
            }
    
            const selectedOption = selectionNew.querySelector(`option[value = "${timeBlock[primaryClass]}"]`);
            selectedOption.selected = true;
            if(selectedOption.value != "default"){
                selectionNew.firstChild.disabled = true;
            }
            
            selector.replaceWith(selectionNew);
    
            function publishSelectionValueChange(){
                const selector = primaryClass
                const value = selectionNew.value;
                events.publish("modifyAdminTimeBlockSelectorValue", {blockNumber, day, selector, value})
            }

            function disableDefaultOption(){ //these are all not working, may need to use event delegation within the modules themselves
                const values = Array.from(this.children);
                values[0].disabled = true;
            }

            function modifyEndTimeDefaultValue(){
                const startTimeSelectedValue = Number(this.value);
                const endTimeValuesArray = Array.from(this.parentElement.nextElementSibling.lastElementChild.children);
                endTimeValuesArray.forEach(function(time){
                    const endTimeValue = Number(time.value);
                    if(endTimeValue < startTimeSelectedValue + 30 || endTimeValue == "default"){
                        time.disabled = true;
                    }else{
                        time.disabled = false;
                    }
                })
            }
        })

        deleteButton.addEventListener("click", deleteAdminTimeBlock);

        return content

        function deleteAdminTimeBlock(){
            events.publish("deleteAdminTimeBlockClicked", {adminTimeBlockDiv, day, blockNumber})
        }
    } 
})();

const adminUserGeneratorDOM = (function(){
    //no obvious issues
    let allUsersList 

    events.subscribe("userModelPopulated", publishUserGeneratorPageRender);
    events.subscribe("adminMainPageModelBuilt", setAllUsers);

    function publishUserGeneratorPageRender(userModel){
        const userGeneratorPage = renderUserGeneratorDOM(userModel);
        events.publish("pageRenderRequested", userGeneratorPage)
    }

    function setAllUsers(adminDataModel){
        allUsersList = adminDataModel.allUsers
    }

    function renderUserGeneratorDOM(userModel){
        const template = document.querySelector("#adminUserGeneratorTemplate");
        const content = document.importNode(template.content, true);

        const userName = content.querySelector("#userGeneratorName");
        const userPrivilege = content.querySelector("#userGeneratorPrivilege");
        const userColor = content.querySelector("#userGeneratorColor");
        const saveButton = content.querySelector("#userGeneratorSaveButton");
        const cancelButton = content.querySelector("#userGeneratorCancelButton");

        saveButton.addEventListener("click", saveUserData) 
        cancelButton.addEventListener("click", cancelUserChanges)
        
        const userNameNew = renderUserName(userName, userModel) 
        const userPrivilegeNew = renderUserPrivilege(userPrivilege, userModel)
        const userColorNew = renderUserColor(userColor, userModel)

        userName.replaceWith(userNameNew);
        userPrivilege.replaceWith(userPrivilegeNew);
        userColor.replaceWith(userColorNew);
       
        return content
        
        function saveUserData(){
            events.publish("saveUserDataClicked")
        }

        function cancelUserChanges(){
            events.publish("adminMainPageDOMRequested")
        }
    }

    function renderUserName(userNameDOM, userModel){
        
        //this is good, compare this against other validator in singleUser teams to make sure they are comprehensive;
        userNameDOM.value = userModel.name;

        userNameDOM.addEventListener("blur", function modifyUserNameValue(){ 
            if(userModel.name != userNameDOM.value && blockNameDuplication(userNameDOM.value)){
                alert(`Data already exists for ${userNameDOM.value}. Use another name or edit/delete the other user for the name you are trying to switch to.`);
                userNameDOM.value = "";
                userNameDOM.focus()
            }else if(userModel.name != "" && userNameDOM.value != userModel.name){
                const confirmation = confirm(`If you submit changes, this will change the user name from ${userModel.name} to ${userNameDOM.value}. Proceed? `);
                if(confirmation){
                    events.publish("modifyUserNameValue", userNameDOM.value)
                }else{
                    userNameDOM.value = userModel.name;
                }
            }else if(userModel.name != userNameDOM.value){
                events.publish("modifyUserNameValue", userNameDOM.value)
            } 
        })

        return userNameDOM;

        function blockNameDuplication(thisName){
            const nameCheck = allUsersList.some(function(user){
                return user.name.toLowerCase() == thisName.toLowerCase();
            })
            return nameCheck;
        }
    }
    
    function renderUserPrivilege(userPrivilegeDOM, userModel){ 

        if(userModel.privilegeLevel == true){
            userPrivilegeDOM.checked = true
        }
       
        userPrivilegeDOM.addEventListener("blur", updateUserPrivilege)

        return userPrivilegeDOM;

        function updateUserPrivilege(){
            if(userModel.privilegeLevel == true & !userPrivilegeDOM.checked && !checkForLastAdmin()){
                alert("Cannot demote last admin. Create new admin users before demoting this admin.")
                userPrivilegeDOM.checked = true;
            }else if(userPrivilegeDOM.checked != userModel.privilegeLevel){
                events.publish("modifyUserPrivilegeLevelValue", userPrivilegeDOM.checked)
            } 

            function checkForLastAdmin(){
                const adminUsers = allUsersList.filter(function(user){
                    return user.privilegeLevel == true
                })

                return adminUsers.length >1
            }
        }
    }

    function renderUserColor(userColorDOM, userModel){

        userColorDOM.value = userModel.color

        userColorDOM.addEventListener("blur", function verifyColorChange(){
            if(userModel.color != userColorDOM.value && blockColorDuplication()){
                alert(`Another user is already using this color. Considering all the possible colors available, the odds are pretty low. Unlucky pick, I guess!`)
                userColorDOM.value = userModel.color; 
                userColorDOM.focus();
            }else if(userModel.color != userColorDOM.value){
                events.publish("modifyUserColorValue", userColorDOM.value)
            }
            
            function blockColorDuplication(){
                const nameCheck = allUsersList.some(function(user){
                    return (user.name != userModel.name && user.color == userColorDOM.value)
                })
                return nameCheck;
            }
        })

        return userColorDOM
    }

})()

const availabilityPageDOM = (function(){
    //no obvious issues here
    let selectorNodes = {
        startTime:null, 
        endTime:null
    };

    events.subscribe("userSelectorsBuilt", setSelectorNodes);
    events.subscribe("availabilityModelModified", buildAvailabilityGrid);
    events.subscribe("availabilityDOMPageRequested", publishAvailabilityPageRender);

    function setSelectorNodes(selectorElementObj){
        for(let selectorElement in selectorElementObj){
            switch(selectorElement){
                case `startTime`:
                case `endTime`:
                    selectorNodes[selectorElement] = selectorElementObj[selectorElement];
                    break;
                default:
                    break;
            }  
        }  
    }

    function publishAvailabilityPageRender(availability){
        const availabilityPage = renderAvailabilityDOM(availability);
        events.publish("pageRenderRequested", availabilityPage)
    }

    function renderAvailabilityDOM(availability){
        const template = document.querySelector("#availabilityDOMTemplate");
        const content = document.importNode(template.content, true);

        const grid = content.querySelector("#availabilityGrid");
        const updateButton = content.querySelector("#availabilityUpdateButton");
        const cancelButton = content.querySelector("#availabilityCancelButton");

        const gridNew = buildAvailabilityGrid(availability);

        grid.replaceWith(gridNew);

        updateButton.addEventListener("click", updateAvailability)
        cancelButton.addEventListener("click", cancelAvailabilityChanges);

        return content
        
        function updateAvailability(){
            events.publish("updateAvailabilityClicked")
        }

        function cancelAvailabilityChanges(){
            events.publish("mainPageDOMRequested")
        }
    }

    function buildAvailabilityGrid(availability){
        const gridNew = document.createElement("div");
        gridNew.id = "availabilityGrid";

        for(let day in availability){
            const dayDiv = document.createElement("div");
            dayDiv.classList.add("availabilityDay")
            
            const label = document.createElement("h3");
            const addButton = document.createElement("button");

            label.innerText = `${day}`
            addButton.innerText = "Add Block"

            dayDiv.appendChild(label);
            dayDiv.appendChild(addButton);

            availability[day].forEach(function(timeBlock){
                const blockNumber = availability[day].indexOf(timeBlock); //this throws -1 ??
                const row = buildAvailabilityRow(day, timeBlock, blockNumber);
                dayDiv.appendChild(row)
            })
            
            gridNew.appendChild(dayDiv);
            
            addButton.addEventListener("click", function addTimeBlock(){
                events.publish("addTimeBlockClicked", day)
            })
        }

        const grid = document.querySelector("#availabilityGrid");
        if(grid != null){
            grid.replaceWith(gridNew)
        }else{
            return gridNew
        }
        
        
    }

    function buildAvailabilityRow(day, timeBlock, blockNumber){
        const template = document.querySelector("#availabilityGridRowTemplate");
        const content = document.importNode(template.content, true);

        const availabilitySelectors = content.querySelectorAll(".selector")
        const deleteButton = content.querySelector(".availabilityDeleteButton");
        

        availabilitySelectors.forEach(function(selection){
            const primaryClass = Array.from(selection.classList)[0];
            
            const selectionNew = selectorNodes[`${primaryClass}`].cloneNode(true);
            selectionNew.addEventListener("change", publishAvailabilitySelectionChange)
            selectionNew.addEventListener("change", disableDefaultOption);
            if(primaryClass == "startTime"){
                selectionNew.addEventListener("click", modifyEndTimeDefaultValue)
            }
            
            const selectedOption = selectionNew.querySelector(`option[value = "${timeBlock[primaryClass]}"]`);
            selectedOption.selected = true; 
            if(selectedOption.value != "default"){
                selectionNew.firstChild.disabled = true;
            }

            selection.replaceWith(selectionNew)   

            function publishAvailabilitySelectionChange(){
                const selector = primaryClass;
                const value = selectionNew.value
                events.publish("modifyAvailabilitySelectorValues", {blockNumber, day, selector, value})
            }

            function disableDefaultOption(){ //these are all not working, may need to use event delegation within the modules themselves
                const values = Array.from(this.children);
                values[0].disabled = true;
            }

            function modifyEndTimeDefaultValue(){
                const startTimeSelectedValue = Number(this.value);
                const endTimeValuesArray = Array.from(this.parentElement.nextElementSibling.lastElementChild.children);
                endTimeValuesArray.forEach(function(time){
                    const endTimeValue = Number(time.value);
                    if(endTimeValue < startTimeSelectedValue + 30 || endTimeValue == "default"){
                        time.disabled = true;
                    }else{
                        time.disabled = false;
                    }
                })
            }
        });

        if(timeBlock.admin == "yes"){
            deleteButton.remove()
        }

        deleteButton.addEventListener("click", deleteTimeBlock); 

        return content
        
        function deleteTimeBlock(){
            events.publish("deleteTimeBlockClicked", {day, blockNumber})
        }
    }
})();

const mainPageDOM = (function(){
    
    let season; 
    
    events.subscribe("mainPageModelBuilt", setSeason)
    events.subscribe("mainPageModelBuilt", publishMainPageRender);

    function setSeason(mainPageData){ //make sure this happens before publishMainPageRender, it should
        season = mainPageData.season
    }

    function publishMainPageRender(mainPageData){
        const mainPageDOM = buildMainPageDOM(mainPageData)
        events.publish("pageRenderRequested", mainPageDOM)
    }
    //find database subscribers for changeSeason/verifyUpToDate
    function buildMainPageDOM(mainPageData){ 
        const template = document.querySelector("#mainPageTemplate");
        const content = document.importNode(template.content, true);

        const seasonButtons = content.querySelector("#seasonButtons");
        const seasonButtonsChildren = Array.from(seasonButtons.children)
        const mainPageAvailability = content.querySelector("#userAvailability");
        const mainPageMyTeams = content.querySelector("#teamGridContainer");
        const verifyInfo = content.querySelector("#verifyInfo");
        const verifyButton = content.querySelector("#verifyButton");

        const mainPageAvailabilityNew = renderMainPageAvailability(mainPageAvailability, mainPageData.availability);
        const mainPageMyTeamsNew = renderMainPageMyTeams(mainPageMyTeams, mainPageData.teams); 
        
        mainPageAvailability.replaceWith(mainPageAvailabilityNew);
        mainPageMyTeams.replaceWith(mainPageMyTeamsNew);
        
        if(mainPageData.lastVerified != null){
            verifyInfo.innerText += mainPageData.lastVerified
        }

        seasonButtonsChildren.forEach(function(child){
            if(child.id == `${season}Button`){
                child.disabled = true;
            }else{
                child.addEventListener("click", changeSeason)
               
            }
        })

        verifyButton.addEventListener("click", publishTeamsUpToDateVerification);
    
        return content
    
        function changeSeason(){
            let string = "Button";
            const seasonButtonId = this.id;
            const truncateIndex = seasonButtonId.indexOf(string);
            const seasonName = seasonButtonId.slice(0, truncateIndex);
            
            events.publish("userSeasonChangeRequested", seasonName) 
        }

        function publishTeamsUpToDateVerification(){
            const date = new Date().toLocaleString();
            
            events.publish("verifyUpToDateClicked", date)
        }
    }
    //no obvious issues here or with dataModel or availabilityDOM
    function renderMainPageAvailability(availabilityDOM, availabilityData){
        const availabilityDisplay = availabilityDOM.querySelector("#availabilityDisplay");
        const editAvailability = availabilityDOM.querySelector("#editAvailability");

        const availabilityDisplayNew = buildAvailabilityDisplay(availabilityData);
        availabilityDisplay.replaceWith(availabilityDisplayNew);

        editAvailability.addEventListener("click", getAvailabilityModel);

        return availabilityDOM
        
        function getAvailabilityModel(){
            events.publish("availabilityModelRequested")
        }
    }

    function buildAvailabilityDisplay(availabilityData){
        const availabilityDisplayNew = document.createElement("div");
        availabilityDisplayNew.id = "availabilityDisplay"
        for(let day in availabilityData){
            const dayDiv = document.createElement("div");
            dayDiv.classList.add("userAvailabilityDay");

            const label = document.createElement("p");
            label.classList.add("userAvailabilityDayLabel");

            label.innerText = `${day}`;
            dayDiv.appendChild(label)

            availabilityData[day].forEach(function(timeBlock){
                const blockNumber = availabilityData[day].indexOf(timeBlock);
                
                const timeBlockDiv = document.createElement("div");
                timeBlockDiv.classList.add("userAvailabilityTimeBlock")
                
                const startTime = document.createElement("p");
                const endTime = document.createElement("p");

                startTime.innerText = `Start: ${timeValueConverter.runConvertTotalMinutesToTime(availabilityData[day][blockNumber].startTime)}`;
                endTime.innerText = `End: ${timeValueConverter.runConvertTotalMinutesToTime(availabilityData[day][blockNumber].endTime)}`;

                timeBlockDiv.appendChild(startTime);
                timeBlockDiv.appendChild(endTime);
                dayDiv.appendChild(timeBlockDiv)
            })
            availabilityDisplayNew.appendChild(dayDiv)
        }
        return availabilityDisplayNew
    }

    function renderMainPageMyTeams(teamsDOM, teamArray){
        
        const teamGrid = teamsDOM.querySelector("#teamGrid"); 
        const addButton = teamsDOM.querySelector("#teamGridAddTeam");
    
        teamArray.forEach(function(team){
            const teamElement = buildTeam(team, teamArray); 
            teamGrid.appendChild(teamElement)
        })

        addButton.addEventListener("click", addTeam); //follow this
        
        return teamsDOM
        
        function addTeam(){
            events.publish("addTeam")
        }
    }

    //set CSS/class values for up/down buttons
    function buildTeam(team, teamArray){
        const template = document.querySelector("#mainPageTeamTemplate");
        const content = document.importNode(template.content, true);

        const teamName = content.querySelector(".teamGridTeamName");
        const teamSize = content.querySelector(".teamGridTeamSize");
        const lastVerified = content.querySelector(".teamGridTeamLastVerified");
        const optionContainer = content.querySelector(".teamGridTeamOptionContainer");
        const editButton = content.querySelector(".teamGridTeamEditButton");
        const deleteButton = content.querySelector(".teamGridTeamDeleteButton");
        const verifyButton = content.querySelector(".teamGridTeamVerifyButton");
        const upButton = content.querySelector(".moveOptionUpButton");
        const downButton = content.querySelector(".moveOptionDownButton");

        teamName.innerText = team.name;
        teamSize.innerText = `${team.size} athletes`;
        if(team.lastVerified != null){
            lastVerified.innerText += team.lastVerified
        }
        

        team.allOpts.forEach(function(optionDetails){
            const optNum = team.allOpts.indexOf(optionDetails)+1;
            const option = buildTeamOption(optionDetails, optNum);
            optionContainer.appendChild(option);
        })

        if(teamArray.length >1 && team.rank.myTeams != 0 && team.rank.myTeams != teamArray.length -1){
            upButton.addEventListener("click", moveMyTeamUp);
            downButton.addEventListener("click", moveMyTeamDown);
            
        }else if(teamArray.length >1 && team.rank.myTeams == teamArray.length-1){
            upButton.addEventListener("click", moveMyTeamUp);
            downButton.remove();
        }else if(teamArray.length >1 && team.rank.myTeams == 0){
            downButton.addEventListener("click", moveMyTeamDown);
            upButton.remove();
        }

        editButton.addEventListener("click", editTeam);
        deleteButton.addEventListener("click", deleteTeam);
        verifyButton.addEventListener("click", verifyTeam)

        return content

        function editTeam(){ 
            events.publish("editTeam", team); //follow these
        }
    
        function deleteTeam(){
            const confirmation = confirm(`Delete ${team.name}?`);
            if(confirmation){
                events.publish("deleteTeam", team);
            }   
        }

        function moveMyTeamUp(){
            events.publish("modifyMyTeamOrder", {index: team.rank.myTeams, modifier:-1});
        }

        function moveMyTeamDown(){
            events.publish("modifyMyTeamOrder", {index: team.rank.myTeams, modifier:1});
        }

        function verifyTeam(){
            events.publish("setTeamVerification", team)
        }
    }

    function buildTeamOption(optionDetails, optNum){
        const template = document.querySelector("#mainPageTeamOptionTemplate");
        const content = document.importNode(template.content, true);

        const optionNumDiv = content.querySelector(".teamGridTeamOptionNumber")
        const dayContainer = content.querySelector(".teamGridTeamDayContainer");

        optionNumDiv.innerText = `Option ${optNum}`;

        optionDetails.forEach(function(day){
            const dayDetails = buildTeamDayDetails(day);
            dayContainer.appendChild(dayDetails);
        })
        
        return content
    }
    
    function buildTeamDayDetails(day){
        const template = document.querySelector("#mainPageTeamDayTemplate");
        const content = document.importNode(template.content, true);

        const dayOfWeek = content.querySelector(".teamGridTeamDayOfWeek");
        const startTime = content.querySelector(".teamGridTeamStartTime");
        const endTime = content.querySelector(".teamGridTeamEndTime");
        const inWeiss = content.querySelector(".teamGridTeamInWeiss");

        dayOfWeek.innerText = day.dayOfWeek;
        startTime.innerText = timeValueConverter.runConvertTotalMinutesToTime(day.startTime).toString();
        endTime.innerText = timeValueConverter.runConvertTotalMinutesToTime(day.endTime).toString();
        inWeiss.innerText = day.inWeiss;

        return content
    }
})()

const requestFormDOM = (function(){
    
    events.subscribe("workingModelPopulated", publishRequestFormRender)
    events.subscribe("optionsModified", renderAllOpts)
    events.subscribe("userSelectorsBuilt", setSelectorNodes)
    events.subscribe("mainPageModelBuilt", setAllTeams);

    
    let allTeams;

    const selectorNodes = {
        startTime: null,
        endTime: null,
        teamSize: null,
        dayOfWeek: null,
        inWeiss: null
    };

    function setAllTeams(mainPageData){
       allTeams = mainPageData.allTeams;      
    }

    function setSelectorNodes(selectorElementObj){
        for(let selectorElement in selectorElementObj){
            switch(selectorElement){
                case `dayOfWeek`:
                case `startTime`:
                case `endTime`:
                case `teamSize`:
                case `inWeiss`:
                    selectorNodes[selectorElement] = selectorElementObj[selectorElement];
                    break;
                default:
                    break;
            }  
        }  
    }

    function publishRequestFormRender(workingModel){
        const requestPage = renderRequestFormPage(workingModel);
        events.publish("pageRenderRequested", requestPage);
    }


    function renderRequestFormPage(workingModel){
        const template = document.querySelector("#requestFormPageTemplate");
        const content = document.importNode(template.content, true);

        const teamName = content.querySelector("#formTeamName");
        const teamSize = content.querySelector("#formTeamSize"); 
        const allOpts = content.querySelector("#formAllOpts");
        const addButton = content.querySelector("#addTrainingOption");
        const updateButton = content.querySelector("#updateTeamRequest");
        const cancelButton = content.querySelector("#cancelTeamRequest");

        const teamNameNew = renderTeamName(teamName, workingModel);
        const teamSizeNew = renderTeamSizeSelection(teamSize, workingModel);
        const allOptsNew = renderAllOpts(workingModel);

        teamName.replaceWith(teamNameNew);
        teamSize.replaceWith(teamSizeNew);
        allOpts.replaceWith(allOptsNew);

        addButton.addEventListener("click", addOption);
        updateButton.addEventListener("click", updateTeamRequest);
        cancelButton.addEventListener("click", cancelTeamRequest);

        return content;

        function addOption(){
            events.publish("addOpt")
        }
        
        function updateTeamRequest(){
            events.publish("updateTeamRequest")
        }
        
        function cancelTeamRequest(){
            events.publish("mainPageDOMRequested")
        }    
    }
    

    function renderTeamName(teamNameDOM, workingModel){
        
        teamNameDOM.value = workingModel.name;

        teamNameDOM.addEventListener("blur", function modifyTeamNameValue(){ 
            if(workingModel.name != teamNameDOM.value && blockTeamDuplication() == true){
                alert(`Data already exists for ${teamNameDOM.value}. Use another team name or select edit for ${teamNameDOM.value}`);
                teamNameDOM.value = workingModel.name;
                teamNameDOM.focus();
            }else if(workingModel.name != "" && teamNameDOM.value != workingModel.name){
                const confirmation = confirm(`If you submit changes, this will change team name from ${workingModel.name} to ${teamNameDOM.value}. Proceed? `);
                if(confirmation){
                    events.publish("modifyTeamNameValue", teamNameDOM.value)
                }else{
                    teamNameDOM.value = workingModel.name;
                }
            }else if(workingModel.name != teamNameDOM.value){
                events.publish("modifyTeamNameValue", teamNameDOM.value)
            } 
        })

        return teamNameDOM;

        function blockTeamDuplication(){
            const teamCheck = allTeams.some(function(thisTeam){
                return thisTeam.name.toLowerCase() == teamNameDOM.value.toLowerCase();
            })
            return teamCheck;
        }
    }

    
    function renderTeamSizeSelection(teamSizeDOM, workingModel){
        const primaryClass = Array.from(teamSizeDOM.classList)[0];
        
        const selection = selectorNodes[`${primaryClass}`].cloneNode(true);  
        selection.id = "formTeamSize";

        const selectedOption= selection.querySelector(`option[value = "${workingModel.size}"]`);
        selectedOption.selected = true;
        if(selectedOption.value != "default"){
            selection.firstChild.disabled = true;
        }

        selection.addEventListener("change", modifyTeamSizeValue)
        selection.addEventListener("change", disableDefaultOption);
        
        teamSizeDOM.replaceWith(selection); //may be able to get rid of this

        return selection

        function modifyTeamSizeValue(){
            const value = selection.value 
            events.publish("modifyTeamSizeValue", value)
        }

        function disableDefaultOption(){ //these are all not working, may need to use event delegation within the modules themselves
            const values = Array.from(this.children);
            values[0].disabled = true;
        }

    }

    
    function renderAllOpts(workingModel){ 
        const allOptsNew = document.createElement("div");
        allOptsNew.id = "formAllOpts"; 

        workingModel.allOpts.forEach(function(optionDetails){
            const optNum = workingModel.allOpts.indexOf(optionDetails) + 1; 
            const option = buildOption(workingModel.allOpts, optionDetails, optNum);
            allOptsNew.appendChild(option);
        });
        
        const allOpts = document.querySelector("#formAllOpts");
        if(allOpts != null){
            allOpts.replaceWith(allOptsNew);
        }
        else{
            return allOptsNew
        }  
    }  


    function buildOption(allOptsDetails, optionDetails, optNum){     
        
        events.subscribe("daysModified", renderModifiedDayDetails)
        
        const template = document.querySelector("#optionTemplate");
        const content = document.importNode(template.content, true);

        const labelButtonDiv = content.querySelector(".labelDeleteOptButton");
        const label = content.querySelector(".optLabel");
        const allDaysDOM = content.querySelector(".formAllDays"); 
        const addDayButton = content.querySelector(".addTrainingDay");

        label.innerHTML = `Option ${optNum}`;

        if(allOptsDetails.length >1){
            const deleteButton = document.createElement("button");
            const upButton = document.createElement("button"); //both need class and css
            const downButton = document.createElement("button");
            
            deleteButton.classList.add("deleteOpt");
            upButton.classList.add("myTeamsMoveUpButton");
            downButton.classList.add("myTeamsMoveDownButton");

            deleteButton.addEventListener("click", deleteOpt)
            upButton.addEventListener("click", moveOptionUp);
            downButton.addEventListener("click", moveOptionDown);

            deleteButton.innerText = "X"

            labelButtonDiv.insertBefore(deleteButton, label)

            if(optNum != 1 && optNum != allOptsDetails.length){
                labelButtonDiv.appendChild(upButton)
                labelButtonDiv.appendChild(downButton)
            }
            if(optNum == allOptsDetails.length){
                labelButtonDiv.appendChild(upButton)
            }
            if(optNum == 1){
                labelButtonDiv.appendChild(downButton)
            }
        }

        addDayButton.addEventListener("click", addDay);
        
        renderAllDaysDetails(optionDetails, optNum, allDaysDOM); 

        return content
        
        function addDay(){ //UPDATE THESE IN ACTUAL MODULE
            events.publish("addDay", optNum)
        }

        function deleteOpt(){
            events.publish("deleteOpt", optNum)
        }

        function moveOptionUp(){
            events.publish("modifyOptOrder", {optNum, modifier:-1}) 
        }

        function moveOptionDown(){
            events.publish("modifyOptOrder", {optNum, modifier:1})
        }

        function renderModifiedDayDetails(dayDetailsObj){
            if(dayDetailsObj.publishedOptNum == optNum){
                const allOpts = document.querySelector("#formAllOpts");
                const thisOption = Array.from(allOpts.children)[optNum-1];
                const allDaysDOM = thisOption.querySelector(".formAllDays");

                renderAllDaysDetails(dayDetailsObj.publishedOptionDetails, dayDetailsObj.publishedOptNum, allDaysDOM)
            }
        }
    }


    function renderAllDaysDetails(optionDetails, optNum, allDaysDOM){
        const allDaysDOMNew = document.createElement("div");  
        allDaysDOMNew.classList.add("formAllDays")

        optionDetails.forEach(function(dayDetails){
            const dayNum = optionDetails.indexOf(dayDetails) +1; 
            const day = buildDay(optionDetails, dayDetails, optNum, dayNum);
            allDaysDOMNew.appendChild(day);
        })
        allDaysDOM.replaceWith(allDaysDOMNew);
        
    }


    function buildDay(optionDetails, dayDetails, optNum, dayNum){     
        const template = document.querySelector("#dayTemplate");
        const content = document.importNode(template.content, true);

        const labelButtonDiv = content.querySelector(".labelDeleteDayButton");
        const label = content.querySelector(".dayLabel");
        const allDaysDetails = content.querySelector(".formAllDayDetails");
        
        label.innerHTML = `Day ${dayNum}`;
        
        if(optionDetails.length>1){
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("deleteDay");
            deleteButton.innerText = "X"
            
            deleteButton.addEventListener("click", deleteDay);
            labelButtonDiv.insertBefore(deleteButton, label)
        }
        
        const allDaysDetailsNew = buildDayDetails(dayDetails, optNum, dayNum);

        allDaysDetails.replaceWith(allDaysDetailsNew)

        return content

        function deleteDay(){
            events.publish("deleteDay", {optNum, dayNum})
        } 
    }
    

    function buildDayDetails(dayDetails, optNum, dayNum){        
        const template = document.querySelector("#dayDetailsTemplate");
        const content = document.importNode(template.content, true);

        const selectors = content.querySelectorAll(".selector")

        selectors.forEach(function(selection){
            const primaryClass = Array.from(selection.classList)[0];
            
            const selectionNew = selectorNodes[`${primaryClass}`].cloneNode(true);
            selectionNew.addEventListener("change", publishSelectionValueChange)
            selectionNew.addEventListener("change", disableDefaultOption)
            if(primaryClass == "startTime"){
                selectionNew.addEventListener("click", modifyEndTimeDefaultValue)
            }

            const selectedOption = selectionNew.querySelector(`option[value = "${dayDetails[primaryClass]}"]`);
            selectedOption.selected = true;
            if(selectedOption.value != "default"){
                selectionNew.firstChild.disabled = true;
            }
        
            selection.replaceWith(selectionNew);

            function publishSelectionValueChange(){
                const selector = primaryClass;
                const value = selectionNew.value
                events.publish("modifyTeamSelectorValue", {optNum, dayNum, selector, value})
            }

            function disableDefaultOption(){ //these are all not working, may need to use event delegation within the modules themselves
                const values = Array.from(this.children);
                values[0].disabled = true;
            }

            function modifyEndTimeDefaultValue(){
                const startTimeSelectedValue = Number(this.value);
                const endTimeValuesArray = Array.from(this.parentElement.nextElementSibling.lastElementChild.children);
                endTimeValuesArray.forEach(function(time){
                    const endTimeValue = Number(time.value);
                    if(endTimeValue < startTimeSelectedValue + 30 || endTimeValue == "default"){
                        time.disabled = true;
                    }else{
                        time.disabled = false;
                    }
                })
            }
        });

        return content

       
    }

})();

const selectorBuilder = (function(){ 

    //default values must be input (into database?) for facilityOpen/Close/MaxCapacity BEFORE first time running, or startTime/endTime/teamSize will have errors!
    const selectionOptions = { 
        startTime: {
            start: null,
            end: null,
            increment: 15
        },
        endTime: {
            start: null,
            end: null,
            increment: 15
        },
        teamSize: {
            start: 5,
            end: null,
            increment: 5
        },
        facilityOpen:{ //4am to 8pm, default value 6am (360)?
            start: 240,
            end: 1200,
            increment: 15
        },
        facilityClose:{ //5am to 9pm, default value 8pm (1200)?
            start: 300,
            end: 1260,
            increment: 15
        },
        facilityMaxCapacity:{//range 10-150, default value 120?
            start: 10,
            end: 150,
            increment: 5
        },
        dayOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], 
        inWeiss: ["yes", "no"],
    };

    const selectors = {}
    
    events.subscribe("adminSelectorsRequested", setAdminSelectionOptions);
    events.subscribe("userSelectorsRequested", setUserSelectionOptions); 

    function setAdminSelectionOptions(selectorsModel){
        setSelectionOptions(selectorsModel);
        events.publish("adminSelectorsBuilt", selectors) 
    }

    function setUserSelectionOptions(selectorsModel){
        setSelectionOptions(selectorsModel);
        events.publish("userSelectorsBuilt", selectors) 
    }

    function setSelectionOptions(selectorsModel){
        selectionOptions.startTime.start = selectorsModel.facilityOpen;
        selectionOptions.endTime.start = selectorsModel.facilityOpen + 30;
        selectionOptions.startTime.end = selectorsModel.facilityClose - 30;
        selectionOptions.endTime.end = selectorsModel.facilityClose;
        selectionOptions.teamSize.end = selectorsModel.facilityMaxCapacity;
        
        for(let option in selectionOptions){
            selectors[option] = buildSelector(option);
        }
    }

    function buildSelector(primaryClass){
        const selection = document.createElement("select");
        selection.classList.add(primaryClass);
        selection.classList.add("selector");
            const defaultOption = document.createElement("option");
            defaultOption.value = "default";
            defaultOption.innerText = "--";
        selection.appendChild(defaultOption);

        switch(primaryClass){
            case "dayOfWeek":
            case "inWeiss": 
                buildArraySelectorOptions(primaryClass, selection);
                break;
            
            case "teamSize":
                buildRangeSelectorOptions(primaryClass, selection);
                break;   
            case "endTime":
            case "facilityClose":
            case "facilityMaxCapacity":
                buildRangeSelectorOptions(primaryClass, selection);
                break;
            
            case "startTime":
            case "facilityOpen":
                buildRangeSelectorOptions(primaryClass, selection);
                break;
        }

        return selection
    }

    function buildArraySelectorOptions(primaryClass, selector){
        const optionValues = selectionOptions[primaryClass];
        optionValues.forEach(function(optionValue){
            const option = document.createElement("option");
            option.value = optionValue;
            option.innerText = optionValue;
            selector.appendChild(option); 
        })
    }

    function buildRangeSelectorOptions(primaryClass, selector){
        const optionValues = selectionOptions[primaryClass];
        for(let i = optionValues.start; i<=optionValues.end; i += optionValues.increment){
            const option = document.createElement("option");
            option.value = i;
            if(primaryClass == "teamSize" || primaryClass == "facilityMaxCapacity"){
                option.innerText = i;
            }else{
                option.innerText = timeValueConverter.runConvertTotalMinutesToTime(i); //toString() should not be necessary
            }selector.appendChild(option);
        }
    }


})();

const availabilityValidator = (function(){
    // no obvious issues
    events.subscribe("adminAvailabilityValidationRequested", validateAllAdminAvailability);
    events.subscribe("userAvailabilityValidationRequested", validateAllUserAvailability);
    
    function validateAllAdminAvailability(availabilityData){
        if(validateAllInputs(availabilityData) == "No conflicts"){
            events.publish("adminAvailabilityDataValidated",availabilityData)
        }
    }
    
    function validateAllUserAvailability(availabilityData){
         if(validateAllInputs(availabilityData) == "No conflicts"){
            events.publish("userAvailabilityDataValidated",availabilityData);
        }
    }
    
    function validateAllInputs(availabilityData){
        let string = "A non-default value must be selected for the following: ";
        const emptySelectors = [];

        for(let day in availabilityData){
            let dayString = `${day}--`;
            const dayEmptySelectors = [];
            availabilityData[day].forEach(function(block){
                for(let prop in block){
                    if(block[prop] == "default"){
                        dayEmptySelectors.push(prop);
                        dayString += `${prop}; `;
                    }
                }
            })

            if(dayEmptySelectors.length > 0){
                emptySelectors.push(dayEmptySelectors);
                string += `${dayString}` ;
            }
        }

        if(emptySelectors.length > 0){
            alert(string)
        }else{
            return "No conflicts"
        }
    }
})()

const facilityDataValidator = (function(){
    //no obvious issues here
    events.subscribe("adminFacilityDataValidationRequested", validateAdminFacilityData);
    
    function validateAdminFacilityData(facilityData){
        const string = "A non-default value must be selected for the following:";
        const emptySelectors = [];
  
        for(let prop in facilityData){
            if(facilityData[prop] == "default"){
                emptySelectors.push(prop);
            string.concat(", ", prop);
            }
        }

        if(emptySelectors.length > 0){
            alert(string)
        }else{
            events.publish("adminFacilityDataValidated", facilityData)
        }
    }
})()

const requestValidator = (function(){

    let facilityData

    events.subscribe("validateTeamRequest", validateAllInputs);
    events.subscribe("mainPageModelBuilt", setFacilityData)

    function setFacilityData(mainPageModel){
        facilityData = mainPageModel.facilitySelectors
    }

    function validateAllInputs(teamDataObj){
        const errorArray = [];

        validateName(teamDataObj.workingModel, errorArray);
        validateSize(teamDataObj.workingModel, errorArray);
        validateSchedulePreferences(teamDataObj.workingModel, errorArray);

        if(errorArray.length > 0){
            const errorAlert = errorArray.join(" ");
            alert(errorAlert);
        }else{
            events.publish("workingModelValidated", {workingModel : teamDataObj.workingModel, teamRequest : teamDataObj.teamRequest});
        }
    }

    function validateName(workingModel, array){
        const name = workingModel.name;
        const nameRegex = /[^A-Za-z0-9]/;
        try{
            if(nameRegex.test(name)){
                throw("Team names can only include letters and numbers (no spaces or symbols).");
            }else if(name == ""){
                throw("Team name must have a value.");
            }
        }catch(err){
            array.push(err)
        }
    }

    function validateSize(workingModel,array){
        const size = workingModel.size;
        try{
            if(size == "default"){
                throw("Team size must have a value.")
            }else if(size > facilityData.facilityMaxCapacity){
                throw("Team size is greater than max size value. Discuss max size value changes with administrator.")
            }
        }catch(err){
            array.push(err)
        }
    }

    function validateSchedulePreferences(workingModel,array){
        workingModel.allOpts.forEach(function(option){
            const optNum = workingModel.allOpts.indexOf(option) + 1;
            const validatedDayArray = [];

            option.forEach(function(day){
                const dayNum = option.indexOf(day)+1;
                catchInvalidInputs();
                catchConflictingDays();

                function catchInvalidInputs(){
                    for(const prop in day){
                        try{
                            if(day[prop] == "default"){
                                throw(`Option ${optNum}: Day ${dayNum}: ${prop} must have a value.`);
                            }else if((prop == "startTime" || prop == "endTime") && (day[prop] < facilityData.facilityOpen || day[prop] > facilityData.facilityClose)){
                                throw(`Option ${optNum}: Day ${dayNum}: ${prop} is outside operating hours. Discuss operating hour changes with administrator.`);
                            }
                        }catch(err){
                            array.push(err)
                        }  
                    }
                }

                function catchConflictingDays(){
                    try{
                        validatedDayArray.forEach(function(validatedDay){
                            const validatedNum = validatedDayArray.indexOf(validatedDay) + 1 ;
                            if(validatedDay.dayOfWeek == day.dayOfWeek && validatedDay.startTime == day.startTime && validatedDay.inWeiss == day.inWeiss){
                                throw(`Option ${optNum}: Day ${validatedNum} and Day ${dayNum} are duplicates.`);
                            }else if(validatedDay.dayOfWeek == day.dayOfWeek && day.startTime < validatedDay.startTime && day.endTime > validatedDay.endTime){
                                throw(`Option ${optNum}: Day ${dayNum}'s session runs through Day ${validatedNum}'s session.`);
                            }else if(validatedDay.dayOfWeek == day.dayOfWeek && day.startTime > validatedDay.startTime && day.startTime < validatedDay.endTime){
                                throw(`Option ${optNum}: Day ${dayNum}'s start time is in the middle of  Day ${validatedNum}'s session.`);
                            }else if(validatedDay.dayOfWeek == day.dayOfWeek && day.endTime < validatedDay.endTime && day.endTime > validatedDay.startTime){
                                throw(`Option ${optNum}: Day ${dayNum}'s end time is in the middle of  Day ${validatedNum}'s session.`);
                            }   
                        })
                        validatedDayArray.push(day)
                    }catch(err){
                        array.push(err)
                    }
                }
            })
        })
    }

})();

const userValidator = (function(){
    //no obvious issues
    events.subscribe("userDataValidationRequested", validateAllInputs);
    
    function validateAllInputs(adminUserData){
        const errorArray = [];

        validateUserName(adminUserData.newData, errorArray); 
        validateColor(adminUserData.newData, errorArray)

        if(errorArray.length > 0){
            const errorAlert = errorArray.join(" ");
            alert(errorAlert);
        }else{
            events.publish("userDataValidated", adminUserData);
        }
    }

    function validateUserName(userModel, array){
        const userName = userModel.name;
        const userNameRegex = /[^A-Za-z0-9]/;
        try{
            if(userNameRegex.test(userName)){
                throw("User names can only include letters and numbers (no spaces or symbols).");
            }else if(userName == ""){
                throw("User name must have a value.");
            }
        }catch(err){
            array.push(err)
        }
    }

    function validateColor(userModel, array){
        const color = userModel.color;
        try{
            if(color == "#000000"){
                throw("Color must have a value not equal to black. Black is default value, and must be changed.")
            }
        }catch(err){
            array.push(err)
        }

    }


})()

const pageRenderer = (function(){
    


    events.subscribe("mainPageModelBuilt", setNameAndAdminAccess)
    events.subscribe("adminMainPageModelBuilt",setNameAndAdminAccess)
    events.subscribe("pageRenderRequested", renderPageContent);
    
    let name;
    let adminAccess;

    let userPageLink;
    let adminPageLink;

    const nav = document.querySelector("#nav")
    const logOutLink = document.querySelector("#logOutLink");

    logOutLink.addEventListener("click", doTheThing);

    function doTheThing(){} //make this a logOut Function


    function renderPageContent(page){
        const mainContent = document.getElementsByTagName("main")[0];
        const newMainContent = document.createElement("main");

        newMainContent.appendChild(page);
        mainContent.replaceWith(newMainContent);

    }

    function setNameAndAdminAccess(userData){
        name = userData.name;
        adminAccess = userData.privilegeLevel;

        setDropdownPrivilegeAccess();
    }

    function setDropdownPrivilegeAccess(){
        if(adminAccess == true && userPageLink == null && adminPageLink == null){
            userPageLink = document.createElement("h3");
            adminPageLink = document.createElement("h3");

            userPageLink.id = "userPageLink";
            userPageLink.classList.add("navLink");
            userPageLink.innerText = "User Page"

            adminPageLink.id = "adminPageLink";
            adminPageLink.classList.add("navLink");
            adminPageLink.innerText = "Admin Page"
        
            userPageLink.addEventListener("click", publishPageChangeRequest);
            adminPageLink.addEventListener("click", publishPageChangeRequest);

            nav.insertBefore(userPageLink,logOutLink);
            nav.insertBefore(adminPageLink,logOutLink);
        }

        function publishPageChangeRequest(){
            const string = "PageButton"
            const truncateIndex = this.id.indexOf(string);
            const pageIdentifier = this.id.slice(0, truncateIndex);
            
            events.publish("pageChangeRequested", {name, pageIdentifier})
        }  
    }

    return {renderPageContent}

})();

const temporaryDatabasePostSimulator = (function(){

    events.subscribe("allUsersDataUpdated", changeAllUsersArray);
    events.subscribe("adminAvailabilityDataUpdated", alertAndLogCurrentObject)
    events.subscribe("adminAllTeamsDataUpdated", changeAllTeamsData)
    events.subscribe("adminFacilityDataUpdated", changeFacilityData)
    events.subscribe("availabilityDataUpdated", changeAvailabilityData)
    events.subscribe("myTeamsDataUpdated", changeMyTeamsData)
    events.subscribe("verifyUpToDateClicked", changeVerificationData)//
    events.subscribe("pageChangeRequested", alertAndLogCurrentObject);
    events.subscribe("userSeasonChangeRequested", changeUserSeason); //
    events.subscribe("adminSeasonChangeRequested", changeAdminSeason);
    

    function alertAndLogCurrentObject(databaseBoundObject){
        console.log(databaseBoundObject)
        alert(databaseBoundObject)
    }

    function changeFacilityData(databaseBoundObject){
        alertAndLogCurrentObject(databaseBoundObject);
        adminTestObj.facilitySelectors = databaseBoundObject;
        events.publish("dataLoadedFromDatabase", adminTestObj)
    }

    function changeAllTeamsData(databaseBoundObject){
        alertAndLogCurrentObject(databaseBoundObject)
        const sortedTeams = databaseBoundObject.sort(function(a,b){
            return a.rank.allTeams - b.rank.allTeams
        })
        adminTestObj.allTeams = sortedTeams
        events.publish("dataLoadedFromDatabase", adminTestObj)
    }

    function changeAllUsersArray(databaseBoundObject){
        alertAndLogCurrentObject(databaseBoundObject)
        adminTestObj.allUsers = databaseBoundObject;
        events.publish("dataLoadedFromDatabase", adminTestObj)
    }

    function changeAdminSeason(databaseBoundObject){
        alertAndLogCurrentObject(databaseBoundObject)
        adminTestObj.season = databaseBoundObject
        events.publish("dataLoadedFromDatabase", adminTestObj)
    }

    function changeUserSeason(databaseBoundObject){
        alertAndLogCurrentObject(databaseBoundObject)
        userTestObj.season = databaseBoundObject
        events.publish("dataLoadedFromDatabase", userTestObj)
    }


    function changeVerificationData(databaseBoundObject){
        alertAndLogCurrentObject(databaseBoundObject)
        userTestObj.lastVerified = databaseBoundObject
        events.publish("dataLoadedFromDatabase", userTestObj)
    }

    function changeAvailabilityData(databaseBoundObject){
        alertAndLogCurrentObject(databaseBoundObject)
        userTestObj.availability = databaseBoundObject
        events.publish("dataLoadedFromDatabase", userTestObj)
    }

    function changeMyTeamsData(databaseBoundObject){
        alertAndLogCurrentObject(databaseBoundObject)
        const sortedTeams = databaseBoundObject.sort(function(a,b){
            return a.rank.myTeams - b.rank.myTeams
        })
        userTestObj.teams = sortedTeams
        events.publish("dataLoadedFromDatabase", userTestObj)
    }

})();

const timeValueConverter = (function(){
    //no obvious issues here
    function convertTotalMinutesToTime(totalMins){
        let standardTime;
        let hour = Math.floor(totalMins/60)
        let meridian
            switch(hour){
                case 0:
                    hour += 12
                    meridian = "a"
                    break;
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                    meridian = "a"
                    break;
                case 12:
                    meridian = "p"
                    break;
                default:
                    hour -=12
                    meridian = "p"
                    break;
            }
            
        let mins = totalMins%60
            if(mins == 0){
                mins = "00"
            }
        standardTime = `${hour}:${mins}${meridian}`
        return standardTime
    }

    function runConvertTotalMinutesToTime(totalMins){
        return convertTotalMinutesToTime(totalMins)
    }

    function convertTimeToTotalMinutes(time){
        const colonIndex = time.indexOf(":");
        const meridian = time[time.length-1]
        const meridianIndex = time.indexOf(meridian);
        
        let hour = Number(time.slice(0, colonIndex));
            if(meridian == "p" && hour != 12){
                hour +=12;
            }else if(meridian == "a" && hour == 12){
                hour -=12;
            }
        const min = Number(time.slice(colonIndex + 1, meridianIndex));
        const totalMinutes = hour*60 + min;

        return totalMinutes
    }

    function runConvertTimeToTotalMinutes(time){
        return convertTimeToTotalMinutes(time)
    }

    return {runConvertTimeToTotalMinutes, runConvertTotalMinutesToTime}

})();













