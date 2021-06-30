import events from "events"
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
    team Addition request
        FROM: myTeams

    teamRequest edit loads
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

    events.subscribe("modifySelectorValue", modifySelectorValue);
    events.subscribe("deleteDay", deleteDay);
    events.subscribe("addDay", addDay);
    events.subscribe("deleteOpt", deleteOption);
    events.subscribe("addOpt", addOption);
    events.subscribe("modifyOptOrder", modifyOptionsOrder);
    events.subscribe("modifyTeamSizeValue", modifyTeamSizeValue);
    events.subscribe("modifyTeamNameValue", modifyTeamNameValue);
    events.subscribe("updateTeamRequest", validateTeamUpdate);
    events.subscribe("addTeam", createWorkingModel);
    events.subscribe("teamEditDataLoaded", populateWorkingModel);
    
    function createWorkingModel(){
        workingModel = {
            teamName: "",
            teamSize: "default",
            //myTeamIndex: null,
            //allTeamsIndex: null, FIGURE THIS OUT
            allOpts: [[defaultDayDetails]]
        };
        teamRequest = [];
        events.publish("workingModelPopulated", workingModel)
    }

    function populateWorkingModel(thisTeamRequest){
        workingModel = buildWorkingModelDeepCopy(thisTeamRequest)
        teamRequest = thisTeamRequest
        events.publish("workingModelPopulated", workingModel)
    }

    function validateTeamUpdate(workingModel){
        events.publish("validateTeamRequest", workingModel, teamRequest)
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

    function buildWorkingModelDeepCopy(teamRequest){ //make sure data types are correct here
        const workingModel = Object.assign({}, teamRequest);
        workingModel.allOpts = teamRequest.allOpts.concat();
        teamRequest.allOpts.forEach(function(option){
            const optIndex = teamRequest.allOpts.indexOf(option);
            workingModel.allOpts[optIndex] = teamRequest.allOpts[optIndex].concat();
            option.forEach(function(day){
                const dayIndex = option.indexOf(day);
                workingModel.allOpts[optIndex][dayIndex] = Object.assign({}, option[dayIndex])
            })
        })
        return workingModel;
    }

})();

export{teamRequestModel}
