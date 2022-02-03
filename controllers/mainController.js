const timeConverter = require('../timeConverterExpress.js');

const team = require('../models/teamModel');
const facilitySettings = require('../models/facilitySettingsModel');
const user = require('../models/userModel');
const availability = require('../models/availabilityModel');

const userMainControllerFunctions = {

    logOut: function(req,res, next){ //move to another module?
        res.send('NOT IMPLEMENTED: Log Out Functionality');
    },

    getHome: function(req,res, next){ //userDependent, seasonal! should act on cancel buttons too
        res.render('home', {
            name: 'Brindle',
            layout: './layouts/homePagesLayout',
            timeConverter: timeConverter,
            privilege: true,
            season: "fall",
            lastVerified: 'October 10th, 2021',
            availability: {
                Sun:[{startTime: "420", endTime: "540", admin: "no"}],
                Mon:[],
                Tue:[],
                Wed:[],
                Thu:[],
                Fri:[],
                Sat:[]
            },
            teams: [
              {
              name:"basketballWomen",
              coach: "Brindle",
              lastVerified: 'October 10th, 2021',
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
          ]
            
          })
    },

    postAllUserTeamsVerified: function(req,res, next){ //userDependent
        res.send('NOT IMPLEMENTED: Post All User Teams Verified');
    },

    postMyTeamsOrder: function(req,res, next){ // userDependent, seasonal!
        res.send('NOT IMPLEMENTED: Post My Teams Order');
    },

    getAdminHome: function(req,res, next){ //userDependent, seasonal!, should act on cancel buttons too
        res.render('adminHome', { 
            name: "Brindle",
            layout: './layouts/homePagesLayout',
            timeConverter: timeConverter,
            privilege: true,
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
            facilitySelectors:{
                facilityOpen:360,
                facilityClose: 1200,
                facilityMaxCapacity:120
            },

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
        
            })
    },

    postAdminFacilitySettings:function(req,res, next){ //userDependent
        res.send('NOT IMPLEMENTED: Post Admin Facility Settings');
    },

    postAdminTimeBlocks:function(req,res, next){ //userDependent, seasonal!
        res.send('NOT IMPLEMENTED: Post Admin Time Blocks');
    },

    postAllTeamsOrder:function(req,res, next){ 
        res.send('NOT IMPLEMENTED: Post All Teams Order');
    },

    getSchedule:function(req,res, next){ 
        res.send('NOT IMPLEMENTED: Get Schedule');
    },


}

module.exports = userMainControllerFunctions;