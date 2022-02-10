export default class View {

    #parentElement = document.getElementById("body");

    constructor(){

    }



    _displayMarkup(markup, hideElement){
        console.log(markup);
        hideElement.classList.add("hidden");
        console.log(this.#parentElement);
        this.#parentElement.insertAdjacentHTML("afterbegin", markup);
    }    

    //fromElements is array!!!
    _checkFrom(formElements){
        return formElements.some(el => el === "") ? false : true;
    };
}

