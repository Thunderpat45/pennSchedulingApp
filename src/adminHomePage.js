import {events} from "../src/events"
import {adminHomeRender} from "../src/adminHomePage/components/adminHomeRender"

import {facilityDataGridComponent} from "../src/adminHomePage/components/mainModulesRenders/facilityDataGrid"
import {facilityDataFormComponent} from "../src/adminHomePage/components/forms/facilityDataForm";
import {facilityData} from "../src/adminHomePage/models/facilityData";
import {facilityDataValidator} from "../src/validators/facilityDataValidator"

import {userDataGridComponent} from "../src/adminHomePage/components/mainModulesRenders/userGrid";
import {userDataFormComponent} from "../src/adminHomePage/components/forms/userForm"
import {allUsersData} from "../src/adminHomePage/models/allUsersData"
import {userData} from "../src/adminHomePage/models/userData"
import {userDataValidator} from "../src/validators/userValidator"

import { adminTimeBlockDataGridComponent } from "../src/adminHomePage/components/mainModulesRenders/adminTimeBlocksGrid";
import { adminTimeBlockDataFormComponent } from "../src/adminHomePage/components/forms/adminTimeBlockForm";
import {allAdminTimeBlocksData} from "../src/adminHomePage/models/allAdminTimeBlocksData"
import {singleAdminTimeBlockModel} from "../src/adminHomePage/models/timeBlockData"
import { availabilityValidator } from "../src/validators/availabilityValidator"

import { adminTeamsGridComponent } from "../src/adminHomePage/components/mainModulesRenders/teamGrid";
import {adminMainPageAllTeamsData} from "../src/adminHomePage/models/allTeamsData"
import {allTeamsOrderFormComponent} from "../src/adminHomePage/components/forms/allTeamsOrderForm"

import {databasePost} from "../src/databasePost"

window.onload = setScriptData;

async function setScriptData(){
    try{
        const mediaQuery = window.matchMedia('(max-width: 485px)');
        checkWidth(mediaQuery);
        mediaQuery.addEventListener('change', checkWidth)
        const adminPageJSON = await fetch('adminHome/adminData'); //change this to accept userId and season
        const adminPageData = await adminPageJSON.json();
        events.publish("adminDataFetched", adminPageData);
        events.publish("adminDataSet");
        
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
