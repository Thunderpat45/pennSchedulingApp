function createNode(el, value, innerHTML, array){

    const domNode = {
        
        addNode: function(el, value, innerHTML, array){
            this.setDom(el);
            this.setAttributes(value, innerHTML);
            this.pushOption(array);
        },
        
        setDom: function(el){
            this.el = document.createElement(`${el}`)
        },

        setAttributes: function(value = "default", innerHTML = "--"){
            this.option.value = value;
            this.option.innerHTML = innerHTML;
        },

        pushNode: function(array){
            array.push(this.el);
        }


    };

    domNode.addNode(el, value, innerHTML, array)

}

function generateOptions(){
    
    const options = {
        options: [],

        updateOptionParameters: function updateOptionParameters(){},
        
        buildDefaultOption: createNode("option", undefined, undefined, options),

        buildNonDefaultOptions: function buildNonDefaultOptions(){
            for()
        }
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