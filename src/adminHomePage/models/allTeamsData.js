import { events } from "../../events";

const adminMainPageAllTeamsData = (function(){

	let allTeamsDataStable;
	let allTeamsDataMutable;

	events.subscribe("adminDataFetched", setDataNewPageRender);
	events.subscribe("allTeamsOrderChangeSaved", setDataNewTeamOrder); 
	events.subscribe("cancelAllTeamsOrderChangesClicked", cancelTeamOrderChanges) 
	events.subscribe("updateAllTeamsOrderClicked", saveTeamOrderChanges) 
	events.subscribe("modifyAllTeamsOrderClicked", modifyTeamOrder);
	events.subscribe("enabledStatusChangeClicked", toggleTeamEnabled);
	events.subscribe('teamEnableStatusChangeSaved', setDataTeamEnableStatusChange)
	events.subscribe('adminTeamOrderChangeClicked', sendTeamData)

	function setDataNewPageRender(adminAllTeams){
        allTeamsDataStable = structuredClone(adminAllTeams.teams); 
        allTeamsDataMutable = structuredClone(allTeamsDataStable)
    }

	function modifyTeamOrder(teamObj){
		const thisTeamIndex = allTeamsDataMutable.findIndex(function(team){
            return team._id == teamObj.team._id
        })
        
        const thisTeam = allTeamsDataMutable.splice(thisTeamIndex, 1)[0]

        allTeamsDataMutable.splice(thisTeamIndex + teamObj.modifier, 0, thisTeam);
        allTeamsDataMutable.forEach(function(thisTeam){
            thisTeam.rank.allTeams = allTeamsDataMutable.findIndex(function(teams){
                return teams._id == thisTeam._id
            })
        })     
		events.publish("allTeamsOrderDataUpdated", allTeamsDataMutable);
	}

	function toggleTeamEnabled(_id){
		const teamData = allTeamsDataMutable.filter(function(team){
			return team._id == _id
		})[0]

		teamData.enabled = !teamData.enabled
		events.publish("teamEnabledUpdateRequested", _id)
	}

	function saveTeamOrderChanges(){
        events.publish('allTeamsOrderDataUpdateRequested', allTeamsDataMutable)
    }

	function setDataTeamEnableStatusChange(){
		allTeamsDataStable = structuredClone(allTeamsDataMutable);
		events.publish('modifyTeamGrid', allTeamsDataMutable)
	}

	function sendTeamData(){
        events.publish('allTeamsOrderChangeRequested', allTeamsDataMutable)
    }

	function cancelTeamOrderChanges(){
        allTeamsDataMutable = structuredClone(allTeamsDataStable);
        events.publish("allTeamsDataChangesCancelled")
    }

    function setDataNewTeamOrder(){
        allTeamsDataStable = structuredClone(allTeamsDataMutable)
        events.publish('modifyTeamGrid', allTeamsDataMutable)
    }
})()

export {adminMainPageAllTeamsData}