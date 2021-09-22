import {events} from "../events"
/*
action: stores current single team data, makes modifications on a copy

publishes:
    DOM modifications to:
        option length/ option rank/ day length/ dayDetail values
    new team workingModels 
    existing workingModels
    addition/edit updates to myTeamsModel

subscribes to: 
    team Addition request
        FROM: myTeamsDOM

    teamRequest edit request
        FROM: myTeamsModel
    
    workingModel update requests for:
        teamName/ teamSize/ option length/ day length/ dayDetail values
    teamRequest update validation requests
        FROM: teamRequestDOM
*/ 
const teamRequestModel = (function(){
    
    events.subscribe("addTeam", createWorkingModel);
    events.subscribe("teamEditDataLoaded", populateWorkingModel); 
    events.subscribe("updateTeamRequest", validateTeamUpdate);
   
    events.subscribe("addOpt", addOption);
    events.subscribe("deleteOpt", deleteOption);
    events.subscribe("modifyOptOrder", modifyOptionsOrder);
   
    events.subscribe("addDay", addDay);
    events.subscribe("modifySelectorValue", modifySelectorValue);
    events.subscribe("deleteDay", deleteDay);
    
    events.subscribe("modifyTeamSizeValue", modifyTeamSizeValue);
    events.subscribe("modifyTeamNameValue", modifyTeamNameValue);
    
    // workingModel stores current teamData in a copy to make modifications on; teamRequest holds the original data (used by myTeams after validation to check if a team is new, or needs to be overwritten)
    let workingModel; 
    let teamRequest;
    
    function createWorkingModel(){
        workingModel = {
            teamName: "",
            teamSize: "default", 
            rank: {
                myTeams: null,
                allTeams: null
            },
            allOpts: [[createDefaultDayDetails()]],
           //coach needs a source of data, work on that
        };
        teamRequest = {}; 
        events.publish("workingModelPopulated", workingModel)
    }

    function populateWorkingModel(thisTeamRequest){
        workingModel = buildWorkingModelDeepCopy(thisTeamRequest)
        teamRequest = thisTeamRequest
        events.publish("workingModelPopulated", workingModel)
    }

    function buildWorkingModelDeepCopy(thisTeamRequest){
        const workingModel = Object.assign({}, thisTeamRequest);
        workingModel.allOpts = thisTeamRequest.allOpts.concat();
        thisTeamRequest.allOpts.forEach(function(option){
            const optIndex = thisTeamRequest.allOpts.indexOf(option);
            workingModel.allOpts[optIndex] = thisTeamRequest.allOpts[optIndex].concat();
            option.forEach(function(day){
                const dayIndex = option.indexOf(day);
                workingModel.allOpts[optIndex][dayIndex] = Object.assign({}, option[dayIndex])
            })
        })
        return workingModel;
    }

    function createDefaultDayDetails(){
        const defaultDayDetails = {
            dayOfWeek: "default",
            startTime: "default",
            endTime: "default",
            inWeiss: "default"
        };
        return defaultDayDetails
    }

    function validateTeamUpdate(workingModel){
        events.publish("validateTeamRequest", {workingModel, teamRequest}) 
    }

    function addOption(){
        workingModel.allOpts.push([createDefaultDayDetails()]);
        events.publish("optionsModified");
    }

    function deleteOption(optNum){
        const index = optNum - 1;
        workingModel.allOpts.splice(index, 1);
        events.publish("optionsModified");
    }

    function modifyOptionsOrder(obj){
        const index = obj.optNum - 1;
        const option = workingModel.allOpts.splice(index, 1)[0];
        workingModel.allopts.splice(index + obj.modifier, 0, option);
        events.publish("optionsModified");
    }

    function addDay(optNum){
        const optIndex = optNum - 1;
        const optionDetails = workingModel.allOpts[optIndex];
        optionDetails.push(createDefaultDayDetails());
        events.publish("daysModified", {optionDetails, optNum})
    }

    function deleteDay(obj){
        const optIndex = obj.optNum - 1;
        const dayIndex = obj.dayNum - 1;
        const optionDetails = workingModel.allOpts[optIndex];
        optionDetails.splice(dayIndex, 1);
        events.publish("daysModified", {optionDetails, optNum:obj.optNum})
    }

    function modifySelectorValue(obj){
        const optIndex = obj.optNum - 1;
        const dayIndex = obj.dayNum - 1;
        workingModel.allOpts[optIndex][dayIndex][obj.selector] = obj.value
    }

    function modifyTeamSizeValue(size){
        workingModel.teamSize = size;
    }

    function modifyTeamNameValue(name){
        workingModel.teamName = name
    }

    

})();

export{teamRequestModel}
