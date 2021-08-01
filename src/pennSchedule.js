/* eslint-disable no-prototype-builtins */

/*add pubsub */
import { events } from "./events";

const scheduleBuilder = (function(){

    events.subscribe("SOMETHINGABOUTSCHEDULEDATALOADED", buildEmptyScheduleTemplate)
    events.subscribe("BUILDMEASCHEDULE", buildTeamsSchedule)
    //team order array?

    const scheduleObject = {}
    const scheduleData = {} //fix this
    const coachPreferences = {} //fix this
    
    function buildEmptyScheduleTemplate(scheduleData, coachPreferences){//check all objects for mutability
        const scheduleTemplate = {}
        scheduleData.days.forEach(function(day){
            scheduleTemplate[day] = Object.assign({});
            buildTimeSlots(scheduleTemplate, scheduleData, day, coachPreferences)
        })
    }

    function buildTimeSlots(scheduleTemplate, scheduleData, day, coachPreferences){
        for(let time = scheduleData.openTime; time < scheduleData.closeTime; time +=15){
            scheduleTemplate[day][time] = { 
                slots: scheduleData.slots[1], //this may change to single value?
                strengthCoachAvailability: setStrengthCoachAvailability(time, day, coachPreferences),
                existingTeams:[]
            }
        }
    }

    function setStrengthCoachAvailability(time, day, coachPreferences){
        const availabilityObject = {}
        for(let coach in coachPreferences){
            availabilityObject[coach] = "yes"
            const thisDayPreferences = coachPreferences[coach][day]
                for(let i = 0; i < thisDayPreferences.length; i++){
                    if(time >= thisDayPreferences[i].start && time < thisDayPreferences[i].end){
                        availabilityObject[coach] = "no"
                    }
                }
        }
        return availabilityObject
    }
    

    function buildTeamsSchedule(teamRequestArray){
        scheduleObject.completeSchedules = [];
        scheduleObject.conflictObj = {};
        scheduleObject.longestStack = [];
        checkAllTeams([], 0, teamRequestArray);
        if(scheduleObject.completeSchedules.length == 0){
            return [scheduleObject.longestStack, scheduleObject.conflictObj]
        }
        else if(scheduleObject.completeSchedules.length < 5){
            return [scheduleObject.completeSchedules, scheduleObject.conflictObj]
        }
        else{
            return [scheduleObject.completeSchedules.slice(0,5), scheduleObject.conflictObj]
        }  
    }

    function checkAllTeams(cachedTeamStack, currentTeamIndex, teamRequestArray){
        const currentTeam = teamRequestArray[currentTeamIndex];
        checkCurrentTeam(currentTeam, cachedTeamStack, currentTeamIndex, teamRequestArray, 0);
    }

    function checkCurrentTeam(currentTeam, cachedTeamStack, currentTeamIndex, teamRequestArray, i){ 
        const currentRequest = currentTeam.allOpts[i];
        const cachedTeamStackSlice = cachedTeamStack.slice();
        const schedObj = buildEmptyScheduleTemplate(scheduleData, coachPreferences); //fix these params to accept DB load input
        const validOption = {validDays:[], coach: currentTeam.coach, name: currentTeam.name, size: currentTeam.size};

       
        if(checkCurrentTeamOptions(currentRequest, currentTeam, cachedTeamStackSlice, schedObj, validOption) != "conflict"){
            cachedTeamStackSlice.push(currentTeam.validOption);
            trackLongestStack(cachedTeamStackSlice);
            checkStackCompletion(currentTeamIndex, teamRequestArray, cachedTeamStackSlice);
        }

        if(i == currentTeam.allOpts.length){
            return
        }else{
            checkCurrentTeam(currentTeam, cachedTeamStack, currentTeamIndex, teamRequestArray, ++i);
        }
    }

    function checkStackCompletion(currentTeamIndex, teamRequestArray, cachedTeamStackSlice){
        if(currentTeamIndex < teamRequestArray.length-1){
            checkAllTeams(cachedTeamStackSlice, ++currentTeamIndex, teamRequestArray)
        }else{
            scheduleObject.completeSchedules.push(cachedTeamStackSlice)
        }
    }

    function trackLongestStack(cachedTeamStackSlice){
        if(cachedTeamStackSlice.length > scheduleObject.longestStack.length){
            scheduleObject.longestStack = cachedTeamStackSlice
        }
    }

    function checkCurrentTeamOptions(currentRequest, currentTeam, cachedTeamStack, schedObj, validOption){
        currentTeam.validOption = Object.assign({}, validOption);
        currentTeam.validOption.validDays = validOption.validDays.slice();
        const doubleConflictArray = [] //fix this name
        insertAllCachedTeams(cachedTeamStack, schedObj);
        try{
            checkCurrentTeamDays(currentRequest, currentTeam, schedObj, 0, doubleConflictArray)
        }catch(conflict){
            return "conflict"
        }
    }

    
    function insertAllCachedTeams(cachedTeamStack, schedObj){
        for(let i = 0; i< cachedTeamStack.length; i++){
            const cachedTeam = cachedTeamStack[i];
            insertCachedTeam(cachedTeam, schedObj)
        }
    }

    function insertCachedTeam(cachedTeam, schedObj){
        const totalCachedDays = cachedTeam.validDays.length;
        for(let i = 0; i< totalCachedDays; i++){
            const cachedDay = cachedTeam.validDays[i];
            insertCachedDay(cachedDay, cachedTeam, schedObj)
        }
    }

    function insertCachedDay(cachedDay, cachedTeam, schedObj){ 
        const {dayOfWeek, startTime, endTime, inWeiss} = cachedDay;
        const {coach, size, name} = cachedTeam;
        for(let time = startTime; time < endTime; time +=15){
            schedObj[dayOfWeek][time].strengthCoachAvailability[coach] = "no"
            if(inWeiss == "yes"){
                schedObj[dayOfWeek][time].slots -= size;
                schedObj[dayOfWeek][time].existingTeams.push({name, coach, size});
            }else{
                schedObj[dayOfWeek][time].existingTeams.push({name, coach, location: "off-site"})
            }
        }
    }

    function checkCurrentTeamDays(currentRequest, currentTeam, schedObj, i, doubleConflictArray){
        const currentRequestTotalDays = currentRequest.length;
        const currentDay = currentRequest[i];
        const conflictArray = []
        try{
            evaluateTimeBlock(conflictArray, currentDay, currentTeam, schedObj, 0)
        }catch(conflict){
            doubleConflictArray.push(conflict)
        }
        if(i < currentRequestTotalDays-1){
            checkCurrentTeamDays(currentRequest, currentTeam, schedObj, ++i, doubleConflictArray)
        }else if(i == currentRequestTotalDays-1 && doubleConflictArray.length != 0){
            throw("conflict")
        }
        
    }

    function evaluateTimeBlock(currentDay, currentTeam, schedObj, i){
        const modifierArr = [0, -15, 15, -30, 30];
        const conflictArray = []
        const timeRequest = checkConflicts(modifierArr[i], currentDay, currentTeam, schedObj);
        if(i < modifierArr.length-1 && timeRequest != undefined){
            if(i == 0 || i == 3){
                conflictArray.push(timeRequest)
            }
            evaluateTimeBlock(currentDay, currentTeam, schedObj, ++i)
        }else if(i == modifierArr.length-1 && timeRequest!= undefined){
            conflictArray.push(timeRequest)
            if(!scheduleObject.conflictObj.hasOwnProperty(currentTeam.name)){
                scheduleObject.conflictObj[currentTeam.name] = {
                    [currentDay.dayOfWeek] : {
                        [currentDay.startTime]: []
                    }
                }    
            }else if(!scheduleObject.conflictObj[currentTeam.name].hasOwnProperty([currentDay.dayOfWeek])){
                scheduleObject.conflictObj[currentTeam.name][currentDay.dayOfWeek] = {
                    [currentDay.startTime]: []
                }   
            }else if(!scheduleObject.conflictObj[currentTeam.name][currentDay.dayOfWeek].hasOwnProperty([currentDay.startTime])){
                scheduleObject.conflictObj[currentTeam.name][currentDay.dayOfWeek][currentDay.startTime] = [];
            }
            if(scheduleObject.conflictObj[currentTeam.name][currentDay.dayOfWeek][currentDay.startTime].length == 0){
                scheduleObject.conflictObj[currentTeam.name][currentDay.dayOfWeek][currentDay.startTime].push(conflictArray)
            }
            throw "conflict" 
        }else{
            const validDay = Object.assign({}, currentDay);
            validDay.startTime += modifierArr[i];
            validDay.endTime += modifierArr[i];
            currentTeam.validOption.validDays.push(validDay);
        }
    }

    function checkConflicts(modifier, currentDay, currentTeam, schedObj){ 
        const {coach, size} = currentTeam;
        const {dayOfWeek, startTime, endTime} = currentDay;
        for(let time = startTime + modifier; time < endTime + modifier; time += 15){
            try{
                if(schedObj[dayOfWeek][time] == undefined){
                    throw({time: startTime + modifier, reason:"Potential uncaught operating hours change. Part of session time outside operating hours."})
                }else{
                    const thisTimeExistingTeams = schedObj[dayOfWeek][time].existingTeams;
                    if(schedObj[dayOfWeek][time].strengthCoachAvailability[coach] == "no"){
                        const coachConflictArray = thisTimeExistingTeams
                            .slice()
                            .filter(function(team){
                                return team.coach == coach;
                            })
                            .map(function(team){
                                return team.name
                            })
                        throw({time: startTime + modifier, reason: "Coach not available", teams: coachConflictArray});
                    }else if(schedObj[dayOfWeek][time].slots - size < 0){
                        const spaceConflictArray = thisTimeExistingTeams
                            .slice()
                            .map(function(team){
                                return team.name
                            })
                        throw({time: startTime + modifier, reason: "Space not available", teams: spaceConflictArray})
                    }
                }
            }catch(conflict){ 
                return conflict;
            }
        }
            
    }
        
})()
       
    



    
    
    
 
    

    /*sample schedule object built from previous attempt in F2019, 
    with subObject by team name, and listing name, coach, rank, team size (relative to slots), and schedule preferences
    schedulePreferences per day arrayFormat = [team, dayOfWeek, start, stop, inWeightRoom, BBnecessary]*/

    const teamObject = {
        football:{
            name: "football",
            coach:"Rivera",
            rank:1,
            size: 3,
            schedulePreferences:
                [
                    [
                        ["football","Tue", 870, 915, "yes", "yes"],
                        ["football","Thu", 870, 915, "yes", "yes"],
                        ["football","Fri", 945, 975, "yes", "yes"]
                    ],

                   /* [
                        ["football","Mon", 1300, 840,"yes", "yes"],
                        ["football","Wed", 1300, 840,"yes", "yes"]

                    ]*/
                ]
            
        
        
        },
    
        basketballWomen:{
            name:"basketballWomen",
            coach: "Brindle",
            rank:6,
            size: 1,
            schedulePreferences:
                
                [
                    [
                        ["basketballWomen","Tue", 420, 495,"yes", "yes"],
                        ["basketballWomen","Thu", 420, 495,"yes", "yes"],
                        ["basketballWomen","Fri", 420, 495,"yes", "yes"],
                    ],

                    /*[
                        ["basketballWomen","Mon", 840, 900,"yes", "yes"],
                        ["basketballWomen","Wed", 840, 900,"yes", "yes"],
                    ],*/
                ]
        },
        
        basketballMen:{
            name:"basketballMen",
            coach: "Brindle",
            rank:5,
            size: 1,
            schedulePreferences:
            
                [
                    [
                        ["basketballMen","Tue", 930, 990,"yes", "yes"],
                        ["basketballMen","Thu", 915, 975,"yes", "yes"],
                        ["basketballMen","Fri", 870, 930,"yes", "yes"],
                    ],

                    /*[
                        ["basketballMen","Mon", 900, 960,"yes", "yes"],
                        ["basketballMen","Wed", 960, 1020,"yes", "yes"],
                    ],*/
                ]
        },

        sprintFootball:{
            name:"sprintFootball",
            coach: "Dolan",
            rank:15,
            size: 2,
            schedulePreferences:
            
                [
                    [
                        ["sprintFootball","Tue", 960, 1020,"yes", "yes"],
                        ["sprintFootball","Sat", 540, 600,"yes", "yes"],
                    ],

                    /*[
                        ["sprintFootball","Mon", 900, 960,"yes", "yes"],
                        ["sprintFootball","Wed", 960, 1020,"yes", "yes"],
                    ],*/
                ]
        },

        fieldHockey:{
            name:"fieldHockey",
            coach: "Walts",
            rank:14,
            size: 2,
            schedulePreferences:
            
                [
                    [
                        ["fieldHockey","Mon", 555, 615,"yes", "yes"],
                        ["fieldHockey","Wed", 555, 615,"yes", "yes"],
                        ["fieldHockey","Fri", 555, 615,"yes", "yes"],
                    ],

                    /*[
                        ["sprintFootball","Mon", 900, 960,"yes", "yes"],
                        ["sprintFootball","Wed", 960, 1020,"yes", "yes"],
                    ],*/
                ]
        },

        soccerMen:{
            name:"soccerMen",
            coach: "Brindle",
            rank:17,
            size: 1,
            schedulePreferences:
            
                [
                    [
                        ["soccerMen","Tue", 1035, 1095,"yes", "yes"],
                        ["soccerMen","Thu", 1035, 1095,"yes", "yes"],
                    ],

                    /*[
                        ["sprintFootball","Mon", 900, 960,"yes", "yes"],
                        ["sprintFootball","Wed", 960, 1020,"yes", "yes"],
                    ],*/
                ]
        },

        soccerWomen:{
            name:"soccerWomen",
            coach: "Pifer",
            rank:18,
            size: 1,
            schedulePreferences:
            
                [
                    [
                        ["soccerWomen","Tue", 360, 420,"yes", "yes"],
                        ["soccerWomen","Thu", 360, 420,"yes", "yes"],
                    ],
                ]
        },

        volleyball:{
            name:"volleyball",
            coach: "Weeks",
            rank:19,
            size: 1,
            schedulePreferences:
            
                [
                    [
                        ["volleyball","Mon", 450, 510,"yes", "yes"],
                        ["volleyball","Wed", 450, 510,"yes", "yes"],
                    ],

                    [
                        ["volleyball","Mon", 480, 540,"yes", "yes"],
                        ["volleyball","Wed", 450, 510,"yes", "yes"],
                    ],
                    
                    [
                        ["volleyball","Mon", 420, 480,"yes", "yes"],
                        ["volleyball","Wed", 450, 510,"yes", "yes"],
                    ],

                    [
                        ["volleyball","Mon", 450, 510,"yes", "yes"],
                        ["volleyball","Wed", 480, 540,"yes", "yes"],
                    ],

                    [
                        ["volleyball","Mon", 450, 510,"yes", "yes"],
                        ["volleyball","Wed", 420, 480,"yes", "yes"],
                    ],
                    
                    [
                        ["volleyball","Mon", 480, 540,"yes", "yes"],
                        ["volleyball","Wed", 480, 540,"yes", "yes"],
                    ],

                    [
                        ["volleyball","Mon", 420, 480,"yes", "yes"],
                        ["volleyball","Wed", 420, 480,"yes", "yes"],
                    ],
                      
                ]
        },

        crossCountry:{
            name:"crossCountry",
            coach: "Pifer",
            rank:4,
            size: 2,
            schedulePreferences:
            
                [
                    [
                        ["crossCountry","Mon", 1020, 1050,"yes", "yes"],
                        ["crossCountry","Wed", 1020, 1050,"yes", "yes"],
                    ],
                ]
        },

        wrestling:{
            name:"wrestling",
            coach: "Weeks",
            rank:9,
            size: 2,
            schedulePreferences:
            
                [
                    [
                        ["wrestling","Mon", 420, 480,"yes", "yes"],
                        ["wrestling","Wed", 960, 1020,"yes", "yes"],
                        ["wrestling","Sat", 540, 600,"yes", "yes"]
                    ],

                    [
                        ["wrestling","Mon", 420, 480,"yes", "yes"],
                        ["wrestling","Wed", 1020, 1080,"yes", "yes"],
                        ["wrestling","Sat", 540, 600,"yes", "yes"]
                    ],

                    [
                        ["wrestling","Mon", 420, 480,"yes", "yes"],
                        ["wrestling","Wed", 960, 1020,"yes", "yes"],
                        ["wrestling","Sat", 600, 660,"yes", "yes"]
                    ],

                    [
                        ["wrestling","Mon", 450, 510,"yes", "yes"],
                        ["wrestling","Wed", 960, 1020,"yes", "yes"],
                        ["wrestling","Sat", 540, 600,"yes", "yes"]
                    ],

                    [
                        ["wrestling","Mon", 420, 480,"yes", "yes"],
                        ["wrestling","Wed", 1020, 1080,"yes", "yes"],
                        ["wrestling","Sat", 600, 660,"yes", "yes"]
                    ],

                    [
                        ["wrestling","Mon", 450, 510,"yes", "yes"],
                        ["wrestling","Wed", 1020, 1080,"yes", "yes"],
                        ["wrestling","Sat", 540, 600,"yes", "yes"]
                    ],

                    [
                        ["wrestling","Mon", 450, 510,"yes", "yes"],
                        ["wrestling","Wed", 960, 1020,"yes", "yes"],
                        ["wrestling","Sat", 600, 660,"yes", "yes"]
                    ],

                    [
                        ["wrestling","Mon", 450, 510,"yes", "yes"],
                        ["wrestling","Wed", 1020, 1080,"yes", "yes"],
                        ["wrestling","Sat", 600, 660,"yes", "yes"]
                    ],

                ]
        },

        swimDive:{
            name:"swimDive",
            coach: "Rivera",
            rank:8,
            size: 3,
            schedulePreferences:
            
                [
                    [
                        ["swimDive","Mon", 480, 540,"yes", "yes"],
                        ["swimDive","Wed", 480, 540,"yes", "yes"],
                        ["swimDive","Fri", 480, 540,"yes", "yes"],
                    ],
                ]
        },

        trackFieldPifer:{
            name:"trackFieldPifer",
            coach: "Pifer",
            rank:2,
            size: 2,
            schedulePreferences:
            
                [
                    [
                        ["trackFieldPifer","Mon", 1050, 1110,"yes", "yes"],
                        ["trackFieldPifer","Wed", 1050, 1110,"yes", "yes"],
                        ["trackFieldPifer","Fri", 1050, 1110,"yes", "yes"],
                    ],
                ]
        },

        trackFieldDolan:{
            name:"trackFieldDolan",
            coach: "Dolan",
            rank:3,
            size: 2,
            schedulePreferences:
            
                [
                    [
                        ["trackFieldDolan","Mon", 1050, 1110,"yes", "yes"],
                        ["trackFieldDolan","Wed", 1050, 1110,"yes", "yes"],
                        ["trackFieldDolan","Fri", 1050, 1110,"yes", "yes"],
                    ],
                ]
        },

        lacrosseMen:{
            name:"lacrosseMen",
            coach: "Walts",
            rank:7,
            size: 3,
            schedulePreferences:
            
                [
                    [
                        ["lacrosseMen","Mon", 960, 1020,"yes", "yes"],
                        ["lacrosseMen","Wed", 915, 975,"yes", "yes"],
                        ["lacrosseMen","Fri", 960, 1020,"yes", "yes"],
                    ],
                ]
        },

        lacrosseWomen:{
            name:"lacrosseWomen",
            coach: "Walts",
            rank:16,
            size: 2,
            schedulePreferences:
            
                [
                    [
                        ["lacrosseWomen","Tue", 450, 510,"yes", "yes"],
                        ["lacrosseWomen","Fri", 480, 540,"yes", "yes"],
                    ],
                ]
        },

        baseball:{
            name:"baseball",
            coach: "Weeks",
            rank:10,
            size: 2,
            schedulePreferences:
            
                [
                    [
                        ["baseball","Tue", 420, 480,"yes", "yes"],
                        ["baseball","Thu", 960, 1020,"yes", "yes"],
                        ["baseball","Sat", 840, 900,"yes", "yes"],
                    ],
                ]
        },

        softball:{
            name:"softball",
            coach: "Weeks",
            rank:20,
            size: 2,
            schedulePreferences:
            
                [
                    [
                        ["softball","Tue", 840, 900,"yes", "yes"],
                        ["softball","Thu", 840, 900,"yes", "yes"],
                    ],
                ]
        },

        golfMen:{
            name:"golfMen",
            coach: "Walts",
            rank:27,
            size: 1,
            schedulePreferences:
            
                [
                    [
                        ["golfMen","Tue", 360, 420,"yes", "yes"],
                        ["golfMen","Thu", 360, 420,"yes", "yes"],
                    ],
                ]
        },

        golfWomen:{
            name:"golfWomen",
            coach: "Walts",
            rank:28,
            size: 1,
            schedulePreferences:
            
                [
                    [
                        ["golfWomen","Tue", 420, 480,"yes", "yes"],
                        ["golfWomen","Thu", 420, 480,"yes", "yes"],
                    ],

                    [
                        ["golfWomen","Mon", 420, 480,"yes", "yes"],
                        ["golfWomen","Wed", 420, 480,"yes", "yes"],
                    ],
                ]
        },

        tennisMen:{
            name:"tennisMen",
            coach: "Pifer",
            rank:25,
            size: 1,
            schedulePreferences:
            
                [
                    [
                        ["tennisMen","Tue", 975, 1020,"yes", "yes"],
                        ["tennisMen","Thu", 975, 1020,"yes", "yes"],
                    ],
                ]
        },

        tennisWomen:{
            name:"tennisWomen",
            coach: "Pifer",
            rank:26,
            size: 1,
            schedulePreferences:
            
                [
                    [
                        ["tennisWomen","Tue", 975, 1020,"yes", "yes"],
                        ["tennisWomen","Thu", 975, 1020,"yes", "yes"],
                    ],

                    [
                        ["tennisWomen","Mon", 975, 1020,"yes", "yes"],
                        ["tennisWomen","Wed", 975, 1020,"yes", "yes"],
                    ],
                ]
        },

        lightweightCrewMen:{
            name:"lightweightCrewMen",
            coach: "Dolan",
            rank:11,
            size: 2,
            schedulePreferences:
            
                [
                    [
                        ["lightweightCrewMen","Tue", 1020, 1080,"yes", "yes"],
                        ["lightweightCrewMen","Sat", 690, 750,"yes", "yes"],
                    ],

                    [
                        ["lightweightCrewMen","Tue", 990, 1050,"yes", "yes"],
                        ["lightweightCrewMen","Sat", 690, 750,"yes", "yes"],
                    ],

                    [
                        ["lightweightCrewMen","Tue", 1050, 1110,"yes", "yes"],
                        ["lightweightCrewMen","Sat", 690, 750,"yes", "yes"],
                    ],

                    
                ]
        },

        crewWomen:{
            name:"crewWomen",
            coach: "Dolan",
            rank:12,
            size: 2,
            schedulePreferences:
            
                [
                    [
                        ["crewWomen","Mon", 390, 435,"yes", "yes"],
                        ["crewWomen","Tue", 390, 435,"yes", "yes"],
                        ["crewWomen","Thu", 390, 435,"yes", "yes"],
                        ["crewWomen","Fri", 390, 435,"yes", "yes"],
                    ],

                    [
                        ["crewWomen","Mon", 960, 1005,"yes", "yes"],
                        ["crewWomen","Tue", 960, 1005,"yes", "yes"],
                        ["crewWomen","Thu", 960, 1005,"yes", "yes"],
                        ["crewWomen","Fri", 390, 435,"yes", "yes"],
                    ],
                    
                ]
        },
        
        heavyweightCrewMen:{
            name:"heavyweightCrewMen",
            coach: "Dolan",
            rank:13,
            size: 2,
            schedulePreferences:
            
                [
                    [
                        ["heavyweightCrewMen","Mon", 480, 540,"yes", "yes"],
                        ["heavyweightCrewMen","Wed", 480, 540,"yes", "yes"],
                    ],
                    
                ]
        },

        cheerleading:{
            name:"cheerleading",
            coach: "Pifer",
            rank:29,
            size: 1,
            schedulePreferences:
            
                [
                    [
                        ["cheerleading","Mon", 960, 1020,"yes", "yes"],
                        ["cheerleading","Thu", 1020, 1080,"yes", "yes"],
                    ],

                    [
                        ["cheerleading","Mon", 1020, 1080,"yes", "yes"],
                        ["cheerleading","Thu", 1020, 1080,"yes", "yes"],
                    ],

                    [
                        ["cheerleading","Mon", 1080, 1140,"yes", "yes"],
                        ["cheerleading","Thu", 1080, 1140,"yes", "yes"],
                    ],
                    
                ]
        },

        fencing:{
            name:"fencing",
            coach: "Pifer",
            rank:23,
            size: 1,
            schedulePreferences:
            
                [
                    [
                        ["fencing","Mon", 1020, 1080,"yes", "yes"],
                        ["fencing","Wed", 1020, 1080,"yes", "yes"],
                    ],

                    [
                        ["fencing","Tue", 1020, 1080,"yes", "yes"],
                        ["fencing","Thu", 1020, 1080,"yes", "yes"],
                    ],

                    [
                        ["fencing","Mon", 960, 1020,"yes", "yes"],
                        ["fencing","Wed", 960, 1020,"yes", "yes"],
                    ],

                    [
                        ["fencing","Tue", 960, 1020,"yes", "yes"],
                        ["fencing","Thu", 960, 1020,"yes", "yes"],
                    ],
                    
                ]
        },

        gymnastics:{
            name:"gymnastics",
            coach: "Dolan",
            rank:24,
            size: 1,
            schedulePreferences:
            
                [
                    [
                        ["gymnastics","Thu", 1020, 1080,"yes", "yes"],
                        
                    ],
                    
                ]
        },

        squashMen:{
            name:"squashMen",
            coach: "Weeks",
            rank:21,
            size: 1,
            schedulePreferences:
            
                [
                    [
                        ["squashMen","Tue", 450, 510,"yes", "yes"],
                        ["squashMen","Thu", 450, 510,"yes", "yes"],    
                    ],
                    
                ]
        },

        squashWomen:{
            name:"squashWomen",
            coach: "Pifer",
            rank:22,
            size: 1,
            schedulePreferences:
            
                [
                    [
                        ["squashWomen","Tue", 450, 510,"yes", "yes"],
                        ["squashWomen","Thu", 450, 510,"yes", "yes"],    
                    ],
                ]
        },

        

        
     
    }
    
    