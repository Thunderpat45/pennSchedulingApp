import { events } from "../../../../src/events";

const userDataGridComponent = (function(){

    events.subscribe("renderUpdatedUserData", renderAdminUsers)

    function renderAdminUsers(adminMainPageData){

        const userGrid = document.querySelector("#adminUsersGrid");
        const userGridNew = document.createElement("div");
        userGridNew.id = "adminUsersGrid";

        adminMainPageData.forEach(function(user){
            const userRow = buildUserRow(user);
            userGridNew.appendChild(userRow);
        })

        userGrid.replaceWith(userGridNew); 
    }

    function buildUserRow(userData){   
        const elements = setTemplateElements();
        setElementsContent(elements, userData);
        setEventListeners(elements, userData)

        return elements.content  
    }

    function setTemplateElements(){
        const template = document.querySelector("#adminMainPageUserGridUserTemplate");
        const content = document.importNode(template.content, true);

        const div = content.querySelector(".adminUserGridUser")

        const name = content.querySelector(".adminUserGridUserName");
        const privilege = content.querySelector(".adminUserGridUserPrivilege");
        const lastVerified = content.querySelector(".adminUserGridUserLastVerified");
        const colorBlock = content.querySelector(".adminUserColor");

        const editButton = content.querySelector(".adminUserGridUserEditButton");
        const deleteButton = content.querySelector(".adminUserGridUserDeleteButton");

        return {content, div, name, privilege, lastVerified, colorBlock, editButton, deleteButton}
    }

    function setElementsContent(userElement, userData){
        userElement.div.setAttribute("data-userId", userData._id)
        userElement.name.innerText = `Name: ${userData.name}`;
        if(userData.privilegeLevel){
            userElement.privilege.innerText = `Privilege: Admin`
        }else{
            userElement.privilege.innerText = `Privilege: User`
        }
        userElement.lastVerified.innerText = `Last Verified: ${userData.lastVerified}`;
        userElement.colorBlock.style.backgroundColor = userData.color
    }

    function setEventListeners(userElement, userData){
        userElement.editButton.addEventListener("click", editUser);
        userElement.deleteButton.addEventListener("click", deleteUser);

        function editUser(){
            events.publish("editUserClicked", userData._id)
        }
        function deleteUser(){
            const confirmation = confirm("Delete this user?");
            if(confirmation){
                events.publish("deleteUserRequested", userData._id)
            }
        }
    }
})()
 
export {userDataGridComponent}
