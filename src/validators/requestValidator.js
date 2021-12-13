import {events} from "../events"

/*purpose: validator for single team dataModel updates

userObject is modeled as such:
obj = { 
    teamName,
    teamSize, 
    rank:
        {
            myTeams,
            allTeams
        },
    allOpts: [[{dayOfWeek, startTime, endTime, inWeiss}, {etc}], [{etc}, {etc}], []],
    coach           
}

publishes:
    successful validations FOR myTeamsModel
   
subscribes to: 
    validation requests FROM teamRequestModel
*/


const requestValidator = (function(){

    let facilityData

    events.subscribe("validateTeamRequest", validateAllInputs);
    events.subscribe("mainPageModelBuilt", setFacilityData)

    function setFacilityData(mainPageModel){
        facilityData = mainPageModel.facilitySelectors
    }

    function validateAllInputs(teamDataObj){
        const errorArray = [];

        validateName(teamDataObj.workingModel, errorArray);
        validateSize(teamDataObj.workingModel, errorArray);
        validateSchedulePreferences(teamDataObj.workingModel, errorArray);

        if(errorArray.length > 0){
            const errorAlert = errorArray.join(" ");
            alert(errorAlert);
        }else{
            events.publish("workingModelValidated", {workingModel : teamDataObj.workingModel, teamRequest : teamDataObj.teamRequest});
        }
    }

    function validateName(workingModel, array){
        const name = workingModel.name;
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

    function validateSize(workingModel,array){
        const size = workingModel.size;
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

    function validateSchedulePreferences(workingModel,array){
        workingModel.allOpts.forEach(function(option){
            const optNum = workingModel.allOpts.indexOf(option) + 1;
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

export{requestValidator}