const cron = require('node-cron')
const data = require('./databaseRepost')
const user = require('../models/userModel');
const team = require('../models/teamModel');
const availability = require('../models/availabilityModel');
const facilitySettings = require('../models/facilitySettingsModel');

function initializeScheduledJobs(){
 
  const resetDatabase = cron.schedule("*/30 * * * *", setDatabase);
  resetDatabase.start();
}

async function setDatabase(){
  try{
    await Promise.all([await team.deleteMany({}), await availability.deleteMany({}), await user.deleteMany({}), await facilitySettings.deleteOne({})]);
    await Promise.all([setUsers(), setTeams(), setAvailability(), setFacility()])
  }catch(err){
    console.log(err)
  }
}
  
  async function setUsers(){
    await Promise.all(data.users.map(async function(userData){
      const newUser = new user(userData)
      await newUser.save()
    }))
  }

  async function setTeams(){
    await Promise.all(data.teams.map(async function(teamData){
      const newTeam = new team(teamData);
      await newTeam.save();
    }))
  }

  async function setAvailability(){
    await Promise.all(data.availabilities.map(async function(availData){
      const newAvail = new availability(availData);
      await newAvail.save();
    }))
  }

  async function setFacility(){
    await Promise.all(data.facilitySettings.map(async function(facilData){
      const newFacilData = new facilitySettings(facilData);
      await newFacilData.save();
    }))
  }

module.exports = {initializeScheduledJobs, setDatabase}