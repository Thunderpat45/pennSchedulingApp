const events = [] //to shut the linter up until events.js can be imported;
/*
actions: contains and modifies data built for current teamRequest

publishes:
    workingModel modifications to:
        option length
        option rank
        day length
        dayDetail values
    new workingModel builds
    existing workingModel loads

subscribes to: 
    teamRequest loads
        FROM: myTeamsModel
    
    workingModel update requests for:
        teamName
        teamSize
        option length
        option size
        day length
        dayDetail values
    teamRequest update validation requests
        FROM: teamRequestDOM
*/ 

const teamRequestModel = (function(){

    let workingModel;
    
    let teamRequest;

    const defaultDayDetails = {
        dayOfWeek: "default",
        startTime: "default",
        endTime: "default",
        inWeiss: "default"
    };

    events.subscribe("modifySelectorValues", modifySelectorValue);
    events.subscribe("deleteDay", deleteDay);
    events.subscribe("addDay", addDay);
    events.subscribe("deleteOpt", deleteOption);
    events.subscribe("addOpt", addOption);
    events.subscribe("modifyOptOrder", modifyOptionsOrder);
    events.subscribe("modifyTeamSizeValue", modifyTeamSizeValue);
    events.subscribe("modifyTeamNameValue", modifyTeamNameValue);
    events.subscribe("updateTeamRequest", validateTeamUpdate);
    events.subscribe("", createWorkingModel); //add team
    events.subscribe("", populateWorkingModel); //edit team
    
    function createWorkingModel(){
        workingModel = {
            teamName: "",
            teamSize: "default",
            allOpts: [[defaultDayDetails]]
        };
        teamRequest = [];
        events.publish("workingModelPopulated", workingModel)
    }

    function populateWorkingModel(thisTeamRequest){
        workingModel = Object.assign({}, thisTeamRequest);
        teamRequest = thisTeamRequest
        events.publish("workingModelPopulated", workingModel)
    }

    function validateTeamUpdate(workingModel){
        events.publish("validateTeamRequest", workingModel, teamRequest) //added teamRequest for update posts, modify in validator
    }

    /*
    function cancelTeamRequest(){ //this needs to go somewhere else, likely in mainPageDOM to render
        events.publish("renderPage", mainPage)
    }
    */

    function addOption(){
        workingModel.allOpts.push([defaultDayDetails]);
        events.publish("optionsModified");
    }

    function deleteOption(optNum){
        const index = optNum - 1;
        workingModel.allOpts.splice(index, 1);
        events.publish("optionsModified");
    }

    function modifyOptionsOrder(optNum, modifier){
        const index = optNum - 1;
        const option = workingModel.allOpts.splice(index, 1)[0];
        workingModel.allopts.splice(index + modifier, 0, option);
        events.publish("optionsModified");
    }

    function addDay(optNum){
        const optIndex = optNum - 1;
        const optionDetails = workingModel.allOpts[optIndex];
        optionDetails.push(defaultDayDetails);
        events.publish("daysModified", optionDetails, optNum)
    }

    function deleteDay(optNum, dayNum){
        const optIndex = optNum - 1;
        const dayIndex = dayNum - 1;
        const optionDetails = workingModel.allOpts[optIndex];
        optionDetails.splice(dayIndex, 1);
        events.publish("daysModified", optionDetails, optNum)
    }

    function modifySelectorValue(optNum, dayNum, selector, value){
        const optIndex = optNum - 1;
        const dayIndex = dayNum - 1;
        workingModel.allOpts[optIndex][dayIndex][selector] = value
    }

    function modifyTeamSizeValue(size){
        workingModel.teamSize = size;
    }

    function modifyTeamNameValue(name){
        workingModel.teamName = name
    }
})()