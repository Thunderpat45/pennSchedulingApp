import {events} from "./events"
/* 
purpose: renders full page contents

publishes: 

subscribes to: 
    pageRenderRequests FROM mainPageDOM, availabilityDOM, adminMainPageDOM, adminUserGeneratorDOM, requestFormDOM
    mainPage/adminMainPage model builds
*/

const pageRenderer = (function(){
    
    events.subscribe("mainPageModelBuilt", setNameAndAdminAccess)
    events.subscribe("adminMainPageModelBuilt",setNameAndAdminAccess)
    events.subscribe("pageRenderRequested", renderPageContent);
    
    let name;
    let adminAccess;

    let userPageLink;
    let adminPageLink;

    const nav = document.querySelector("#nav")
    const logOutLink = document.querySelector("#logOutLink");

    logOutLink.addEventListener("click", doTheThing);

    function doTheThing(){} //make this a logOut Function


    function renderPageContent(page){
        const mainContent = document.getElementsByTagName("main")[0];
        const newMainContent = document.createElement("main");

        newMainContent.appendChild(page);
        mainContent.replaceWith(newMainContent);

    }

    function setNameAndAdminAccess(userData){
        name = userData.name;
        adminAccess = userData.privilegeLevel;

        setDropdownPrivilegeAccess();
    }

    function setDropdownPrivilegeAccess(){
        if(adminAccess == true && userPageLink == null && adminPageLink == null){
            userPageLink = document.createElement("h3");
            adminPageLink = document.createElement("h3");

            userPageLink.id = "userPageLink";
            userPageLink.classList.add("navLink");
            userPageLink.innerText = "User Page"

            adminPageLink.id = "adminPageLink";
            adminPageLink.classList.add("navLink");
            adminPageLink.innerText = "Admin Page"
        
            userPageLink.addEventListener("click", publishPageChangeRequest);
            adminPageLink.addEventListener("click", publishPageChangeRequest);

            nav.insertBefore(userPageLink,logOutLink);
            nav.insertBefore(adminPageLink,logOutLink);
        }

        function publishPageChangeRequest(){
            const string = "PageButton"
            const truncateIndex = this.id.indexOf(string);
            const pageIdentifier = this.id.slice(0, truncateIndex);
            
            events.publish("pageChangeRequested", {name, pageIdentifier})
        }  
    }

    return {renderPageContent}


})();

export{pageRenderer}