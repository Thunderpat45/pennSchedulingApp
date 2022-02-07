//ADMIN USERS DIV
import { events } from "../../events";


 //no obvious issues with this or dataModel, display is usersGrid and addUserButton
 function renderAdminUsers(adminMainPageData){
    
                        //add this back to adminHomePage to NOT be rerendered each time
                        const addUserButton = document.querySelector("#adminUsersGridAddUser"); 
                        addUserButton.addEventListener("click", addUser)

                        function addUser(){
                            events.publish("addUser")
                        }
                        //add this back to adminHomePage to NOT be rerendered each time
    
    const userGrid = document.querySelector("#adminUsersGrid");
    const userGridNew = document.createElement("div");
    userGridNew.id = "adminUsersGrid";

    adminMainPageData.forEach(function(user){
        const userRow = buildUserRow(user);
        userGridNew.appendChild(userRow);
    })

    userGrid.replaceWith(userGridNew); 
}


//userRow display is: name, privilegeLevel, color, lastVerified date, edit and deleteButtons
function buildUserRow(userData){   
    const elements = setTemplateElements();
    setElementsContent(elements, userData);
    setEventListeners(elements, userData)

    return elements.content  
}


function setTemplateElements(){
    const template = document.querySelector("#adminMainPageUserGridUserTemplate");
    const content = document.importNode(template.content, true);

    const name = content.querySelector(".adminUserGridUserName");
    const privilege = content.querySelector(".adminUserGridUserPrivilege");
    const lastVerified = content.querySelector(".adminUserGridUserLastVerified");
    const colorBlock = content.querySelector(".adminUserColor");

    const editButton = content.querySelector(".adminUserGridUserEditButton");
    const deleteButton = content.querySelector(".adminUserGridUserDeleteButton");

    return {content, name, privilege, lastVerified, colorBlock, editButton, deleteButton}
}


function setElementsContent(userElement, userData){
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
        events.publish("editUser", userData)
    }
    function deleteUser(){
        events.publish("deleteUser", userData)	
    }
}


export {renderAdminUsers}
