import {events} from "../src/events"

window.onload = setScriptData;

async function setScriptData(){
    try{
        const userPageJSON = await fetch('home/userData.json'); //change this to accept userId and season
        const userPageData = await userPageJSON.json();
        console.log(userPageJSON.body);
        events.publish("userDataFetched", userPageData);
        events.publish("userDataSet");
        
    }catch(err){
        console.log(err)
    }
}