import {events} from "../src/events"

const databasePost = (function(){

    // events.subscribe("allUsersDataUpdated", changeAllUsersArray);
    // events.subscribe("adminAvailabilityDataUpdated", alertAndLogCurrentObject)
    // events.subscribe("adminAllTeamsDataUpdated", changeAllTeamsData)
    events.subscribe("adminFacilityDataUpdateRequested", changeFacilityData)
    // events.subscribe("availabilityDataUpdated", changeAvailabilityData)
    // events.subscribe("myTeamsDataUpdated", changeMyTeamsData)
    // events.subscribe("verifyUpToDateClicked", changeVerificationData)//
    // events.subscribe("pageChangeRequested", alertAndLogCurrentObject);
    // events.subscribe("userSeasonChangeRequested", changeUserSeason); //
    // events.subscribe("adminSeasonChangeRequested", changeAdminSeason);
    

    function alertAndLogCurrentObject(databaseBoundObject){
        console.log(databaseBoundObject)
        alert(databaseBoundObject)
    }

    async function changeFacilityData(databaseBoundObject){ 
        try{
            const facilityDataResponse = await fetch('adminHome/postAdminFacilitySettings.json', {
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
          
                },
                body: JSON.stringify(databaseBoundObject)
    
            });
            console.log(await facilityDataResponse.body)
            events.publish("facilityDataSaved")
        }catch(err){
            console.log(err)
        }//fix the id to be dynamic
       
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
                enabled: true,
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
                enabled: true,
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
                enabled: false,
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
                enabled: true,
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

})();

export {databasePost}