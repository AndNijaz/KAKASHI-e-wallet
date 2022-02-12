export default class View {

    #currentUser;
    #parentElement = document.getElementById("body");

    constructor(){

    }

    _setCurrentUser(user){
        this.#currentUser = user;
    }

    //Recieves array of form elements
    _clearFormElements(formElements){
        formElements.forEach(el => el.value = "");
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

