
const loginPageRender = (function(){

    const form = document.querySelector('#logInForm')
    const userNameEntry = document.querySelector('#logInUserName');
    const passWordEntry = document.querySelector('#logInPassword');
    const submitButton = document.querySelector('#loginAttemptButton');
    const errorList = document.querySelector('#errorList')

    setEventListeners();

    function setEventListeners(){

        submitButton.addEventListener('click', submitLogInAttempt)

        async function submitLogInAttempt(e){
            unrenderErrorList()

            const errors = testSubmitInput()
            if(errors.length > 0){
                e.preventDefault();
                errors.forEach(function(error){
                    const errorNode = document.createElement('li');
                    errorNode.innerText = error
                    errorList.appendChild(errorNode)
                })
            }else{
                try{
                    form.submit();
                }catch(err){
                    if(err.status == 404){ //check these
                        throw('404 error!')
                    }else if(err.status == 400){
                        throw('400 error!')
                    }else if(err.status == 401){
                        const errorMessage = await err.json();
                        const errorArray = [errorMessage]
                        renderLoginPage(errorArray)
                    }
                }
            }
        }
    }

    function testSubmitInput(){
        const errorArray = []
    
        const regex = /[^A-Za-z0-9]/;
        if(regex.test(userNameEntry.value) || regex.test(passWordEntry.value)){
                const errorText = 'Invalid username/password combination';
                errorArray.push(errorText)
        }

        if(!userNameEntry.value){
                const errorText = 'Username must have value';
                errorArray.push(errorText)
        }

        if(!passWordEntry.value){
                const errorText = 'Password must have value';
                errorArray.push(errorText)
        }

        return errorArray
    }   

    function renderLoginPage(errors){
        userNameEntry.value = "";
        passWordEntry.value = "";

        unrenderErrorList()

        if(errors.length>0){
            errors.forEach(function(error){
                const errorNode = document.createElement('li');
                errorNode.innerText = error
                errorList.appendChild(errorNode)
            })
        }

    }

    function unrenderErrorList(){
        if(errorList.firstChild){
            while(errorList.firstChild){
                errorList.removeChild(errorList.firstChild)
            }
        }
    }

})()

export {loginPageRender}