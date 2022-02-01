const express = require('express');
const router = express.Router();
const timeConverter = require('../timeConverterExpress.js');

//change to authentication functionality
router.get('/', function(req, res, next) {
  res.render('home', {
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
})

module.exports = router;