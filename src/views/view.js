export default class View {

    #currentUser;
    #parentElement = document.getElementById("body");

    constructor(){

    }

    //Setter for curret user
    setCurrentUser(user){
        this.#currentUser = user;
    }

    //Getter for current user
    getCurrentUser(){
        return this.#currentUser;
    }

    //Recieves array of form elements
    clearFormElements(formElements){
        formElements.forEach(el => el.value = "");
    }

    //Markup is html!
    //Hide element is element which sould be hidden after created markup
    displayMarkup(markup, hideElement){
        hideElement.classList.add("hidden");
        this.#parentElement.insertAdjacentHTML("afterbegin", markup);
    }    

    //Recieves a array of for elements
    checkFrom(formElements){
        return formElements.some(el => el === "") ? false : true;
    };

    renderSpinner(){
        if(document.getElementById("spinnerBackground")) return;
        const markup = `<div id="spinnerBackground"><div class="loading loading--full-height"></div></div>`;
        document.getElementsByTagName("body")[0].insertAdjacentHTML("afterend", markup);
    }
}

