const timeConverter = require('../timeConverterExpress.js');

const team = require('../models/teamModel');
const facilitySettings = require('../models/facilitySettingsModel');
const user = require('../models/userModel');
const availability = require('../models/availabilityModel');

const userMainControllerFunctions = {

    logOut: function(req,res, next){ //move to another module?
        res.send('NOT IMPLEMENTED: Log Out Functionality');
    },

    getHome: async function(req,res, next){ //userDependent, seasonal! should act on cancel buttons too
        const userId = req.params.userId;
        const season = req.params.season;

        try{
            const facilityData = await facilitySettings.findById('6202a107cfebcecf4ca9aecd');
            const thisUser = await user.findOne({_id: userId});
            renderHomePage(thisUser, facilityData);
        }catch(err){
            console.log(err)
            res.redirect() //
        }
        
        function renderHomePage(thisUser, facilityData){
            const {name, privilegeLevel, lastVerified, availability, teams} = thisUser;
            res.render('home', {
                name: name,
                privilegeLevel: privilegeLevel,
                layout: './layouts/homePagesLayout',
                timeConverter: timeConverter,
                season: "fall",
                lastVerified: lastVerified,
                availability: availability,
                teams: teams,
                facilityData: facilityData
              })
        }

        
    },

    postAllUserTeamsVerified: function(req,res, next){ //userDependent
        res.send('NOT IMPLEMENTED: Post All User Teams Verified');
    },

    postMyTeamsOrder: function(req,res, next){ // userDependent, seasonal!
        res.send('NOT IMPLEMENTED: Post My Teams Order');
    },

    getAdminHome: async function(req,res, next){ //userDependent, seasonal!, should act on cancel buttons too
        try{
            const {season} = req.params
            const facilityData = await facilitySettings.findById('6202a107cfebcecf4ca9aecd');
            const users = await user.find({});
            const adminAvailability = await availability.find({admin: true, season: season})
            const adminTimeBlocks = sortAvailabilities(adminAvailability)
            
            const data = {facilityData, users, adminTimeBlocks, season}

            renderAdminHome(data)
        }catch(err){
            console.log(err)
            res.redirect() //some error page
        }
      
        function sortAvailabilities(availabilityData){
            const availabilityObject = {
                Sun: [],
                Mon: [],
                Tue: [],
                Wed: [],
                Thu: [],
                Fri: [],
                Sat: [],
            }

            availabilityData.forEach(function(availability){
                availabilityObject[availability.day].push(availability)
            })

            for(let day in availabilityObject){
                availabilityObject[day].sort(function(a,b,){
                    return a.availability.startTime - b.availability.startTime
                })
            }

            return availabilityObject
        }

        function renderAdminHome(data){
            res.render('adminHome', { 
                name: "Brindle",
                layout: './layouts/homePagesLayout',
                timeConverter: timeConverter,
                privilegeLevel: true,
                season: "fall",
                lastVerified: 'October 10th, 2021',
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
                facilityData: data.facilityData,
    
                facilityRawData:{
                    open:{
                        start: 240,
                        end: 1200,
                        increment: 15
                    },
                    close:{
                        start: 300,
                        end: 1260,
                        increment: 15
                    },
                    maxCapacity:{
                        start: 10,
                        end: 150,
                        increment: 5
                    }
                },
            
                allUsers: data.users,
                adminTimeBlocks: data.adminTimeBlocks
            })
        }
        
    },

    getAdminDataAll: async function(req,res,next){//userDependent
        
        try{
            const {season} = req.params;
            const facilityData = await facilitySettings.findOne(); //turn this into a promise.all
            const allUsers = await user.find();
            const adminAvailability = await availability.find({admin: true, season: season})
            const adminTimeBlocks = sortAvailabilities(adminAvailability)
            const adminData = {facilityData, allUsers, adminTimeBlocks, season}
            res.json(adminData);
        }catch(err){
            console.log(err)
        }

        function sortAvailabilities(availabilityData){
            const availabilityObject = {
                Sun: [],
                Mon: [],
                Tue: [],
                Wed: [],
                Thu: [],
                Fri: [],
                Sat: [],
            }

            availabilityData.forEach(function(availability){
                availabilityObject[availability.day].push(availability)
            })

            for(let day in availabilityObject){
                availabilityObject[day].sort(function(a,b,){
                    return a.availability.startTime - b.availability.startTime
                })
            }

            return availabilityObject
        }
    },

    getUserDataAll: async function(req,res,next){
        const userId = req.params.userId;
        try{
            const thisUser = await user.findOne({_id: userId});
            res.json(thisUser);
        }catch(err){
            console.log(err)
        }
    },

    postAdminFacilitySettings: async function(req,res, next){ //userDependent
        try{
            const facilityData = req.body;
            await facilitySettings.findOneAndReplace({_id: facilityData._id}, facilityData)
            res.send("Literally anything")
        }catch(err){
            res.send(err)
        }
    },

    

    postAllTeamsOrder:function(req,res, next){ 
        res.send('NOT IMPLEMENTED: Post All Teams Order');
    },

    getSchedule:function(req,res, next){ 
        res.send('NOT IMPLEMENTED: Get Schedule');
    },


}

