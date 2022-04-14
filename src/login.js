import {events} from "../src/events"

import { databasePost } from "../src/databasePost";
import { loginPageRender } from "../src/loginPage/loginPageRender";

window.onload = setScriptData
async function setScriptData(){
    try{
        const mediaQuery = window.matchMedia('(max-width: 485px)');
        checkWidth(mediaQuery);
        mediaQuery.addEventListener('change', checkWidth)
    }catch(err){
        console.log(err)
    }
}

function checkWidth(e){
    if(e.matches){
        const body = document.querySelector('body');
        const newText = document.createElement('p');
        newText.innerText = 'This program is designed for PCs, laptops and tablets, due to general support for XLSX documents on those platforms. Please use one of the recommended devices for best experience.'
        const children = Array.from(document.querySelectorAll('body *'));
        if(children.length >0){
            children.forEach(function(child){
                child.remove();
            })
        }

        body.appendChild(newText)
        throw('Window size not appropriate')
    }
}