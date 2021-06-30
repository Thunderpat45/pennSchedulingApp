import {events} from "../events"
/*
actions: checks for conflicts/errors in workingModels submitted for database posts

publishes: 
    workingModel validations

subscribes to:
    teamRequest validation requests
*/

const validator = (function(){

    // get size/day/time ranges from scheduleObj for outOfRange function tests

    events.subscribe("validateTeamRequest", validateAllInputs);

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
        let message;
        if(nameRegex.test(name)){
            message = "Team names can only include letters and numbers (no spaces or symbols).";
            array.push(message);
        }else if(name == ""){
            message = "Team name must have a value.";
            array.push(message);
        }
    }

    function validateSize(workingModel,array){ //somewhere about out of range values
        const size = workingModel.teamSize;
        let message
        if(size == "default"){
            message = "Team size must have a value.";
            array.push(message);
        }
    }

    function validateSchedulePreferences(workingModel,array){ //somewhere about early/late (6am, 8pm) selections that might get errored out by changes in open/close time
        let message;
        workingModel.allOpts.forEach(function(option){
            const optNum = workingModel.allOpts.indexOf(option) + 1;
            const validatedDayArray = [];

            option.forEach(function(day){
                const dayNum = option.indexOf(day)+1;
                catchDefaultInputs();
                catchConflictingDays();

                function catchDefaultInputs(){
                    for(const prop in day){
                        if(prop == "default"){
                            message = `Option${optNum} Day${dayNum} ${prop} must have a value.`;
                            array.push(message);
                        }
                    }
                }

                function catchConflictingDays(){
                    validatedDayArray.forEach(function(validatedDay){
                        const validatedNum = validatedDayArray.indexOf(validatedDay);

                        if(validatedDay.dayOfWeek == day.dayOfWeek && validatedDay.startTime == day.startTime && validatedDay.inWeiss == day.inWeiss){
                            message = `Option${optNum} Day${validatedNum} and Day${dayNum} are duplicates.`;
                            array.push(message);
                        }else if(validatedDay.dayOfWeek == day.dayOfWeek && validatedDay.startTime > day.startTime && validatedDay.inWeiss < day.inWeiss){
                            message = `Option${optNum} Day${dayNum}'s end time is in the middle of  Day${validatedDay}'s session.`;
                            array.push(message);
                        }else if(validatedDay.dayOfWeek == day.dayOfWeek && validatedDay.startTime < day.startTime && validatedDay.inWeiss > day.inWeiss){
                            message = `Option${optNum} Day${dayNum}'s start time is in the middle of  Day${validatedDay}'s session.`;
                            array.push(message);
                        }else{
                            validatedDayArray.push(day)
                        }
                    })
                }
            })
        })
    }

})();

export{validator}