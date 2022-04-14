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
        const mediaQuery = window.matchMedia('(max-width: 485px)');
        checkWidth(mediaQuery);
        mediaQuery.addEventListener('change', checkWidth)
        const userPageJSON = await fetch('home/userData');
        const userPageData = await userPageJSON.json();
        events.publish("userDataFetched", userPageData);
        events.publish("userDataSet");
        
    }catch(err){
        console.log(err)
    }
}

function checkWidth(e){
    if(e.matches){
        const body = document.querySelector('body');
        const newText = document.createElement('p');
        newText.innerText = 'This program is designed for PCs, laptops and tablets, due to general support for XLSX documents on those platforms. Please use one of the recommended devices for best experience.'
        const children = Array.from(document.querySelectorAll('body *'));
        if(children.length >0){
            children.forEach(function(child){
                child.remove();
            })
        }

        body.appendChild(newText)
        throw('Window size not appropriate')
    }
}
