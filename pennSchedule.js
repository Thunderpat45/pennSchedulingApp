function convertTime(objectProp, start, end){
    function convertMinuteTime(hourTime){
        let totalMinutes =
        (Number(hourTime.slice(0,2)*60)) + Number(hourTime.slice(-2));
        return totalMinutes;
    };
    objectProp.scheduleOptions[2] = convertMinuteTime(start);
    console.log(convertMinuteTime(start));
    objectProp.scheduleOptions[3] = convertMinuteTime(end);
    console.log(convertMinuteTime(end));
    console.log(objectProp);
    console.log(objectProp.scheduleOptions);
    }
    
    
    
    
    const teamOrderArray = []
    function populateteamOrderArray(){
        for(const team in teamObject){
            let name = teamObject[team]
            teamOrderArray[name.rank-1] = name.schedulePreferences;
    
        }
    }
    
    
    
    function cartesian(...args) {
        const result = [];
        const totalArgsIndex = args.length-1;
        function helper(arr, i) {
        const currentArgLength = args[i].length;
            for (let j=0; j<currentArgLength; j++) {
                let currentIndex = args[i][j];
                const arraySlice = arr.slice(0); // clone arr
                arraySlice.push(currentIndex);
                if (i==totalArgsIndex)
                    result.push(arraySlice);
                else
                    helper(arraySlice, i+1);
            }
        }
        helper([], 0);
        return result;
    }
    
    function modifiedCartesian(...args) {
        const result = [];
        const totalArgsIndex = args.length-1;
        function helper(arr, i) {
            const currentArgLength = args[i].length;
            loop1:for (let j=0; j<currentArgLength; j++) {
                let currentIndex = args[i][j];
                const arraySlice = arr.slice(0); // clone arr
                let scheduleObject = buildScheduleObjectNew();           
                function checkCoachSpaceAvailability(currentTeam, previousTeamArray){
        
                    function populateCurrentTeams(){
                        for(let team = 0; team<previousTeamArray.length; team++){
                            for(let day = 0; day<previousTeamArray[team].length; day++){
                                let trainingOption = previousTeamArray[team][day];
                                for(let time = trainingOption[2]; time<trainingOption[3];time+=15){
                                    scheduleObject[trainingOption[1]][time].slots -= teamObject[trainingOption[0]].size;
                                    scheduleObject[trainingOption[1]][time].strengthCoachAvailability[teamObject[trainingOption[0]].coach] = "no";
                                    if(time.toString().slice(-2) == "45"){
                                        time +=40
                                    }
                                }    
                            }
                        }
                    }
            
                    function checkCurrentTeam(){
                        for(let trainingOption = 0; trainingOption<currentTeam.length; trainingOption++){
                            for(let time = currentTeam[trainingOption][2]; time<currentTeam[trainingOption][3];time+=15){
                                if(scheduleObject[currentTeam[trainingOption][1]][time].slots - teamObject[currentTeam[trainingOption][0]].size <0 ||
                                scheduleObject[currentTeam[trainingOption][1]][time].strengthCoachAvailability[teamObject[currentTeam[trainingOption][0]].coach] == "no"){
                                        return "conflict"
                                }
                                if(time.toString().slice(-2) == "45"){
                                    time +=40
                                }
                            }
                        }
                    }
                    populateCurrentTeams()
                    if(checkCurrentTeam() == "conflict"){
                        return "conflict"
                    };
                    
            
                }
                if(checkCoachSpaceAvailability(currentIndex,arraySlice) == "conflict"){
                    console.log("conflict")
                    continue loop1;
                }
                    /*loop2: for (let k = 0; k<arraySlice.length; k++){
                        if(currentIndex[1] == arraySlice[k][1]&&
                        currentIndex[2] == arraySlice[k][2]){
                            continue loop1
                        }
                    }*/
                arraySlice.push(currentIndex);
                if (i==totalArgsIndex){
                    result.push(arraySlice);
                }else{
                    helper(arraySlice, i+1);
                }if(result.length >= 5){
                    return result;
                }
            }
     
        }
        helper([], 0);
        return result;
    }
    
   

    function checkCoachSpaceAvailability(currentTeam, previousTeamArray){
        
        function populateCurrentTeams(){
            for(let team = 0; team<previousTeamArray; team++){
                for(let day = 0; day<team.length; day++){
                    let trainingOption = previousTeamArray[team][day]
                    scheduleObject[trainingOption[1]][trainingOption[2]].slots -= teamObject[trainingOption[0]].size
                    scheduleObject[trainingOption[1]][trainingOption[2]].strengthCoachAvailability[teamObject[trainingOption[0].coach]] = "no"

                }
            }
        }

        function checkCurrentTeam(){
            for(let trainingOption = 0; trainingOption<currentTeam; trainingOption++){
                if(scheduleObject[currentTeam[trainingOption][1]][currentTeam[trainingOption][2]].slots - teamObject[currentTeam[trainingOption][0]].size <0 ||
                   scheduleObject[currentTeam[trainingOption][1]][currentTeam[trainingOption][2]].strengthCoachAvailability[teamObject[currentTeam[trainingOption][0]].coach] == "no"){
                        return "conflict"
                }
            }
        }
        populateCurrentTeams()
        checkCurrentTeam();

    }
    
    
    
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
            for(let i = 360; i<1200; i+=15){
                let hour = Math.floor(i/60);
                let min;
                if(i%60 == 0){
                    min = "00"
                }else{
                    min = i%60;
                }
                let time = `${hour}${min}`;
        
                scheduleObject[day][`${time}`] =
                    {
                        slots : 6,
                        strengthCoachAvailability:
                        {
                            Walts:"yes",
                            Weeks:"yes",
                            Rivera:"yes",
                            Brindle:"yes",
                            Dolan:"yes",
                            Pifer:"yes",
                        }
                    }
            }
        }
        return scheduleObject
    }
    
    
    
    //cartesian.apply(null, teamOrderArray);
    

    //schedulePreferences arrayFormat = [teamName, day, time, duration, inWeightRoom, BBnecessary]

    const teamObject = {
        football:{
            name: "football",
            coach:"Rivera",
            rank:1,
            size: 3,
            schedulePreferences:
                [
                    [
                        ["football","Tue", 1430, 1515, "yes", "yes"],
                        ["football","Thu", 1430, 1515, "yes", "yes"],
                        ["football","Fri", 1545, 1615, "yes", "yes"]
                    ],

                   /* [
                        ["football","Mon", 1300, 1400,"yes", "yes"],
                        ["football","Wed", 1300, 1400,"yes", "yes"]

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
                        ["basketballWomen","Tue", 700, 815,"yes", "yes"],
                        ["basketballWomen","Thu", 700, 815,"yes", "yes"],
                        ["basketballWomen","Fri", 700, 815,"yes", "yes"],
                    ],

                    /*[
                        ["basketballWomen","Mon", 1400, 1500,"yes", "yes"],
                        ["basketballWomen","Wed", 1400, 1500,"yes", "yes"],
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
                        ["basketballMen","Tue", 1530, 1630,"yes", "yes"],
                        ["basketballMen","Thu", 1515, 1615,"yes", "yes"],
                        ["basketballMen","Fri", 1430, 1530,"yes", "yes"],
                    ],

                    /*[
                        ["basketballMen","Mon", 1500, 1600,"yes", "yes"],
                        ["basketballMen","Wed", 1600, 1700,"yes", "yes"],
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
                        ["sprintFootball","Tue", 1600, 1700,"yes", "yes"],
                        ["sprintFootball","Sat", 900, 1000,"yes", "yes"],
                    ],

                    /*[
                        ["sprintFootball","Mon", 1500, 1600,"yes", "yes"],
                        ["sprintFootball","Wed", 1600, 1700,"yes", "yes"],
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
                        ["fieldHockey","Mon", 915, 1015,"yes", "yes"],
                        ["fieldHockey","Wed", 915, 1015,"yes", "yes"],
                        ["fieldHockey","Fri", 915, 1015,"yes", "yes"],
                    ],

                    /*[
                        ["sprintFootball","Mon", 1500, 1600,"yes", "yes"],
                        ["sprintFootball","Wed", 1600, 1700,"yes", "yes"],
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
                        ["soccerMen","Tue", 1715, 1815,"yes", "yes"],
                        ["soccerMen","Thu", 1715, 1815,"yes", "yes"],
                    ],

                    /*[
                        ["sprintFootball","Mon", 1500, 1600,"yes", "yes"],
                        ["sprintFootball","Wed", 1600, 1700,"yes", "yes"],
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
                    /*[
                        ["soccerMen","Tue", 1715, 1815,"yes", "yes"],
                        ["soccerMen","Thu", 1715, 1815,"yes", "yes"],
                    ],

                    [
                        ["sprintFootball","Mon", 1500, 1600,"yes", "yes"],
                        ["sprintFootball","Wed", 1600, 1700,"yes", "yes"],
                    ],*/
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
                        ["volleyball","Mon", 730, 830,"yes", "yes"],
                        ["volleyball","Wed", 730, 830,"yes", "yes"],
                    ],

                    [
                        ["volleyball","Mon", 800, 900,"yes", "yes"],
                        ["volleyball","Wed", 730, 830,"yes", "yes"],
                    ],
                    
                    [
                        ["volleyball","Mon", 700, 800,"yes", "yes"],
                        ["volleyball","Wed", 730, 830,"yes", "yes"],
                    ],

                    [
                        ["volleyball","Mon", 730, 830,"yes", "yes"],
                        ["volleyball","Wed", 800, 900,"yes", "yes"],
                    ],

                    [
                        ["volleyball","Mon", 730, 830,"yes", "yes"],
                        ["volleyball","Wed", 700, 800,"yes", "yes"],
                    ],
                    
                    [
                        ["volleyball","Mon", 800, 900,"yes", "yes"],
                        ["volleyball","Wed", 800, 900,"yes", "yes"],
                    ],

                    [
                        ["volleyball","Mon", 700, 800,"yes", "yes"],
                        ["volleyball","Wed", 700, 800,"yes", "yes"],
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
                        ["crossCountry","Mon", 1700, 1730,"yes", "yes"],
                        ["crossCountry","Wed", 1700, 1730,"yes", "yes"],
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
                        ["wrestling","Mon", 700, 800,"yes", "yes"],
                        ["wrestling","Wed", 1600, 1700,"yes", "yes"],
                        ["wrestling","Sat", 900, 1000,"yes", "yes"]
                    ],

                    [
                        ["wrestling","Mon", 700, 800,"yes", "yes"],
                        ["wrestling","Wed", 1700, 1800,"yes", "yes"],
                        ["wrestling","Sat", 900, 1000,"yes", "yes"]
                    ],

                    [
                        ["wrestling","Mon", 700, 800,"yes", "yes"],
                        ["wrestling","Wed", 1600, 1700,"yes", "yes"],
                        ["wrestling","Sat", 1000, 1100,"yes", "yes"]
                    ],

                    [
                        ["wrestling","Mon", 730, 830,"yes", "yes"],
                        ["wrestling","Wed", 1600, 1700,"yes", "yes"],
                        ["wrestling","Sat", 900, 1000,"yes", "yes"]
                    ],

                    [
                        ["wrestling","Mon", 700, 800,"yes", "yes"],
                        ["wrestling","Wed", 1700, 1800,"yes", "yes"],
                        ["wrestling","Sat", 1000, 1100,"yes", "yes"]
                    ],

                    [
                        ["wrestling","Mon", 730, 830,"yes", "yes"],
                        ["wrestling","Wed", 1700, 1800,"yes", "yes"],
                        ["wrestling","Sat", 900, 1000,"yes", "yes"]
                    ],

                    [
                        ["wrestling","Mon", 730, 830,"yes", "yes"],
                        ["wrestling","Wed", 1600, 1700,"yes", "yes"],
                        ["wrestling","Sat", 1000, 1100,"yes", "yes"]
                    ],

                    [
                        ["wrestling","Mon", 730, 830,"yes", "yes"],
                        ["wrestling","Wed", 1700, 1800,"yes", "yes"],
                        ["wrestling","Sat", 1000, 1100,"yes", "yes"]
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
                        ["swimDive","Mon", 800, 900,"yes", "yes"],
                        ["swimDive","Wed", 800, 900,"yes", "yes"],
                        ["swimDive","Fri", 800, 900,"yes", "yes"],
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
                        ["trackFieldPifer","Mon", 1730, 1830,"yes", "yes"],
                        ["trackFieldPifer","Wed", 1730, 1830,"yes", "yes"],
                        ["trackFieldPifer","Fri", 1730, 1830,"yes", "yes"],
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
                        ["trackFieldDolan","Mon", 1730, 1830,"yes", "yes"],
                        ["trackFieldDolan","Wed", 1730, 1830,"yes", "yes"],
                        ["trackFieldDolan","Fri", 1730, 1830,"yes", "yes"],
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
                        ["lacrosseMen","Mon", 1600, 1700,"yes", "yes"],
                        ["lacrosseMen","Wed", 1515, 1615,"yes", "yes"],
                        ["lacrosseMen","Fri", 1600, 1700,"yes", "yes"],
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
                        ["lacrosseWomen","Tue", 730, 830,"yes", "yes"],
                        ["lacrosseWomen","Fri", 800, 900,"yes", "yes"],
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
                        ["baseball","Tue", 700, 800,"yes", "yes"],
                        ["baseball","Thu", 1600, 1700,"yes", "yes"],
                        ["baseball","Sat", 1400, 1500,"yes", "yes"],
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
                        ["softball","Tue", 1400, 1500,"yes", "yes"],
                        ["softball","Thu", 1400, 1500,"yes", "yes"],
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
                        ["golfMen","Tue", 600, 700,"yes", "yes"],
                        ["golfMen","Thu", 600, 700,"yes", "yes"],
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
                        ["golfWomen","Tue", 700, 800,"yes", "yes"],
                        ["golfWomen","Thu", 700, 800,"yes", "yes"],
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
                        ["tennisMen","Tue", 1615, 1700,"yes", "yes"],
                        ["tennisMen","Thu", 1615, 1700,"yes", "yes"],
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
                        ["tennisWomen","Tue", 1615, 1700,"yes", "yes"],
                        ["tennisWomen","Thu", 1615, 1700,"yes", "yes"],
                    ],

                    [
                        ["tennisWomen","Mon", 1615, 1700,"yes", "yes"],
                        ["tennisWomen","Wed", 1615, 1700,"yes", "yes"],
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
                        ["lightweightCrewMen","Tue", 1700, 1800,"yes", "yes"],
                        ["lightweightCrewMen","Sat", 1130, 1230,"yes", "yes"],
                    ],

                    [
                        ["lightweightCrewMen","Tue", 1630, 1730,"yes", "yes"],
                        ["lightweightCrewMen","Sat", 1130, 1230,"yes", "yes"],
                    ],

                    [
                        ["lightweightCrewMen","Tue", 1730, 1830,"yes", "yes"],
                        ["lightweightCrewMen","Sat", 1130, 1230,"yes", "yes"],
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
                        ["crewWomen","Mon", 630, 715,"yes", "yes"],
                        ["crewWomen","Tue", 630, 715,"yes", "yes"],
                        ["crewWomen","Thu", 630, 715,"yes", "yes"],
                        ["crewWomen","Fri", 630, 715,"yes", "yes"],
                    ],

                    [
                        ["crewWomen","Mon", 1600, 1645,"yes", "yes"],
                        ["crewWomen","Tue", 1600, 1645,"yes", "yes"],
                        ["crewWomen","Thu", 1600, 1645,"yes", "yes"],
                        ["crewWomen","Fri", 630, 715,"yes", "yes"],
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
                        ["heavyweightCrewMen","Mon", 800, 900,"yes", "yes"],
                        ["heavyweightCrewMen","Wed", 800, 900,"yes", "yes"],
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
                        ["cheerleading","Mon", 1600, 1700,"yes", "yes"],
                        ["cheerleading","Thu", 1700, 1800,"yes", "yes"],
                    ],

                    [
                        ["cheerleading","Mon", 1700, 1800,"yes", "yes"],
                        ["cheerleading","Thu", 1700, 1800,"yes", "yes"],
                    ],

                    [
                        ["cheerleading","Mon", 1800, 1900,"yes", "yes"],
                        ["cheerleading","Thu", 1700, 1800,"yes", "yes"],
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
                        ["fencing","Mon", 1700, 1800,"yes", "yes"],
                        ["fencing","Wed", 1700, 1800,"yes", "yes"],
                    ],

                    [
                        ["fencing","Tue", 1700, 1800,"yes", "yes"],
                        ["fencing","Thu", 1700, 1800,"yes", "yes"],
                    ],

                    [
                        ["fencing","Mon", 1600, 1700,"yes", "yes"],
                        ["fencing","Wed", 1600, 1700,"yes", "yes"],
                    ],

                    [
                        ["fencing","Tue", 1600, 1700,"yes", "yes"],
                        ["fencing","Thu", 1600, 1700,"yes", "yes"],
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
                        ["gymnastics","Thu", 1700, 1800,"yes", "yes"],
                        
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
                        ["squashMen","Tue", 730, 830,"yes", "yes"],
                        ["squashMen","Thu", 730, 830,"yes", "yes"],    
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
                        ["squashWomen","Tue", 730, 830,"yes", "yes"],
                        ["squashWomen","Thu", 730, 830,"yes", "yes"],    
                    ],
                ]
        },

        

        
     
    }
    
    