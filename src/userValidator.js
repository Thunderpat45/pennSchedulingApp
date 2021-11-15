import { events } from "./events";

/* */

const userValidator = (function(){

    events.subscribe("validateUserEdit", validateAllInputs);
    
    function validateAllInputs(obj){
        const errorArray = [];

        validateUserName(obj.workingModel, errorArray); //modify these parameters
        validatePassword(obj.workingModel, errorArray);

        if(errorArray.length > 0){
            const errorAlert = errorArray.join(" ");
            alert(errorAlert);
        }else{
            events.publish("workingModelValidated", {workingModel : obj.workingModel, teamRequest : obj.teamRequest}); //change this line
        }
    }

    function validateUserName(userModel, array){ //MOVE THIS TO requestFormDOM
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

    function validatePassword(userModel,array){ //MOVE THIS TO requestFormDOM
        const password = userModel.password;
        try{
            if(password.length < 10){
                throw("Passwords must be 10 or more characters.");
            }
        }catch(err){
            array.push(err)
        }
    }


})()

export {userValidator}