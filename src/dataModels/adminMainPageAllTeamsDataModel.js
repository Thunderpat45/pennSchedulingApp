import { events } from "../events";

/*purpose: dataModel for modifying/saving allTeams content for adminMainPage

adminAllTeams array is modeled as such:

allTeams = 
	[
		{ 
			teamName,
			teamSize, 
			rank:
				{
					myTeams,
					allTeams
				},
			allOpts: [[{dayOfWeek, startTime, endTime, inWeiss}, {etc}], [{etc}, {etc}], []],
			coach
		}, 
		{etc}, {etc}
	]

	teamOrderObj obj is modeled as follows: {index, modifier}

publishes:
    allTeams order changes FOR database update
   
subscribes to: 
    adminMainPageModel builds FROM adminMainPageModel
    allTeams order updates FROM adminMainPageDOM
*/

const adminMainPageAllTeamsData = (function(){
	//no obvious work to be done here except connect teamOrder change to database, have changes written to EVERY TEAM and ensure recursion is necessary
	let allTeams;

	events.subscribe("adminMainPageModelBuilt", populateAllTeams)
	events.subscribe("modifyAdminTeamOrder", modifyTeamOrder);

	function populateAllTeams(adminAllTeams){
		allTeams = adminAllTeams.allTeams.concat(); //does this need recursive copying? depth should be sufficient if so
		for(let team in adminAllTeams.allTeams){
			allTeams[team] = Object.assign({}, adminAllTeams.allTeams[team])
			allTeams[team].rank = Object.assign({}, adminAllTeams.allTeams[team].rank)
		}
	}

	function modifyTeamOrder(teamOrderObj){
		const {teamIndex, modifier} = teamOrderObj;

		const allTeamsSlice = allTeams.concat();
		for(let team in allTeams){
			allTeamsSlice[team] = Object.assign({}, allTeams[team])
			allTeamsSlice[team].rank = Object.assign({}, allTeams[team].rank)
		}

		const team = allTeamsSlice.splice(teamIndex, 1)[0];
		allTeamsSlice.splice(teamIndex + modifier, 0, team);
		allTeamsSlice.forEach(function(team){
			team.rank.allTeams = allTeamsSlice.findIndex(function(thisTeam){
				return thisTeam.name == team.name
			})
		})
		events.publish("adminAllTeamsDataUpdated", allTeamsSlice); //find listener
	}
})()

export {adminMainPageAllTeamsData}