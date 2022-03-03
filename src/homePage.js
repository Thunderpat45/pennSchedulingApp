import {events} from "../src/events"
import {homeRender} from "../src/homePage/components/homePageRender"

import {availabilityTimeBlockDataFormComponent} from "../src/homePage/components/forms/availabilityBlockForm"
import {availabilityTimeBlockDataGridComponent} from "../src/homePage/components/mainModuleRenders/availabilityBlocksGrid"
import {availabilityValidator} from "../src/validators/availabilityValidator"
import {allAvailabilityDataModel} from "../src/homePage/models/allAvailabilityData"
import {availabilityData} from "../src/homePage/models/availabilityData"

import {databasePost} from "../src/databasePost"

window.onload = setScriptData;

async function setScriptData(){
    try{
        const userPageJSON = await fetch('home/userData.json');
        const userPageData = await userPageJSON.json();
        console.log(userPageData);
        events.publish("userDataFetched", userPageData);
        events.publish("userDataSet");
        
    }catch(err){
        console.log(err)
    }
}