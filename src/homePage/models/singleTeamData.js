import {events} from "../../../src/events"

const singleTeamData = (function(){
    
    let teamModelStable = {};
    let teamModelMutable = {}
    
    const teamDetailsDefault = {
        name: "",
        season: "default",
        size: "default", 
        rank: {
            myTeams: null,
            allTeams: null
        },
        allOpts: null,
        coach:null,
        lastVerified: null,
        enabled: true
    }
    

    events.subscribe('userDataFetched', setDefaults)
    events.subscribe("addTeamClicked", addTeam);
    events.subscribe("teamDataEditRequested", setTeamDataEditRequest); 
    events.subscribe('cancelTeamChangesClicked', setTeamDataCancelRequest)
    events.subscribe("updateTeamClicked", validateChanges);
    events.subscribe('teamDataValidated', updateTeamData);
    events.subscribe('teamDataValidationFailed', renderTeamValidationErrors)
    events.subscribe("editTeamDataSaved", publishTeamUpdatesToAllTeams);
    events.subscribe("newTeamDataSaved", addTeamDataToAllTeams);

    events.subscribe("addOpt", addOption);
    events.subscribe("deleteOpt", deleteOption);
    events.subscribe("modifyOptOrder", modifyOptionsOrder);
   
    events.subscribe("addDay", addDay);
    events.subscribe("modifyTeamSelectorValue", modifySelectorValue);
    events.subscribe("deleteDay", deleteDay);
    events.subscribe("modifyTeamSizeValue", modifyTeamSizeValue);
    events.subscribe("modifyTeamNameValue", modifyTeamNameValue);

    
 
    function setDefaults(userData){
        teamDetailsDefault.coach = userData.thisUser._id
        teamDetailsDefault.season = userData.season
    }
    
    function addTeam(){
        teamModelStable = structuredClone(teamDetailsDefault);
        teamModelStable.allOpts = [[createDefaultDayDetails()]]
        teamModelMutable = structuredClone(teamModelStable)
        events.publish("teamAddRequested", {team:teamModelMutable, origin: 'add'})
    }

    function setTeamDataEditRequest(team){
        teamModelStable = structuredClone(team)
        teamModelMutable = structuredClone(teamModelStable)
    
        events.publish("teamDataLoaded", {team:teamModelMutable, origin: 'edit'}) //follow this
    }

    function setTeamDataCancelRequest(){
        teamModelStable = {};
        events.publish("teamDataChangesCancelled") 
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

    function addOption(teamData){
        teamModelMutable.allOpts.push([createDefaultDayDetails()]);
        events.publish("optionsModified", {team:teamModelMutable, origin: teamData.origin});  //what is origin again?
    }

    function deleteOption(teamData){
        const index = teamData.optNum - 1;
        teamModelMutable.allOpts.splice(index, 1);
        events.publish("optionsModified", {team:teamModelMutable, origin: teamData.origin});
    }

    function modifyOptionsOrder(teamData){
        const index = teamData.optNum - 1;
        const option = teamModelMutable.allOpts.splice(index, 1)[0];
        teamModelMutable.allOpts.splice(index + teamData.modifier, 0, option);
        events.publish("optionsModified", {team:teamModelMutable, origin: teamData.origin});
    }

    function addDay(teamData){
        const optIndex = teamData.optNum - 1;
        const optionDetails = teamModelMutable.allOpts[optIndex];
        optionDetails.push(createDefaultDayDetails());
        events.publish("optionsModified", {team:teamModelMutable, origin: teamData.origin})
    }

    function deleteDay(teamData){
        const optIndex = teamData.optNum - 1;
        const dayIndex = teamData.dayNum - 1;
        const optionDetails = teamModelMutable.allOpts[optIndex];
        optionDetails.splice(dayIndex, 1);
        events.publish("optionsModified", {team:teamModelMutable, origin: teamData.origin})
    }

    function modifySelectorValue(teamData){
        const optIndex = teamData.optNum - 1;
        const dayIndex = teamData.dayNum - 1;
        teamModelMutable.allOpts[optIndex][dayIndex][teamData.modifiedSelector] = teamData.value
    }

    function modifyTeamSizeValue(size){ //fix thsese
        teamModelMutable.size = size;
    }

    function modifyTeamNameValue(name){ //fix theses
        teamModelMutable.name = name
    }   

    function validateChanges(origin){
        events.publish("teamValidationRequested", {teamData: teamModelMutable, origin})
    }

    function updateTeamData(validatedData){
        if(validatedData.origin == "edit"){
			events.publish("teamUpdateRequested", validatedData.teamData) 
		}else{
			events.publish("newTeamAdditionRequested", validatedData.teamData)
		}
    }

    function renderTeamValidationErrors(validationErrorData){
        const {errors, origin} = validationErrorData
        events.publish("renderTeamDataValidationErrors", {team: teamModelMutable, errors, origin})
    }

    function publishTeamUpdatesToAllTeams(){
        events.publish("updateAllTeamsModel", teamModelMutable)
    }

    function addTeamDataToAllTeams(data){
        const {_id, rank} = data
        teamModelMutable._id = _id;
        teamModelMutable.rank = rank;
        events.publish("updateAllTeamsModel", teamModelMutable);
    }

})();

export{singleTeamData}
