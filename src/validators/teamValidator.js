import {events} from "../../src/events"
import { timeValueConverter } from "../timeConverter";

const teamValidator = (function(){

    let facilityData

    //ensure startTime is NOT => endTime

    events.subscribe('userDataFetched', setFacilityData)
    events.subscribe("teamValidationRequested", validateAllInputs);

    function setFacilityData(userData){
        facilityData = userData.facilityData
    }

    function validateAllInputs(teamDataObj){ //make use of origin as necessary
        const errorArray = [];

        validateName(teamDataObj.teamData, errorArray);
        validateSize(teamDataObj.teamData, errorArray);
        validateSchedulePreferences(teamDataObj.teamData, errorArray);

        if(errorArray.length == 0){
            events.publish("teamDataValidated", teamDataObj)
        }else{
            events.publish("teamDataValidationFailed", {errors: errorArray, origin: teamDataObj.origin})
        }
    }

    function validateName(teamData, array){
        const name = teamData.name;
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

    function validateSize(teamData,array){
        const size = teamData.size;
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

    function validateSchedulePreferences(teamData,array){
        teamData.allOpts.forEach(function(option){
            const optNum = teamData.allOpts.indexOf(option) + 1;
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

                    try{
                        if(day.startTime >= day.endTime){
                            throw(`Option ${optNum} Day ${dayNum}'s startTime ${timeValueConverter.runConvertTotalMinutesToTime(day.startTime)} is equal to or later than endTime ${timeValueConverter.runConvertTotalMinutesToTime(day.endTime)}`)
                        }
                    }catch(err){
                        array.push(err)
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

export{teamValidator}