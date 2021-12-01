import {events} from "../events"
/*
actions: checks for conflicts/errors in team workingModels submitted for database posts

publishes: 
    workingModel validations

subscribes to:
    teamRequest validation requests
        from teamRequestData
    adjustedAdminOption loads
        from masterScheduleData
*/

const requestValidator = (function(){

    events.subscribe("validateTeamRequest", validateAllInputs);
    events.subscribe("SOMETHINGABOUTADJUSTEDADMINOPTIONSLOADED", setValueRanges) //get these from DB

    let selectorValueRanges;

    function setValueRanges(adminRanges){//adjust this when data incoming is more clear
        selectorValueRanges = Object.assign({}, adminRanges)
    }

    function validateAllInputs(obj){
        const errorArray = [];

        validateName(obj.workingModel, errorArray);
        validateSize(obj.workingModel, errorArray);
        validateSchedulePreferences(obj.workingModel, errorArray);

        if(errorArray.length > 0){
            const errorAlert = errorArray.join(" ");
            alert(errorAlert);
        }else{
            events.publish("workingModelValidated", {workingModel : obj.workingModel, teamRequest : obj.teamRequest});
        }
    }

    function validateName(workingModel, array){ //MOVE THIS TO requestFormDOM
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

    function validateSize(workingModel,array){ //MOVE THIS TO requestFormDOM
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
                    try{
                        validatedDayArray.forEach(function(validatedDay){
                            const validatedNum = validatedDayArray.indexOf(validatedDay) + 1 ;
                            if(validatedDay.dayOfWeek == day.dayOfWeek && validatedDay.startTime == day.startTime && validatedDay.inWeiss == day.inWeiss){
                                throw(`Option${optNum} Day${validatedNum} and Day${dayNum} are duplicates.`);
                            }else if(validatedDay.dayOfWeek == day.dayOfWeek && day.startTime < validatedDay.startTime && day.endTime > validatedDay.endTime){
                                throw(`Option${optNum} Day${dayNum}'s session runs through Day${validatedDay}'s session.`);
                            }else if(validatedDay.dayOfWeek == day.dayOfWeek && day.startTime > validatedDay.startTime && day.startTime < validatedDay.endTime){
                                throw(`Option${optNum} Day${dayNum}'s start time is in the middle of  Day${validatedDay}'s session.`);
                            }else if(validatedDay.dayOfWeek == day.dayOfWeek && day.endTime < validatedDay.endTime && day.endTime > validatedDay.startTime){
                                throw(`Option${optNum} Day${dayNum}'s end time is in the middle of  Day${validatedDay}'s session.`);
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