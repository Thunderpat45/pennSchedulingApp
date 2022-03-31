const facilitySettings = require('./models/facilitySettingsModel');
const availabilities = require('./models/availabilityModel')

const blankScheduleTemplateBuilder = (function(){

    async function setDefaultData(){
        const facilityData = await facilitySettings.findOne();
        facilityData.days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

        console.log(facilityData)

        const allAvailabilities = await availabilities.find();
        const coachAvailability = sortAvailabilities(allAvailabilities, 'coach', 'day')

        console.log(coachAvailability)

        return {facilityData, coachAvailability}
    }

    function sortAvailabilities(array, coachProp, dayProp){
        const sortedReducedArray = array.sort(sorter).reduce(reducer, {});
        return sortedReducedArray;

        function reducer(holderObject, availabilityArrayItem){
            if(availabilityArrayItem[coachProp]){
                if(!holderObject[availabilityArrayItem[coachProp]]){
                    holderObject[availabilityArrayItem[coachProp]] = {}
                }
                if(!holderObject[availabilityArrayItem[coachProp]][availabilityArrayItem[dayProp]]){
                    holderObject[availabilityArrayItem[coachProp]][availabilityArrayItem[dayProp]] = []
                }
                holderObject[availabilityArrayItem[coachProp]][availabilityArrayItem[dayProp]].push(availabilityArrayItem)
            }else{
                for(let coach in holderObject){
                    if(!coach[availabilityArrayItem[dayProp]]){
                        holderObject[coach][availabilityArrayItem[dayProp]] = []
                    }
                    holderObject[coach][availabilityArrayItem[dayProp]].push(availabilityArrayItem)
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
    
    function buildEmptyScheduleTemplate(){
        const {coachAvailability, facilityData} = setDefaultData()
        const scheduleTemplate = {}
        facilityData.days.forEach(function(day){
            scheduleTemplate[day] = Object.assign({});
            buildTimeSlots(scheduleTemplate, facilityData, day, coachAvailability)
        })
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
                    if(time >= preference.startTime && time < preference.endTime){
                        availabilityObject[coach] = "no"
                    }
                })
        }
        return availabilityObject
    }

    return {buildEmptyScheduleTemplate: buildEmptyScheduleTemplate}

})()

module.exports = {buildEmptyScheduleTemplate: blankScheduleTemplateBuilder.buildEmptyScheduleTemplate}
    