import { events } from "./events";

/*purpose: validator for user dataModel updates

userObject is modeled as such:

    {
        name,
        color,
        privilegeLevel,
        teams:{},
        availability:{},
        lastVerified
    }, 

publishes:
    successful validations FOR adminAllUsersDataModel
   
subscribes to: 
    validation requests FROM adminUserDataModel
*/

const userValidator = (function(){
    //no obvious issues
    events.subscribe("userDataValidationRequested", validateAllInputs);
    
    function validateAllInputs(adminUserData){
        const errorArray = [];

        validateUserName(adminUserData.newData, errorArray); 
        validateColor(adminUserData.newData, errorArray)

        if(errorArray.length > 0){
            const errorAlert = errorArray.join(" ");
            alert(errorAlert);
        }else{
            events.publish("userDataValidated", adminUserData);
        }
    }

    function validateUserName(userModel, array){
        const userName = userModel.name;
        const userNameRegex = /[^A-Za-z0-9]/;
        try{
            if(userNameRegex.test(userName)){
                throw("User names can only include letters and numbers (no spaces or symbols).");
            }else if(userName == ""){
                throw("User name must have a value.");
            }
        }catch(err){
            array.push(err)
        }
    }

    function validateColor(userModel, array){
        const color = userModel.color;
        try{
            if(color == "#000000"){
                throw("Color must have a value not equal to black. Black is default value, and must be changed.")
            }
        }catch(err){
            array.push(err)
        }

    }


})()

export {userValidator}