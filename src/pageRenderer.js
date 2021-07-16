import {events} from "../events"
/* 
actions: renders full page contents

publishes: 

subscribes to: 
    pageRenderRequests from:
        requestDOM
        homePageDOM
*/

const pageRenderer = (function(){

    events.subscribe("renderPage", renderPageContent);

    function renderPageContent(page){
        const mainContent = document.getElementsByTagName("main")[0];
        const newMainContent = document.createElement("main");

        newMainContent.appendChild(page);
        mainContent.replaceWith(newMainContent);
        //publish ???
    }

})();

export{pageRenderer}