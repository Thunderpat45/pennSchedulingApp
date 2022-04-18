import { events } from "../../src/events";

const userDataValidator = (function(){
    
    events.subscribe("userDataValidationRequested", validateAllInputs);

    function validateAllInputs(adminUserData){
       
        const passwordDiv = document.querySelector('#userGeneratorPassword')
        const {userData, origin} = adminUserData
        const errorArray = [];

        validateUserName(userData, errorArray); 
        validateColor(userData, errorArray)
        if(passwordDiv){
            validatePassword(userData, errorArray)
        }
        
        if(errorArray.length > 0){
            events.publish("userDataValidationFailed", {errors: errorArray, origin});
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

    function validatePassword(userModel, array){
        const password = userModel.password;
        const passwordRegex = /[^A-Za-z0-9]/;
        try{
            if(passwordRegex.test(password)){
                throw("Passwords can only include letters and numbers (no spaces or symbols).");
            }else if(password == ""){
                throw("Password must have a value.");
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

export {userDataValidator}