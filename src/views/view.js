export default class View {

    #parentElement = document.getElementById("body");

    constructor(){

    }

    //Recieves array of form elements
    _clearFormElements(formElements){
        formElements.forEach(el => el.innerText = "");
    }

    _displayMarkup(markup, hideElement){
        hideElement.classList.add("hidden");
        this.#parentElement.insertAdjacentHTML("afterbegin", markup);
    }    

    //fromElements is array!!!
    _checkFrom(formElements){
        return formElements.some(el => el === "") ? false : true;
    };
}

