

const buildEmptyScheduleTemplate = require('./blankScheduleTemplateBuilder').buildEmptyScheduleTemplate

let scheduleTemplateData

const masterScheduleBuilder = (function(){
    const masterScheduleObject = {}
    
    function buildTeamsSchedule(allTeams, templateData){
        scheduleTemplateData = templateData
        masterScheduleObject.completeSchedules = [];
        masterScheduleObject.conflictObj = {};
        masterScheduleObject.longestStack = [];
        checkAllTeams([], allTeams, 0);

        if(masterScheduleObject.completeSchedules.length == 0){
            return {longestStack: masterScheduleObject.longestStack, conflicts: masterScheduleObject.conflictObj}
        }
        else if(masterScheduleObject.completeSchedules.length < 5){
            return {completedSchedules: masterScheduleObject.completeSchedules, conflicts: masterScheduleObject.conflictObj}
        }
        else{
            return {completedSchedules: masterScheduleObject.completeSchedules.slice(0,5), conflicts:masterScheduleObject.conflictObj}
        }  
    }

    function checkAllTeams(cachedTeamStack, allTeams, currentTeamIndex){
        console.log(allTeams);
        console.log(currentTeamIndex)
        const currentTeam = allTeams[currentTeamIndex];
        console.log(currentTeam)
        checkCurrentTeam(currentTeam, currentTeamIndex, cachedTeamStack, allTeams, 0);
    }

    function checkCurrentTeam(currentTeam, currentTeamIndex,  cachedTeamStack, allTeams, requestIndex){ 
        const {name, size} = currentTeam;
        const coach = currentTeam.coach.name
        const validOption = {validDays:[], coach, name, size};

        const scheduleTemplate = buildEmptyScheduleTemplate(scheduleTemplateData);
        const currentRequest = currentTeam.allOpts[requestIndex];
        const cachedTeamStackSlice = cachedTeamStack.slice();
       
        if(checkCurrentTeamOptions(currentRequest, currentTeam, cachedTeamStackSlice, scheduleTemplate, validOption) != "conflict"){
            cachedTeamStackSlice.push(currentTeam.validOption);
            trackLongestStack(cachedTeamStackSlice);
            checkStackCompletion(currentTeamIndex, allTeams, cachedTeamStackSlice);
        }

        if(requestIndex == currentTeam.allOpts.length){
            return
        }else{
            checkCurrentTeam(currentTeam, currentTeamIndex, cachedTeamStack, allTeams, ++requestIndex);
        }
    }

    function trackLongestStack(cachedTeamStackSlice){
        if(cachedTeamStackSlice.length > masterScheduleObject.longestStack.length){
            masterScheduleObject.longestStack = cachedTeamStackSlice
        }
    }

    function checkStackCompletion(currentTeamIndex, allTeams, cachedTeamStackSlice){
        if(currentTeamIndex < allTeams.length-1){
            checkAllTeams(cachedTeamStackSlice, allTeams, ++currentTeamIndex)
        }else{
            masterScheduleObject.completeSchedules.push(cachedTeamStackSlice)
        }
    }

    function checkCurrentTeamOptions(currentRequest, currentTeam, cachedTeamStack, scheduleTemplate, validOption){
        currentTeam.validOption = structuredClone(validOption);
        const completeConflict = [] //fix this name
        insertAllCachedTeams(cachedTeamStack, scheduleTemplate);
        try{
            checkCurrentTeamDays(currentRequest, currentTeam, scheduleTemplate, 0, completeConflict)
        }catch(conflict){
            return "conflict"
        }
    }

    
    function insertAllCachedTeams(cachedTeamStack, scheduleTemplate){
        cachedTeamStack.forEach(function(cachedTeam){
            const totalCachedDays = cachedTeam.validDays;
            totalCachedDays.forEach(function(cachedDay){
                insertCachedDay(cachedDay, cachedTeam, scheduleTemplate)
            })
            
        })
    }

    function insertCachedDay(cachedDay, cachedTeam, scheduleTemplate){ 
        const {dayOfWeek, startTime, endTime, inWeiss} = cachedDay;
        const {size, name} = cachedTeam;
        const coach = cachedTeam.coach.name
        for(let time = startTime; time < endTime; time +=15){
            scheduleTemplate[dayOfWeek][time].strengthCoachAvailability[coach] = "no"
            if(inWeiss == "yes"){
                scheduleTemplate[dayOfWeek][time].slots -= size;
                scheduleTemplate[dayOfWeek][time].existingTeams.push({name, coach, size}); //more content here?
            }else{
                scheduleTemplate[dayOfWeek][time].existingTeams.push({name, coach, location: "off-site"})
            }
        }
    }

    function checkCurrentTeamDays(currentRequest, currentTeam, scheduleTemplate, currentDayIndex , completeConflict){
        const currentRequestTotalDays = currentRequest.length;
        const currentDay = currentRequest[currentDayIndex];

        try{
            evaluateTimeBlock(currentDay, currentTeam, scheduleTemplate, 0)
        }catch(conflict){
            completeConflict.push(conflict)
        }
        
        if(currentDayIndex < currentRequestTotalDays-1){
            checkCurrentTeamDays(currentRequest, currentTeam, scheduleTemplate, ++currentDayIndex, completeConflict)
        }else if(currentDayIndex == currentRequestTotalDays-1 && completeConflict.length != 0){
            throw("conflict")
        }
        
    }

    function evaluateTimeBlock(currentDay, currentTeam, scheduleTemplate, i){
        const modifierArr = [0, -15, 15, -30, 30];
        const subConflicts = []

        const timeRequest = checkConflicts(modifierArr[i], currentDay, currentTeam, scheduleTemplate);

        if(i < modifierArr.length-1 && timeRequest != undefined){
            if(i == 0 || i == 3){
                subConflicts.push(timeRequest)
            }
            evaluateTimeBlock(currentDay, currentTeam, scheduleTemplate, ++i)

        }else if(i == modifierArr.length-1 && timeRequest!= undefined){
            subConflicts.push(timeRequest)

            if(!masterScheduleObject.conflictObj.hasOwnProperty(currentTeam.name)){
                masterScheduleObject.conflictObj[currentTeam.name] = {
                    [currentDay.dayOfWeek] : {
                        [currentDay.startTime]: []
                    }
                }    
            }else if(!masterScheduleObject.conflictObj[currentTeam.name].hasOwnProperty([currentDay.dayOfWeek])){
                masterScheduleObject.conflictObj[currentTeam.name][currentDay.dayOfWeek] = {
                    [currentDay.startTime]: []
                }   
            }else if(!masterScheduleObject.conflictObj[currentTeam.name][currentDay.dayOfWeek].hasOwnProperty([currentDay.startTime])){
                masterScheduleObject.conflictObj[currentTeam.name][currentDay.dayOfWeek][currentDay.startTime] = [];
            }
            if(masterScheduleObject.conflictObj[currentTeam.name][currentDay.dayOfWeek][currentDay.startTime].length == 0){
                masterScheduleObject.conflictObj[currentTeam.name][currentDay.dayOfWeek][currentDay.startTime].push(subConflicts)
            }
            throw "conflict" 

        }else{
            const validDay = structuredClone(currentDay);
            validDay.startTime += modifierArr[i];
            validDay.endTime += modifierArr[i];
            currentTeam.validOption.validDays.push(validDay);
        }
    }

    function checkConflicts(modifier, currentDay, currentTeam, scheduleTemplate){ 
        const {size} = currentTeam;
        const coach = currentTeam.coach.name
        const {dayOfWeek, startTime, endTime} = currentDay;
        for(let time = startTime + modifier; time < endTime + modifier; time += 15){
            try{
                if(scheduleTemplate[dayOfWeek][time] == undefined){
                    throw({time: startTime + modifier, reason:"Potential uncaught operating hours change. Part of session time outside operating hours."})
                }else{
                    const thisTimeExistingTeams = scheduleTemplate[dayOfWeek][time].existingTeams;
                    if(scheduleTemplate[dayOfWeek][time].strengthCoachAvailability[coach] == "no"){
                        const coachsubConflicts = thisTimeExistingTeams
                            .slice()
                            .filter(function(team){
                                return team.coach == coach;
                            })
                            .map(function(team){
                                return team.name
                            })
                        throw({time: startTime + modifier, reason: "Coach not available", teams: coachsubConflicts});
                    }else if(scheduleTemplate[dayOfWeek][time].slots - size < 0){
                        const spacesubConflicts = thisTimeExistingTeams
                            .slice()
                            .map(function(team){
                                return team.name
                            })
                        throw({time: startTime + modifier, reason: "Space not available", teams: spacesubConflicts})
                    }
                }
            }catch(conflict){ 
                return conflict;
            }
        }
            
    }

    return {buildTeamsSchedule:buildTeamsSchedule}
        
})()

module.exports = {buildTeamsSchedule: masterScheduleBuilder.buildTeamsSchedule}
