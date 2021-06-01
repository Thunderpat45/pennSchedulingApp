const createNode = function createNode(el, value, innerHTML, array){
    
    //setDOM
    const element = document.createElement(`${el}`)
    
    //setAttributes
    element.value = value || "default";
    element.innerHTML = innerHTML || "--"; 
    
    //pushNode
    array.push(element);

}

function generateOptions(){
    
    const options = {
        options: [],

        updateOptionParameters: function updateOptionParameters(startValue, endValue, incrementer){
            this.startValue = startValue;
            this.endValue = endValue;
            this.incrementer = incrementer
        },

        assignValue: function(){
            if(/*class == dayOfWeek*/){
                /*
                [array of days of week];
                const value = array[i]
                const innerHTML = array[i]
                */
            }else{
                const value = i
                if (/*id == formTeamSize*/){
                    /*
                    const innerHTML = i
                    */
                }else{
                    const innerHTML = numberConvert();
                }
            }
        }
        
        buildDefaultOption: createNode("option", undefined, undefined, options),

        buildNonDefaultOptions: function buildNonDefaultOptions(){
            for(let i = this.startValue; i<this.endValue; i+= this.incrementer){
                assignValue()
                createNode("option",  )

            }
        },
    }
    
}

generateOptions();
    
                    for(let i = details.start; i < details.end; i+= details.incrementer){
                        let newOption = document.createElement("option")
                        if(array){//day of week
                            newOption.setAttribute("value", `${array[i]}`)
                            newOption.innerHTML = `${array[i]}`
                        }else{
                            newOption.setAttribute("value", `${i}`)
                            if(selection.id == "formTeamSize"){//team size
                                newOption.innerHTML = `${i}`
                            }else{//startTime or endTime
                                newOption.innerHTML = `${convertTotalMinutesToStandardTime(i)}` //check location of this
                            }
                        }   
                        selection.appendChild(newOption)