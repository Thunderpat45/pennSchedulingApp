import {events} from "../events"
/*
action: contains and modifies data built for current teamRequest

publishes:
    workingModel modifications to:
        option length/ option rank/ day length/ dayDetail values
    new workingModel builds
    existing workingModel loads
    update requests to myTeamsModel

subscribes to: 
    team Addition request
        FROM: myTeamsDOM

    teamRequest edit loads
        FROM: myTeamsModel
    
    workingModel update requests for:
        teamName/ teamSize/ option length/ day length/ dayDetail values
    teamRequest update validation requests
        FROM: teamRequestDOM
*/ 
const teamRequestModel = (function(){
    
    events.subscribe("addTeam", createWorkingModel);
    events.subscribe("teamEditDataLoaded", populateWorkingModel); //get this from myTeams
    events.subscribe("updateTeamRequest", validateTeamUpdate);
   
    events.subscribe("addOpt", addOption);
    events.subscribe("deleteOpt", deleteOption);
    events.subscribe("modifyOptOrder", modifyOptionsOrder);
   
    events.subscribe("addDay", addDay);
    events.subscribe("modifySelectorValue", modifySelectorValue);
    events.subscribe("deleteDay", deleteDay);
    
    events.subscribe("modifyTeamSizeValue", modifyTeamSizeValue);
    events.subscribe("modifyTeamNameValue", modifyTeamNameValue);
    
    


    let workingModel;
    let teamRequest;
    
    function createWorkingModel(){
        workingModel = {
            teamName: "",
            teamSize: "default",
            /*rank: {
                myTeamIndex: null,
                allTeamsIndex: null
            },
            */
            allOpts: [[createDefaultDayDetails()]],
            //coach: something
        };
        teamRequest = [];
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
        events.publish("validateTeamRequest", {workingModel, teamRequest}) //change path to validator, then myTeams, which makes deep copy of myTeamsData, send that to DB, change parameters for validator
    }

    /*
    function cancelTeamRequest(){ //this needs to go somewhere else, likely in mainPageDOM to render
        events.publish("renderPage", mainPage)
    }
    */

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
