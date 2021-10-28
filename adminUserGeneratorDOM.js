import { events } from "./src/events";

/* */

const adminUserGeneratorDOM = (function(){

    let allUsersList //bad separation of concerns?

    /*let selectorNodes = {
        privilegeLevel:null, 
        color: null //is this valid, right here?
    };

    events.subscribe("selectorsBuilt", setSelectorNodes);

    function setSelectorNodes(obj){
        for(let prop in obj){
            switch(prop){
                case `privilegeLevel`:
                case `color`:
                    selectorNodes[prop] = prop.value;
                    break;
                default:
                    return;
            }  
        }  
    }*/

    events.subscribe("userModelPopulated", publishUserGeneratorPageRender)

    function publishUserGeneratorPageRender(userModel){
        const userGeneratorPage = renderUserGeneratorDOM(userModel);
        events.publish("pageRenderRequested", userGeneratorPage)
    }

    function renderUserGeneratorDOM(userModel){
        const template = document.querySelector("#adminUserGeneratorTemplate");
        const content = document.importNode(template.content, true);
        const userName = content.querySelector("#userGeneratorNameDiv");
        const userPasswordSet = content.querySelector("#userGeneratorPasswordDiv");
        const userPrivilege = content.querySelector("#userPrivilegeDiv");
        const userColor = content.querySelector("#userGeneratorColorDiv");
        const saveButton = content.querySelector("#userGeneratorSaveButton");
        const cancelButton = content.querySelector("#userGeneratorCancelButton");

        saveButton.addEventListener("click", saveUserData) 
        cancelButton.addEventListener("click", cancelUserChanges) //other eventListeners for dataValidation
        
        const userNameNew = renderUserName(userModel) 
        const userPasswordSetNew = renderUserPassword() //this may not be necessary, but consider for validationFunctions
        const userPrivilegeNew = renderUserPrivilege(userModel)
        const userColorNew = renderUserColor(userModel)

        userName.replaceWith(userNameNew);
        userPasswordSet.replaceWith(userPasswordSetNew); //is this right?
        userPrivilege.replaceWith(userPrivilegeNew);
        userColor.replaceWith(userColorNew);
       
        return content
        
        function saveUserData(){
            events.publish("saveUserDataClicked", userModel)
        }

        function cancelUserChanges(){
            events.publish("adminMainPageDOMRequested")
        }
    }

    function renderUserName(userModel){
        const template = document.querySelector("#adminUserGeneratorNameTemplate");
        const content = document.importNode(template.content, true);
        const userName = content.querySelector("#userGeneratorName");
        const userNameNew = document.createElement("input");
        
        userNameNew.type = "text";
        userNameNew.value = userModel.name;

        userNameNew.addEventListener("blur", function modifyTeamNameValue(){ 
            if(userModel.name != userNameNew.value && blockNameDuplication(userNameNew.value) == true){ //make sure userNameNew.value refers to correct location
                alert(`Data already exists for ${userNameNew.value}. Use another name or edit/delete the other user for the name you are trying to switch to.`);
                userNameNew.value = "";
                userNameNew.focus()
            }else if(userNameNew.value == ""){
                alert("User name must have a value");
                userNameNew.focus();
            }   
            else if(userModel.name != "" && userNameNew.value != userModel.name){
                const confirmation = confirm(`If you submit changes, this will change the user name from ${userModel.name} to ${userNameNew.value}. Proceed? `);
                if(confirmation){
                    events.publish("modifyUserNameValue", userNameNew.value)
                }else{
                    userNameNew.value = userModel.name;
                }
            }else{
                events.publish("modifyUserNameValue", userNameNew.value)
            } 
        })

        userName.replaceWith(userNameNew);
        userNameNew.id = "userGeneratorName"

        return content;

        function blockNameDuplication(thisName){//make sure proper object comparision occurs here
            const nameCheck = allUsersList.filter(function(user){
                return user.name == thisName
            })
            return nameCheck.length>0;
        }
    }


    function renderUserPassword(){ //COME BACK TO THIS
        const template = document.querySelector("#adminUserGeneratorPasswordTemplate");
        const content = document.importNode(template.content, true);
        const userPassword = content.querySelector("#userGeneratorPassword");
        const userGeneratorPasswordChangeVerification = content.querySelector("#userGeneratorPasswordChangeVerification");
        const userPasswordNew = document.createElement("input");
        const userGeneratorPasswordChangeVerificationNew = document.createElement("input");

        userPasswordNew.type = "text"
        userPasswordNew.value = ""
        userGeneratorPasswordChangeVerificationNew.type = "checkbox";

        userPasswordNew.addEventListener("blur", function validatePasswordInput(){
            const passwordRegex = /[^A-Za-z0-9]/;
            if(passwordRegex.test(userPasswordNew.value)){
                alert("Passwords can only include letters and numbers (no spaces or symbols).");
                userPasswordNew.value = ""
                userPasswordNew.focus(); 
            }
        })

        if(userGeneratorPasswordChangeVerificationNew.value == "on"){
            const confirmation = confirm("This will overwrite the user's previous password. Continue?")
            if(confirmation){

            }else{}
        }
                
            
        


        userPassword.replaceWith(userPasswordNew);
        userPasswordNew.id = "userGeneratorPassword"

        return content;

    }


    //user password??



    function renderUserPrivilege(userModel){
        const template = document.querySelector("#adminUserGeneratorPrivilegeTemplate");
        const content = document.importNode(template.content, true);
        const userPrivilege = content.querySelector("#userGeneratorPrivilege");
        const userPrivilegeNew = document.createElement("input");

        userPrivilegeNew.type = "radio"
        userPrivilegeNew.value = userModel.privilege

        userPrivilegeNew.addEventListener("change", updateUserPrivilege)

        userPrivilege.replaceWith(userPrivilegeNew);
        userPrivilegeNew.id = "userGeneratorPrivilege"

        return content;

        function updateUserPrivilege(){
            events.publish("") //PUT SOMETHING HERE
        }
    }

    function renderUserColor(){}

})()

export {adminUserGeneratorDOM}