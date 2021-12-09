import {events} from "./events"
/* 
purpose: renders full page contents

publishes: 

subscribes to: 
    pageRenderRequests FROM mainPageDOM, availabilityDOM, adminMainPageDOM, adminUserGeneratorDOM, requestFormDOM
    mainPage/adminMainPage model builds
*/

const pageRenderer = (function(){
    
    events.subscribe("mainPageModelBuilt", copyNameAndAdminAccess)
    events.subscribe("adminMainPageModelBuilt",copyNameAndAdminAccess)
    events.subscribe("pageRenderRequested", renderPageContent);
    
    let name;
    let adminAccess;
   
    const dropdownContent = document.querySelector("#dropdownContent");
    const logOutButton = document.querySelector("#logOut");

    dropdownContent.id = "dropdownContent";
    logOutButton.id = "logOutButton";

    //logOut add eventListener

    function renderPageContent(page){
        const mainContent = document.getElementsByTagName("main")[0];
        const newMainContent = document.createElement("main");

        newMainContent.appendChild(page);
        mainContent.replaceWith(newMainContent);

        setName();
        setDropdownPrivilegeAccess()
    }

    function copyNameAndAdminAccess(userData){
        name = userData.name;
        adminAccess = userData.privilegeLevel
    }

    function setName(){
        const nameContent = document.querySelector("#userNameLabel")
        nameContent.innerText = name;
    }

    function setDropdownPrivilegeAccess(){
        if(adminAccess == true){
            const userPageButton = document.createElement("p");
            const adminPageButton = document.createElement("p");

            userPageButton.id = "userPageButton";
            adminPageButton.id = "adminPageButton"
        
            userPageButton.addEventListener("click", publishPageChangeRequest);
            adminPageButton.addEventListener("click", publishPageChangeRequest);

            dropdownContent.insertBefore(userPageButton,logOutButton);
            dropdownContent.insertBefore(adminPageButton,logOutButton);
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