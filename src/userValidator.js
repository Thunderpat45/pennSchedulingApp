import { events } from "./events";

/* */

const userValidator = (function(){

    events.subscribe("userDataValidationRequested", validateAllInputs);
    
    function validateAllInputs(obj){
        const errorArray = [];

        validateUserName(obj.newData, errorArray); 
        validatePassword(obj.newData, errorArray);

        if(errorArray.length > 0){
            const errorAlert = errorArray.join(" ");
            alert(errorAlert);
        }else{
            events.publish("userDataValidated", obj);
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


})()

export {userValidator}