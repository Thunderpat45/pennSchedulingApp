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
    validation requests for requestValidator

subscribes to: 
    coachName from mainPageDataModel
    team addition requests FROM mainPageDOM
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
    events.subscribe("modifyTeamSelectorValue", modifySelectorValue);
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
            name: "",
            size: "default", 
            rank: {
                myTeams: null,
                allTeams: null
            },
            allOpts: [[createDefaultDayDetails()]],
           coach:coach,
           lastVerified: null
        };

        workingModel = buildWorkingModelDeepCopy(teamRequest)
        
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

    function validateTeamUpdate(){ //follow this
        events.publish("validateTeamRequest", {workingModel, teamRequest}) 
    }

    function addOption(){
        workingModel.allOpts.push([createDefaultDayDetails()]);
        events.publish("optionsModified", workingModel);
    }

    function deleteOption(optNum){
        const index = optNum - 1;
        workingModel.allOpts.splice(index, 1);
        events.publish("optionsModified", workingModel);
    }

    function modifyOptionsOrder(optionDetailsObj){
        const index = optionDetailsObj.optNum - 1;
        const option = workingModel.allOpts.splice(index, 1)[0];
        workingModel.allOpts.splice(index + optionDetailsObj.modifier, 0, option);
        events.publish("optionsModified", workingModel);
    }

    function addDay(optNum){
        const optIndex = optNum - 1;
        const optionDetails = workingModel.allOpts[optIndex];
        optionDetails.push(createDefaultDayDetails());
        events.publish("daysModified", {publishedOptionDetails: optionDetails, publishedOptNum: optNum})
    }

    function deleteDay(dayDetailsObj){
        const optIndex = dayDetailsObj.optNum - 1;
        const dayIndex = dayDetailsObj.dayNum - 1;
        const optionDetails = workingModel.allOpts[optIndex];
        optionDetails.splice(dayIndex, 1);
        events.publish("daysModified", {publishedOptionDetails: optionDetails, publishedOptNum:dayDetailsObj.optNum})
    }

    function modifySelectorValue(dayDetailsObj){
        const optIndex = dayDetailsObj.optNum - 1;
        const dayIndex = dayDetailsObj.dayNum - 1;
        workingModel.allOpts[optIndex][dayIndex][dayDetailsObj.selector] = dayDetailsObj.value
    }

    function modifyTeamSizeValue(size){
        workingModel.size = size;
    }

    function modifyTeamNameValue(name){
        workingModel.name = name
    }   

})();

export{teamRequestModel}
