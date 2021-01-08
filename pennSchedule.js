
//convert militaryTime to time in totalMinutes, defunct?
function convertTime(start, end){
    let startEndArray = []
    function convertMinuteTime(hourTime){
        let totalMinutes =
        (Number(hourTime.slice(0,2)*60)) + Number(hourTime.slice(-2));
        return totalMinutes;
    };
    startEndArray.push(convertMinuteTime(start));
    startEndArray.push(convertMinuteTime(end));
    return startEndArray
}
    
//sorts the scheduling preferences of all teams in teamObject into teamOrderArray by their assigned "rank"
const teamOrderArray = []

function populateteamOrderArray(){
    for(const team in teamObject){
        let name = teamObject[team]
        teamOrderArray[name.rank-1] = name.schedulePreferences;

    }
}
    
/*evaluates all possible scheduling combinations for conflicts by coachAvailablity and spaceAvailabity, and returns up to 5 full optimized schedules,
 or, if no full schedule works with the options provided, returns the longest stack that was built during the attempt*/
function modifiedCartesian(...teamRequestArray) {
    
    /*variables for optimized schedule; longest stack built; any non-viable training day requests,
    and the total amount of teams in the list, respectively*/
    const completeSchedules = [];
    let longestStack = [];
    const conflictArray = []
    const totalTeamRequests = teamRequestArray.length-1;
 
    /*function accepting parameters of current scheduling stack to this point, and the index of current team (from teamRequestArray parameter) 
    being evaluated for availability, with variables for the currentTeam subArray, and the length of the currentTeam which is the amount of requests
    they submitted*/

    function helper(currentScheduleStack, currentTeamIndex){
        const currentTeam = teamRequestArray[currentTeamIndex]
        const currentTeamTotalRequests = currentTeam.length;
        
        /*loop that iterates through each request for current Team, with variables for slice of current scheduling stack, 
        a freshly generated blank schedule, and an empty array to push options that work */
        loop1:for (let currentRequestIndex=0; currentRequestIndex<currentTeamTotalRequests; currentRequestIndex++){
            let currentRequest = currentTeam[currentRequestIndex];
            const currentScheduleStackSlice = currentScheduleStack.slice(0); 
            let scheduleObject = buildScheduleObjectNew();
            let bestChoice = []           
            
            //function that checks active Team availability against current scheduling stack
            function checkCoachSpaceAvailability(activeTeam, activeScheduleStack){
    
                /*function that populates the blank schedule with each team of the current scheduling stack, 
                by "occupying" (subtracting) the appropriate # of slots out of total weight room space (unless they are training in remote location), 
                marking the respective strength coach as no longer available, and adding the team to a list of teams in that slot;
                doing it for every 15 mins that the team has up to the duration of the session*/
                function populateScheduleObjectWithExistingScheduleStack(){
                    for(let existingTeamIndex = 0; existingTeamIndex < activeScheduleStack.length; existingTeamIndex++){
                        let existingTeamTrainingWeek = activeScheduleStack[existingTeamIndex];
                        for(let day = 0; day<existingTeamTrainingWeek.length; day++){
                            let existingTeamTrainingDay = existingTeamTrainingWeek[day];
                            let team = existingTeamTrainingDay[0]
                            let dayOfWeek = existingTeamTrainingDay[1]
                            let start = existingTeamTrainingDay[2];
                            let stop = existingTeamTrainingDay[3]
                            let inWeightRoom = existingTeamTrainingDay[4]
                            for(let time = start; time < stop; time += 15){
                                if(inWeightRoom == "yes"){
                                    scheduleObject[dayOfWeek][time].slots -= teamObject[team].size;
                                    scheduleObject[dayOfWeek][time].existingTeams.push(teamObject[team].name)
                                }else{
                                    scheduleObject[dayOfWeek][time].existingTeams.push(`${teamObject[team].name} off-site`)
                                }
                                scheduleObject[dayOfWeek][time].strengthCoachAvailability[teamObject[team].coach] = "no";
                            }    
                        }
                    }
                }
                /* function that compares each day of the "to be scheduled" team's current proposal, checking that for every 15min
                between start and stop, both the space and coach is free, with a variable that imitates (but does not shallow copy) the current proposal */
                function checkActiveTeam(){
                    for(let dayProposalIndex = 0; dayProposalIndex<activeTeam.length; dayProposalIndex++){
                        let trainingDay = activeTeam[dayProposalIndex]
                        let team = trainingDay[0];
                        let dayOfWeek = trainingDay[1]
                        let start = trainingDay[2];
                        let stop = trainingDay[3];
                        let inWeightRoom = trainingDay[4]
                        let validTime = [team, dayOfWeek, start, stop, inWeightRoom, "yes"  ];
                       
                        
                        function evaluateTime(modifier){                                                     
                            for(let time = start + modifier; time < stop + modifier;time+=15){
                                if(scheduleObject[dayOfWeek][time].strengthCoachAvailability[teamObject[team].coach] == "no"){                                    
                                    return "conflict"
                                }else if(scheduleObject[dayOfWeek][time].slots - teamObject[team].size <0){                                  
                                    return "conflict"
                                }
                            }   
                        }
                        /*conditions of checkActiveTeam that assess: if original proposed day works, push it to bestChoice array;
                        if not, if adding/subtracting up to 30 mins from start and end time will allow a conflicting proposed time to still fit in a relatively similar spot, 
                        modify the proposal imitation to change the start/end times appropriately(without modifiying the actual proposed times, just in case). 
                        Otherwise, returns completeConflict to indicate that no variation of the time proposed for that day works,
                        and pushes conflicting day/time to conflictArray*/
                        if(evaluateTime(0) == "conflict"){
                            if(evaluateTime(-15) == "conflict"){
                                if(evaluateTime(15) == "conflict"){
                                    if(evaluateTime(-30) == "conflict"){
                                        if(evaluateTime(30) == "conflict"){
                                            conflictArray.push([`${team}`,`${dayOfWeek}`,`${start}(+/-30)`])
                                            return "completeConflict"
                                        }else{
                                            validTime[2] = start + 30
                                            validTime[3] = stop + 30
                                            bestChoice.push(validTime)  
                                        }
                                    }else{
                                        validTime[2] = start + -30
                                        validTime[3] = stop + -30
                                        bestChoice.push(validTime)
                                    }
                                }else{
                                    validTime[2] = start + 15
                                    validTime[3] = stop + 15
                                    bestChoice.push(validTime)
                                }
                            }else{
                                validTime[2] = start + -15
                                validTime[3] = stop + -15
                                bestChoice.push(validTime)
                            }
                        }else{
                            bestChoice.push(validTime)
                        }
                    }                              
                }
                populateScheduleObjectWithExistingScheduleStack()
                if(checkActiveTeam() == "completeConflict"){
                   return "completeConflict"
                }             
        
            }
            //if a day in the current proposal cannot fit after all variations, moves on to the next full proposal set for that team
            if(checkCoachSpaceAvailability(currentRequest,currentScheduleStackSlice) == "completeConflict"){
                continue loop1;
            }
            //if successful at finding a time for each day proposed, pushes the team's option to the current schedule stack    
            currentScheduleStackSlice.push(bestChoice);

            //if the current size of the schedule stack is longer than the longest stack length, the current schedule stack becomes the longest stack
            if(currentScheduleStackSlice.length > longestStack.length){
                longestStack = currentScheduleStackSlice
            }
            /*if the stack adds every team and reaches this point, it is a full schedule, 
            and it is pushed to the completeSchedules array as a viable schedule to use,
            otherwise, the helper function runs again for the next team in the teamRequestArray */
            if (currentTeamIndex==totalTeamRequests){
                completeSchedules.push(currentScheduleStackSlice);
            }else{
                helper(currentScheduleStackSlice, currentTeamIndex+1);
            }
            //if 5 full schedules can be made, stops evaluating any more options, returns 5 full schedules and conflictArray
            if(completeSchedules.length == 5){
                return [completeSchedules, conflictArray];
            }
        }
    
    }

    //initiates an empty "previous team" stack, and starts evaluation of first team
    helper([], 0);

    /*if no full schedule can be made, return the longest stack that was able to be created to see the best schedule that was attempted, 
    and where it failed, otherwise, after all possible combinations have been assessed, return all full schedules created, both return with 
    conflictArray*/
    if(completeSchedules.length == 0){
        return [longestStack, conflictArray]
    }else{
        return [completeSchedules, conflictArray];
    }
}

