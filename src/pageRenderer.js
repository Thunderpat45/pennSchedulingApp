import {events} from "../events"
/* 
purpose: renders full page contents

publishes: 

subscribes to: 
    pageRenderRequests FROM mainPageDOM, availabilityDOM, adminMainPageDOM, adminUserGeneratorDOM, requestFormDOM
*/

const pageRenderer = (function(){
    //no obvious issues here
    events.subscribe("pageRenderRequested", renderPageContent);

    function renderPageContent(page){
        const mainContent = document.getElementsByTagName("main")[0];
        const newMainContent = document.createElement("main");

        newMainContent.appendChild(page);
        mainContent.replaceWith(newMainContent);
    }

})();

export{pageRenderer}