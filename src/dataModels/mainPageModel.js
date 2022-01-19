import { events } from "../events";

/*purpose: dataModel from database for loading content for user and adminPages

database object is modeled as such:

obj = {
    myteams/allTeams: 
        [{ 
            teamName,
            teamSize, 
            rank:
                {
                    myTeams,
                    allTeams
                },
            allOpts: [[{dayOfWeek, startTime, endTime, inWeiss}, {etc}], [{etc}, {etc}], []],
            coach,
        }, {etc}, {etc}]
    
    allUsers: [user, user, user]

    user:
        {
            name,
            color, //for ADMIN LEVEL ONLY
            privilegeLevel,
            teams:{},
            availability:{},
            lastVerified,
            adminPageSet,
            season
        }

    facilitySelectors:
        {facilityOpen, facilityClose, facilityMaxCapacity}

    adminTimeBlocks:
        {day: [{start, stop, admin}, {start, stop, admin}], day: [{start, stop, admin}, {start, stop, admin}]}  //for ADMIN LEVEL ONLY
}

publishes:
    admin/userSelector build requests FOR selectorDOMBuilder
    admin/userMainPageData model builds FOR admin/userMainPage DOM and all necessary dataModels

subscribes to: 
    data load FROM database
    admin level pageChange requests from pageRenderer
    adminMainPageDOM requests FROM adminUserGenerator cancellation AND ...
*/

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
        privilegeLevel:"admin",
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
        adminPageSet:"admin",
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
        allUsers: [],
        adminTimeBlocks: [],
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

export {mainPageModel}