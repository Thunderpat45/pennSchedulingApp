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

import {databasePost} from "../src/databasePost"

window.onload = setScriptData;

async function setScriptData(){
    try{
        const adminPageJSON = await fetch('adminHome/adminData.json'); //change this to accept userId and season
        const adminPageData = await adminPageJSON.json();
        console.log(adminPageData)
        events.publish("adminDataFetched", adminPageData);
        events.publish("adminDataSet");
        
    }catch(err){
        console.log(err)
    }
}
