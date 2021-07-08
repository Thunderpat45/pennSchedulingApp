import { events } from "./events";

const scheduleBuilder = (function(){

    events.subscribe("SOMETHINGABOUTSCHEDULEDATALOADED", buildEmptyScheduleTemplate)
    
    function buildEmptyScheduleTemplate(scheduleData, coachPreferences){// do something about "reason", check this all for mutability issues for all functions here
        const scheduleTemplate = {}
        scheduleData.days.forEach(function(day){
            scheduleTemplate[day] = Object.assign({}, "SOMETHING");
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
                for(let timeRange in coach[day]){
                    if(time >= timeRange.start && time < timeRange.end){
                        availabilityObject[coach] = "no"
                    }else{
                        availabilityObject[coach] = "yes"
                    }
                }
        }
        return availabilityObject
    }
    
})();

/*function to build blank schedule object for each new team evaluation, for each day of week, 6am-8pm, with every 15m(we have 15 mins in our intervals for scheduling)
having x slots (available training spaces, an array to indicate each coach's availability, (accounting for requests in coachPreference Object),
 and an empty array to fill with teams that schedule in that block.
The reason for building a blank object each time was to ensure that previous attempts down a different tree line didn't "mark up" the schedule as filled
for teams that were no longer actually scheduled due to the recursion backtracking*/     

//edit formNew to be object with buildScheudleObject method, and slot as property

const scheduleObject = { //add conflict array, completeSchedules, longestStack arrays as properties
   

    buildTeamsSchedule: function buildTeamsSchedule(teamRequestArray){
        scheduleObject.completeSchedules = [];
        scheduleObject.conflictObj = {};
        scheduleObject.longestStack = [];
        this.checkAllTeams([], 0, teamRequestArray);
        if(scheduleObject.completeSchedules.length == 0){
            return [scheduleObject.longestStack, scheduleObject.conflictObj]
        }
        else{
            return [scheduleObject.completeSchedules, scheduleObject.conflictObj]
        }  
    },

    checkAllTeams: function checkAllTeams(cachedTeamStack, currentTeamIndex, teamRequestArray){
        const currentTeam = teamRequestArray[currentTeamIndex];
        this.checkCurrentTeam(currentTeam, cachedTeamStack, currentTeamIndex, teamRequestArray, 0);
    },

    checkCurrentTeam: function checkCurrentTeam(currentTeam, cachedTeamStack, currentTeamIndex, teamRequestArray, i){ // RESOLVE sched Pref is [[{}]], validOption is {[{}]}
        const currentRequest = currentTeam.schedulePreferences[i];
        const cachedTeamStackSlice = cachedTeamStack.slice[0];
        const schedObj = Object.assign({}, /*SCHEDULE OBJECT GENERATOR */);
        const validOption = {validDays:[]};

        if(this.checkCurrentTeamOptions(currentRequest, currentTeam, cachedTeamStackSlice, schedObj, validOption) == "conflict"){
            //report conflict!!
            checkCurrentTeam(currentTeam, cachedTeamStack, currentTeamIndex, teamRequestArray, i++);
        }

        cachedTeamStackSlice.push(validOption);
        this.trackLongestStack(cachedTeamStackSlice);
        this.checkStackCompletion(currentTeamIndex, teamRequestArray, cachedTeamStackSlice);

        if(scheduleObject.completeSchedules.length == 5){ //does this one go here?
            return [scheduleObject.completeSchedules, scheduleObject.conflictObj]
        }
        checkCurrentTeam(currentTeam, cachedTeamStack, currentTeamIndex, teamRequestArray, i++)
    },

    checkStackCompletion: function checkStackCompletion(currentTeamIndex, teamRequestArray, cachedTeamStackSlice){
        if(currentTeamIndex < teamRequestArray.length){
            this.checkAllTeams(cachedTeamStackSlice, currentTeamIndex++, teamRequestArray)
        }else{
            scheduleObject.completeSchedules.push(cachedTeamStackSlice)
        }
    },

    trackLongestStack: function trackLongestStack(cachedTeamStackSlice){
        if(cachedTeamStackSlice.length > scheduleObject.longestStack.length){
            scheduleObject.longestStack = cachedTeamStackSlice
        }
    },

    checkCurrentTeamOptions: function checkCurrentTeamOptions(currentRequest, currentTeam, cachedTeamStack, schedObj, validOption){
        this.insertAllCachedTeams(cachedTeamStack, schedObj);
        if(this.checkCurrentTeamDays(currentRequest, currentTeam, schedObj, validOption) == "conflict"){
            return "conflict" //more to this?
        }
    },

    //insert cache populates schedule with teams that have already submitted acceptable (to this point) requests
    insertAllCachedTeams: function insertAllCachedTeams(cachedTeamStack, schedObj){
        for(let i = 0; i< cachedTeamStack.length; i++){
            const cachedTeam = cachedTeamStack[i];
            this.insertCachedTeam(cachedTeam, schedObj)
        }
    },

    insertCachedTeam: function insertCachedTeam(cachedTeam, schedObj){
        const totalCachedDays = cachedTeam.schedulePreferences.length;
        for(let i = 0; i< totalCachedDays; i++){
            const cachedDay = cachedTeam[i];
            this.insertCachedDay(cachedDay, cachedTeam, schedObj)
        }
    },

    insertCachedDay: function insertCachedDay(cachedDay, cachedTeam, schedObj){ //recursion?
        const {dayOfWeek, startTime, endTime, inWeiss} = cachedDay;
        const {coach, size, name} = cachedTeam;
        for(let time = startTime; time < endTime; time +=15){
            schedObj[dayOfWeek][time].strengthCoachAvailability[coach] = "no"
            if(inWeiss == "yes"){
                schedObj[dayOfWeek][time].slots -= size;
                schedObj[dayOfWeek][time].existingTeams.push({name: name, coach:coach});
            }else{
                schedObj[dayOfWeek][time].existingTeams.push({name: name, coach:coach, location: "off-site"})
            }
        }
    },

    checkCurrentTeamDays: function checkCurrentTeamDays(currentRequest, currentTeam, schedObj, validOption){ //recursion?
        const currentRequestTotalDays = currentRequest.length;
        for(let i = 0; i < currentRequestTotalDays; i++){
            const currentDay = currentRequest[i];
            if(this.evaluateTimeBlock(currentDay, currentTeam, schedObj, validOption, 0) == "conflict"){
                return "conflict"
            }
        }
    },

    evaluateTimeBlock: function evaluateTimeBlock(currentDay, currentTeam, schedObj, validOption, i){
        const modifierArr = [0, -15, 15, -30, 30];
        const conflictArray = []
        const timeRequest = this.checkConflicts(modifierArr[i], currentDay, currentTeam, schedObj);
        if(i < modifierArr.length-1 && timeRequest != "undefined"){
            if(i == 0 || i == 3){
                conflictArray.push(timeRequest)
            }
            evaluateTimeBlock(currentDay, currentTeam, schedObj, validOption, i++)
        }else if(i == modifierArr.length-1 && timeRequest!= "undefined"){
            conflictArray.push(timeRequest)
            if(!this.conflictObj.hasProperty(currentTeam.name)){
                this.conflictObj[currentTeam.name] = {
                    [currentDay.dayOfWeek] : {
                        [currentDay.startTime]: []
                    }
                }    
            }else if(this.conflictObj.hasProperty(currentTeam.name)){
                if(!this.conflictObj[currentTeam.name].hasProperty([currentDay.dayOfWeek])){
                    this.conflictObj[currentTeam.name][currentDay.dayOfWeek] = {
                        [currentDay.startTime]: []
                    }
                }else if(!this.conflictObj[currentTeam.name][currentDay.dayOfWeek].hasProperty([currentDay.startTime])){
                    this.conflictObj[currentTeam.name][currentDay.dayOfWeek][currentDay.startTime] = [];
                }

            }
            this.conflictObj[currentTeam.name][currentDay.dayOfWeek][currentDay.startTime].push(conflictArray)
            return "conflict" 
        }else{
            const validDay = {day: currentDay};
            validDay.startTime += modifierArr[i];
            validDay.endTime += modifierArr[i];
            const {coach, name} = currentTeam;
            validOption.coach = coach;
            validOption.name = name;
            validOption.validDays.push(validDay);
        }
    },

    checkConflicts: function checkConflicts(modifier, currentDay, currentTeam, schedObj){ //recursion?
        const {coach, size} = currentTeam;
        const {dayOfWeek, startTime, endTime} = currentDay;
        for(let time = startTime + modifier; time < endTime + modifier; time += 15){
            try{
                const thisTimeExistingTeams = schedObj[dayOfWeek][time].existingTeams

                //if condition for changed start end times (if this time is not actually a valid time to schedule, then..., or should that be in validator)
                if(schedObj[dayOfWeek][time].strengthCoachAvailability[coach] == "no"){
                    const coachConflictArray = thisTimeExistingTeams
                        .slice()
                        .filter(function(team){
                            team.coach == coach;
                        })
                        .map(function(team){
                            team.name
                        })
                    throw({time: startTime, reason: "Coach not available", teams: coachConflictArray});
                }else if(schedObj[dayOfWeek][time].slots - size < 0){
                    const spaceConflictArray = thisTimeExistingTeams
                        .slice()
                        .map(function(team){
                        team.name
                        })
                    throw({time: startTime, reason: "Space not available", teams: spaceConflictArray})
                }
            }catch(conflict){ 
                return conflict;
            }
        }
            
    }
        
}
       
    



    
    
    
 
    

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
    
    