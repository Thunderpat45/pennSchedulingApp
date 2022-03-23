import {events} from "../src/events"
import {homeRender} from "../src/homePage/components/homePageRender"

import {availabilityTimeBlockDataFormComponent} from "../src/homePage/components/forms/availabilityBlockForm"
import {availabilityTimeBlockDataGridComponent} from "../src/homePage/components/mainModuleRenders/availabilityBlocksGrid"
import {availabilityValidator} from "../src/validators/availabilityValidator"
import {allAvailabilityDataModel} from "../src/homePage/models/allAvailabilityData"
import {availabilityData} from "../src/homePage/models/availabilityData"

import { myTeamsOrderFormComponent } from "../src/homePage/components/forms/myTeamsOrderForm"
import { teamDataFormComponent } from "../src/homePage/components/forms/teamDataForm"
import { myTeamsDataGridComponent} from "../src/homePage/components/mainModuleRenders/teamsGrid"
import { teamValidator} from "../src/validators/teamValidator"
import { myTeamsData} from "../src/homePage/models/myTeamsData"
import { singleTeamData } from "../src/homePage/models/singleTeamData"


import {databasePost} from "../src/databasePost"

window.onload = setScriptData;

async function setScriptData(){
    try{
        const userPageJSON = await fetch('home/userData');
        const userPageData = await userPageJSON.json();
        console.log(userPageData);
        events.publish("userDataFetched", userPageData);
        events.publish("userDataSet");
        
    }catch(err){
        console.log(err)
    }
}