
const userControllerFunctions = require('./controllers/usersController');

const blankScheduleTemplateBuilder = (function(){

    function setDefaultData(scheduleTemplateData){ //this is running 2x,

        const {facilityData, allAvailabilities, allUsers} = scheduleTemplateData

        console.log(allUsers)
        
        const coachAvailability = sortAvailabilities(allAvailabilities, allUsers)

        console.log('I am nothing.')
        console.log(coachAvailability)
        console.log('Ive been reduced!')

        return {facilityData, coachAvailability}
    }

    function sortAvailabilities(availArray, userArray){
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
        console.log('here I am')
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
                slots: facilityData.facilityMaxCapacity, //this may change to single value?
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
    