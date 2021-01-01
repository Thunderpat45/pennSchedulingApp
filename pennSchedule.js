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
                                scheduleObject[trainingOption[1]][trainingOption[2]].slots -= teamObject[trainingOption[0]].size;
                                scheduleObject[trainingOption[1]][trainingOption[2]].strengthCoachAvailability[teamObject[trainingOption[0]].coach] = "no";
                                    
                            }
                        }
                    }
            
                    function checkCurrentTeam(){
                        for(let trainingOption = 0; trainingOption<currentTeam.length; trainingOption++){
                            if(scheduleObject[currentTeam[trainingOption][1]][currentTeam[trainingOption][2]].slots - teamObject[currentTeam[trainingOption][0]].size <0 ||
                               scheduleObject[currentTeam[trainingOption][1]][currentTeam[trainingOption][2]].strengthCoachAvailability[teamObject[currentTeam[trainingOption][0]].coach] == "no"){
                                    console.log("conflict") 
                                    return "conflict"
                            }
                        }
                    }
                    populateCurrentTeams()
                    if(checkCurrentTeam() == "conflict"){
                        return "conflict"
                    };
                    
            
                }
                if(checkCoachSpaceAvailability(currentIndex,arraySlice) == "conflict"){
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
                        slots : 5,
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
            size: 5,
            schedulePreferences:
                [
                    [
                        ["football","Mon", 1200, 60, "yes", "yes"],
                        ["football","Wed", 1200, 60,"yes", "yes"],
                    ],

                    [
                        ["football","Mon", 1300, 60,"yes", "yes"],
                        ["football","Wed", 1300, 60,"yes", "yes"]

                    ]
                ]
            
        
        
        },
    
        basketballWomen:{
            name:"basketballWomen",
            coach: "Brindle",
            rank:2,
            size: 2,
            schedulePreferences:
                
                [
                    [
                        ["basketballWomen","Mon", 1200, 60,"yes", "yes"],
                        ["basketballWomen","Wed", 1400, 60,"yes", "yes"],
                    ],

                    [
                        ["basketballWomen","Mon", 1400, 60,"yes", "yes"],
                        ["basketballWomen","Wed", 1400, 60,"yes", "yes"],
                    ],
                ]
        },
        
        basketballMen:{
            name:"basketballMen",
            coach: "Brindle",
            rank:3,
            size: 2,
            schedulePreferences:
            
                [
                    [
                        ["basketballMen","Mon", 1400, 60,"yes", "yes"],
                        ["basketballMen","Wed", 1600, 60,"yes", "yes"],
                    ],

                    [
                        ["basketballMen","Mon", 1500, 60,"yes", "yes"],
                        ["basketballMen","Wed", 1600, 60,"yes", "yes"],
                    ],
                ]
        },
     
    }
    
    