import { events } from "./events";

/*purpose: validator for user dataModel updates

userObject is modeled as such:

    {
        name,
        color,
        password, //MAKE SURE THIS DOES NOT GET PASSED TO FRONT END
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
    //no obvious issues, maybe add more depth to regex, especially for passwords, as I learn more
    events.subscribe("userDataValidationRequested", validateAllInputs);
    
    function validateAllInputs(adminUserData){
        const errorArray = [];

        validateUserName(adminUserData.newData, errorArray); 
        validatePassword(adminUserData.newData, errorArray);
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

    function validatePassword(userModel,array){
        const password = userModel.password;
        const userPasswordRegex = /[^A-Za-z0-9]/
        try{
            if(userPasswordRegex.test(password)){
                throw("User names can only include letters and numbers (no spaces or symbols).");
            }else if(password.length < 10){
                throw("Passwords must be 10 or more characters.");
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