/*object that holds coaches preferred or known unavailabilities to schedule teams */
const coachPreferencesObject = {
    Dolan:{
        Sun:[[360, 1200]],
        Mon:[],
        Tue:[],
        Wed:[],
        Thu:[],
        Fri:[],
        Sat:[[360,540], [720,1200]]

    },
        
    
    Pifer:{
        Sun:[],
        Mon:[],
        Tue:[],
        Wed:[],
        Thu:[],
        Fri:[],
        Sat:[]

    },

    Brindle:{
        Sun:[],
        Mon:[],
        Tue:[],
        Wed:[],
        Thu:[],
        Fri:[],
        Sat:[]

    },
    Walts:{
        Sun:[],
        Mon:[],
        Tue:[],
        Wed:[],
        Thu:[],
        Fri:[],
        Sat:[],

    },

    Weeks:{
        Sun:[],
        Mon:[],
        Tue:[],
        Wed:[],
        Thu:[],
        Fri:[],
        Sat:[]

    },

    Rivera:{
        Sun:[],
        Mon:[],
        Tue:[],
        Wed:[],
        Thu:[],
        Fri:[],
        Sat:[]

    },
}



/*function to build blank schedule object for each new team evaluation, for each day of week, 6am-8pm, with every 15m(we have 15 mins in our intervals for scheduling)
having x slots (available training spaces, an array to indicate each coach's availability, (accounting for requests in coachPreference Object),
 and an empty array to fill with teams that schedule in that block.
The reason for building a blank object each time was to ensure that previous attempts down a different tree line didn't "mark up" the schedule as filled
for teams that were no longer actually scheduled due to the recursion backtracking*/     
function buildScheduleObjectNew(){
    let scheduleObject = {
        Sun:{},
        Mon:{},
        Tue:{},
        Wed:{},
        Thu:{},
        Fri:{},
        Sat:{},
    };
    
    for(let day in scheduleObject){
        for(let time = 360; time<1200; time+=15){
    
            scheduleObject[day][time] =
                {
                    slots : 6,
                    strengthCoachAvailability:{
                        Dolan: "yes",
                        Pifer: "yes",
                        Rivera: "yes",
                        Brindle: "yes",
                        Walts: "yes",
                        Weeks: "yes",
                    },
                    existingTeams:[],
                }
            for(let name in coachPreferencesObject){
                let coach = coachPreferencesObject[name][day]
                    for(let preference = 0; preference<coach.length; preference++){ 
                        if(time>=coach[preference][0] && time<coach[preference][1]){
                            scheduleObject[day][time].strengthCoachAvailability[name] = "no"
                        }
                    }
            }
        }
    }
    return scheduleObject
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
    
    