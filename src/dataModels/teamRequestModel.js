import {events} from "../events"

/*purpose: dataModel for loading content and editing content for requestFormDOM

team object is modeled as such:

obj = {
    
    teamName,
    teamSize, 
    rank:
        {
            myTeams,
            allTeams
        },
    allOpts: [[{dayOfWeek, startTime, endTime, inWeiss}, {etc}], [{etc}, {etc}], []],
    coach
                  
}

publishes:
    dataModel generation/ allOpts, allDays, and value modifications FOR requestFormDOM build

subscribes to: 
    team addition requests FROM mainPageModel
    team editData loads FROM myTeamsModel
    update requests FROM requestFormDOM
    modifications to add/delete/change option order, add/delete/change values for days, modify name, size FROM requestFormDOM
*/

const teamRequestModel = (function(){
    
    let coach
    
    events.subscribe("mainPageModelBuilt", setCoach)

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
    
    let workingModel; 
    let teamRequest;

    function setCoach(mainPageData){
        coach = mainPageData.name
    }
    
    function createWorkingModel(){
        teamRequest = {
            teamName: "",
            teamSize: "default", 
            rank: {
                myTeams: null,
                allTeams: null
            },
            allOpts: [[createDefaultDayDetails()]],
           coach:coach
        };

        const workingModel = buildWorkingModelDeepCopy(teamRequest)
        
        events.publish("workingModelPopulated", workingModel)
    }

    function populateWorkingModel(thisTeamRequest){
        teamRequest = thisTeamRequest
        workingModel = buildWorkingModelDeepCopy(thisTeamRequest)

        events.publish("workingModelPopulated", workingModel) //follow this
    }

    function buildWorkingModelDeepCopy(thisTeamRequest){
        const workingModel = Object.assign({}, thisTeamRequest);
        workingModel.rank = Object.assign({}, thisTeamRequest.rank);

        workingModel.allOpts = thisTeamRequest.allOpts.concat();
        thisTeamRequest.allOpts.forEach(function(option){

            const optIndex = thisTeamRequest.allOpts.indexOf(option);
            workingModel.allOpts[optIndex] = thisTeamRequest.allOpts[optIndex].concat();
            option.forEach(function(day){

                const dayIndex = option.indexOf(day);
                workingModel.allOpts[optIndex][dayIndex] = Object.assign({}, thisTeamRequest.allOpts[optIndex][dayIndex])
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

    function validateTeamUpdate(workingModel){ //REVIEW ALL OF THIS
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
