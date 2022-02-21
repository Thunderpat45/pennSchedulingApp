import {events} from "../../../src/events"

const homeMain = (function(){

    events.subscribe("homeDataSet", setHomeEventListeners);

    function setHomeEventListeners(){
        setAvailabilityEventListeners();
    }

    function setAvailabilityEventListeners(){
        const availabilityEditButton = document.querySelector("")
    }

})()