module.exports = userMainControllerFunctions;




// [
//     {
//     name: "Brindle",
//     color: "#00ff00",
//     privilegeLevel:true,
//     availability:{
//         Sun:[{startTime: "420", endTime: "540", admin: "no"}],
//         Mon:[],
//         Tue:[],
//         Wed:[],
//         Thu:[],
//         Fri:[],
//         Sat:[]
//     },
//     teams:
//         [
//             {
//             name:"basketballWomen",
//             coach: "Brindle",
//             rank:
//                 {
//                 myTeams: 0,
//                 allTeams:0
//                 },
//             size: 15,
//             allOpts:
//                 [
//                     [
//                         {dayOfWeek:"Tue", startTime: 420, endTime:495, inWeiss:"yes"},
//                         {dayOfWeek:"Thu", startTime: 420, endTime:495, inWeiss:"yes"},
//                         {dayOfWeek:"Fri", startTime: 420, endTime:495, inWeiss:"yes"},
//                     ],
//                 ]
//             },

//             {
//             name:"basketballMen",
//             coach: "Brindle",
//             rank:
//                 {
//                     myTeams: 1,
//                     allTeams:1
//                 },
//             size: 25,
//             allOpts:

//                 [
//                     [
//                         {dayOfWeek:"Tue", startTime: 930, endTime:990, inWeiss:"yes"},
//                         {dayOfWeek:"Thu", startTime: 915, endTime:975, inWeiss:"yes"},
//                         {dayOfWeek:"Fri", startTime: 870, endTime:930, inWeiss:"yes"},
//                     ],
//                 ]
//             },
//         ],
//     lastVerified: null,
//     adminPageSet:"admin",
//     season:"fall"
//     },

//     {    
//     name: "Rivera",
//     color: "#0000ff",
//     privilegeLevel:false,
//     availability:{
//         Sun:[{startTime: "420", endTime: "540", admin: "no"}],
//         Mon:[],
//         Tue:[],
//         Wed:[],
//         Thu:[],
//         Fri:[],
//         Sat:[]
//     },
//     teams:
//         [
//             {
//             name: "football",
//             coach:"Rivera",
//             rank:
//                 {
//                     myTeams: 0,
//                     allTeams:2
//                 },
//             size: 110,
//             allOpts:
//                 [
//                     [
//                         {dayOfWeek:"Tue", startTime: 870, endTime:915, inWeiss:"yes"},
//                         {dayOfWeek:"Thu", startTime: 870, endTime:915, inWeiss:"yes"},
//                         {dayOfWeek:"Fri", startTime: 945, endTime:975, inWeiss:"yes"},
//                     ],
//                 ]
//             },
//         ],
//     lastVerified: null,
//     adminPageSet:null,
//     season:"fall",
//     },

//     {    
//     name: "Dolan",
//     privilegeLevel:false,
//     color: "#ffa500",
//     availability:{
//         Sun:[{startTime: "420", endTime: "540", admin: "no"}],
//         Mon:[],
//         Tue:[],
//         Wed:[],
//         Thu:[],
//         Fri:[],
//         Sat:[]
//     },
//     teams:
//         [
//             {
//             name:"sprintFootball",
//             coach: "Dolan",
//             rank:
//                 {
//                     myTeams: 0,
//                     allTeams:3
//                 },
//             size: 50,
//             allOpts:

//                 [
//                     [
//                         {dayOfWeek:"Tue", startTime: 960, endTime:1020, inWeiss:"yes"},
//                         {dayOfWeek:"Sat", startTime: 540, endTime:600, inWeiss:"yes"},
//                     ],
//                 ]
//             },
//         ],
//     lastVerified: null,
//     adminPageSet:null,
//     season:"fall"
//     }
// ]