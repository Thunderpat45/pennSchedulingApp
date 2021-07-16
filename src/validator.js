import {events} from "../events"
/*
actions: checks for conflicts/errors in workingModels submitted for database posts

publishes: 
    workingModel validations

subscribes to:
    teamRequest validation requests
        from teamRequestData
    adjustedAdminOption loads
        from masterScheduleData
*/

const validator = (function(){

    let selectorValueRanges;

    events.subscribe("validateTeamRequest", validateAllInputs);
    events.subscribe("SOMETHINGABOUTADJUSTEDADMINOPTIONSLOADING", setValueRanges)

    function setValueRanges(adminRanges){
        selectorValueRanges = Object.assign({}, adminRanges)
    }

    function validateAllInputs(workingModel, teamRequest){
        const errorArray = [];

        validateName(workingModel, errorArray);
        validateSize(workingModel, errorArray);
        validateSchedulePreferences(workingModel, errorArray);

        if(errorArray.length > 0){
            const errorAlert = errorArray.join(" ");
            alert(errorAlert);
        }else{
            events.publish("workingModelValidated", workingModel, teamRequest); //this should push to DB
        }
    }

    function validateName(workingModel,array){
        const name = workingModel.teamName;
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
        const size = workingModel.teamSize;
        try{
            if(size == "default"){
                throw("Team size must have a value.")
            }else if(size > selectorValueRanges.slots){
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
                            if(prop.value == "default"){
                                throw(`Option${optNum} Day${dayNum} ${prop} must have a value.`);
                            }else if((prop == "startTime" || prop == "endTime") && (prop.value < selectorValueRanges.openTime || prop.value > selectorValueRanges.closeTime)){
                                throw(`Option${optNum} Day ${dayNum} ${prop} is outside operating hours. Discuss operating hour changes with administrator.`);
                            }
                        }catch(err){
                            array.push(err)
                        }  
                    }
                }

                function catchConflictingDays(){
                    validatedDayArray.forEach(function(validatedDay){
                        const validatedNum = validatedDayArray.indexOf(validatedDay);
                        try{
                            if(validatedDay.dayOfWeek == day.dayOfWeek && validatedDay.startTime == day.startTime && validatedDay.inWeiss == day.inWeiss){
                                throw(`Option${optNum} Day${validatedNum} and Day${dayNum} are duplicates.`);
                            }else if(validatedDay.dayOfWeek == day.dayOfWeek && validatedDay.startTime > day.startTime && validatedDay.inWeiss < day.inWeiss){
                                throw(`Option${optNum} Day${dayNum}'s end time is in the middle of  Day${validatedDay}'s session.`);
                            }else if(validatedDay.dayOfWeek == day.dayOfWeek && validatedDay.startTime < day.startTime && validatedDay.inWeiss > day.inWeiss){
                                throw(`Option${optNum} Day${dayNum}'s start time is in the middle of  Day${validatedDay}'s session.`);
                            }else{
                                validatedDayArray.push(day)
                            }
                        }catch(err){
                            array.push(err)
                        }
                        
                    })
                }
            })
        })
    }

})();

export{validator}