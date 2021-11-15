import { events } from "../events";

const adminMainPageAllTeamsData = (function(){

	let allTeams;

	//load all teams
	events.subscribe("modifyAdminTeamOrder", modifyTeamOrder);

	function populateAllTeams(adminAllTeams){
		allTeams = Object.assign({}, adminAllTeams) //does this need any more recursive copying?
	}

	function modifyTeamOrder(teamIndex, modifier){
		const allTeamsSlice = allTeams.concat();
		const team = allTeamsSlice.splice(teamIndex, 1)[0];
		allTeamsSlice.splice(teamIndex + modifier, 0, team);
		allTeamsSlice.forEach(function(team){
			team.rank.allTeams = allTeamsSlice.findIndex(function(teams){/*makei sure allTeams is right property */ 
				return teams.teamName = team.teamName
			})
		})
		events.publish("adminAllTeamsDataUpdated", allTeamsSlice);
	}
})()

export {adminMainPageAllTeamsData}