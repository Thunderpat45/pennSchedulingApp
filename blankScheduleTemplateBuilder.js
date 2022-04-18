
const userControllerFunctions = require('./controllers/usersController');

const blankScheduleTemplateBuilder = (function(){

    function setDefaultData(scheduleTemplateData){

        const {facilityData, allAvailabilities, allUsers} = scheduleTemplateData       
        const coachAvailability = sortAvailabilities(allAvailabilities, allUsers)

        return {facilityData, coachAvailability}
    }

    function sortAvailabilities(availArray, userArray){
        /*reduces database availability documents into object containing name of each user, each of which is an object containing properties for each day,
        each of which is an array that contains any availability blocks (startTime, endTime, admin or user created) for that day*/
        const availabilityObjTemplate = {
            'Sun': [],
            'Mon': [],
            'Tue': [],
            'Wed': [],
            'Thu': [],
            'Fri': [],
            'Sat': [],
        }
        
        const reducerObject = {};
        userArray.forEach(function(user){
            if(user.name){
                reducerObject[user.name] = structuredClone(availabilityObjTemplate)
            }
        })
        const sortedReducedArray = availArray.sort(sorter).reduce(reducer, reducerObject)
        return sortedReducedArray;


        function reducer(holderObject, availabilityArrayItem){
            //if the availability document is user-generated, push it to the relevant user prop, else if it is admin-generated, push it to ALL user props
            if(availabilityArrayItem.coach){
                holderObject[availabilityArrayItem.coach.name][availabilityArrayItem.day].push(availabilityArrayItem)      
            }else{
                for(let coach in holderObject){
                    holderObject[coach][availabilityArrayItem.day].push(availabilityArrayItem)
                }
            }
            return holderObject
        }

        function sorter(a,b){
            if(a.coach < b.coach || b.coach == undefined){           
                return -1
            }else if(a.coach > b.coach){
                return 1
            }else{
                return 0;
            }
        }
    }
    
    function buildEmptyScheduleTemplate(season){
        const {coachAvailability, facilityData} = setDefaultData(season)
        const scheduleTemplate = {}
        facilityData.days.forEach(function(day){
            scheduleTemplate[day] = Object.assign({});
            buildTimeSlots(scheduleTemplate, facilityData, day, coachAvailability)
        })

        return scheduleTemplate
    }

    function buildTimeSlots(scheduleTemplate, facilityData, day, coachAvailability){
        for(let time = facilityData.facilityOpen; time < facilityData.facilityClose; time +=15){
            scheduleTemplate[day][time] = { 
                /*for each 15min increment for each day, sets a number of available "slots" (i.e. the spaces occupied by other teams), pre-existing limitations to each coach's availability 
                before teams are considered, and an empty array that will capture any teams scheduled in that increment to check for same-coach conflicts*/
                slots: facilityData.facilityMaxCapacity,
                strengthCoachAvailability: setStrengthCoachAvailability(time, day, coachAvailability),
                existingTeams:[]
            }
        }
    }

    function setStrengthCoachAvailability(time, day, coachAvailability){
        const availabilityObject = {}
        for(let coach in coachAvailability){
            availabilityObject[coach] = "yes"
            const thisDayPreferences = coachAvailability[coach][day]
                thisDayPreferences.forEach(function(preference){
                    if(time >= preference.availability.startTime && time < preference.availability.endTime){
                        availabilityObject[coach] = "no"
                    }
                })
        }
        return availabilityObject
    }

    return {buildEmptyScheduleTemplate}
})()

module.exports = {buildEmptyScheduleTemplate: blankScheduleTemplateBuilder.buildEmptyScheduleTemplate}
    