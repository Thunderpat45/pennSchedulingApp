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
	let allTeamsDataStable;
	let allTeamsDataMutable;

	events.subscribe("adminDataFetched", setDataNewPageRender);
	events.subscribe("", setDataNewDatabasePost); //add prompt for successful database post
	events.subscribe("", cancelTeamRankChanges) //add prompt for change cancellation
	events.subscribe("", saveTeamRankChanges) //add promprt for save changes
	events.subscribe("modifyAdminTeamOrder", modifyTeamOrder);
	events.subscribe("modifyTeamEnabled", toggleTeamEnabled)

	function setDataNewPageRender(adminAllTeams){
        allTeamsDataStable = adminAllTeams.allTeams; //make sure this is correct property for database initial database fetch
        createAllTeamsDeepCopy(allTeamsDataMutable, allTeamsDataStable)
    }

    function setDataNewDatabasePost(){
        createAllTeamsDeepCopy(allTeamsDataStable, allTeamsDataMutable);
    }

    function createAllTeamsDeepCopy(newArr, copyArr){
        newArr = copyArr.concat();
        newArr.forEach(function(team){
			newArr[team] = Object.assign({}, copyArr[team]);
			newArr[team].rank = Object.assign({}, copyArr[team].rank)
		})
    }

	function modifyTeamOrder(teamOrderObj){
		const {index, modifier} = teamOrderObj;

		const team = allTeamsDataMutable.splice(index, 1)[0];
		allTeamsDataMutable.splice(index + modifier, 0, team);
		allTeamsDataMutable.forEach(function(team){
			team.rank.allTeams = allTeamsDataMutable.findIndex(function(thisTeam){
				return thisTeam.name == team.name
			})
		})
		events.publish("", allTeamsDataMutable); //change this to render request
	}

	function toggleTeamEnabled(teamIndexObj){
		const {_id} = teamIndexObj
		const teamData = allTeamsDataMutable.filter(function(team){
			return team._id == _id
		})[0]
		teamData.enabled = !teamData.enabled;
		events.publish("teamEnabledUpdateRequested", {_id, teamData}) //find db post for this, create listener tag
	}

	function saveTeamRankChanges(){
		events.publish("", allTeamsDataMutable) //find db post for this
	}

	function cancelTeamRankChanges(){
		createAllTeamsDeepCopy(allTeamsDataMutable, allTeamsDataStable);
		events.publish("", allTeamsDataMutable) //change this to same render erequest as modifyTeamOrder
	}


})()

export {adminMainPageAllTeamsData}