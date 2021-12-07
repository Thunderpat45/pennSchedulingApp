import {events} from "../events"
/* 
purpose: renders full page contents

publishes: 

subscribes to: 
    pageRenderRequests FROM mainPageDOM, availabilityDOM, adminMainPageDOM, adminUserGeneratorDOM, requestFormDOM
*/

const pageRenderer = (function(){
    //THIS NEEDS TO GET USER INFO (NAME AND ADMIN ACCESS)
    events.subscribe("pageRenderRequested", renderPageContent);

    function renderPageContent(page){
        const mainContent = document.getElementsByTagName("main")[0];
        const newMainContent = document.createElement("main");

        newMainContent.appendChild(page);
        mainContent.replaceWith(newMainContent);
    }

    function setName(userData){
        const nameContent = document.querySelector("#userNameLabel")
        nameContent.innerText = userData.name;
    }

    function setDropdownPrivilegeAccess(userData){
        if(userData.admin == true){
            const dropdownContent = document.querySelector("#dropdownContent");
            const logOutButton = document.querySelector("#logOut");
            const userPageButton = document.createElement("p");
            const adminPageButton = document.createElement("p");

            userPageButton.addEventListener("click", publishGetUserPage);
            adminPageButton.addEventListener("click", publishGetAdminPage);

            dropdownContent.insertBefore(userPageButton,logOutButton);
            dropdownContent.insertBefore(adminPageButton,logOutButton);

        }

    }

})();

export{pageRenderer}