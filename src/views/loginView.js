import View from "./view.js";
import { errorModal } from "../helpers.js";
import { hideLogin } from "../helpers.js";
import { showrRegister } from "../helpers.js";
import { removeSpinner } from "../helpers.js";

class LoginView extends View {

    #loginMain;
    #indexMain;
    #loginButton;
    #loginUsername;
    #loginPassword;
    #buttonNoAccount;
    #rememberPasswordInput;
    

    constructor(){
        super();
    }

    initializeHTMLelements(){
        this.#loginMain = document.getElementById("login-main");
        this.#indexMain = document.getElementById("index-main");
        this.#loginButton = document.getElementById("login");
        this.#loginUsername = document.getElementById("login-username");
        this.#loginPassword = document.getElementById("login-password");
        this.#buttonNoAccount = document.getElementById("noAccount");
        this.#rememberPasswordInput = document.getElementById("pass");
    }

    _checkUserCredentials(users, transactions){
        if(document.getElementById("modal")) return;
        //If there is somehow current user, it will stop executing, because current user should be make now, it shouldt be created up to now.
        console.log(this.getCurrentUser());
        if(this.getCurrentUser()) return;
        //Temp user
        let usr = "";
        //Chek if there is some user which credentials merges
        users.some(user => {
            if(user.username === this.#loginUsername.value && user.password === this.#loginPassword.value) usr = user;
        });

        //If there is user with right credentials, it set current user to that user, else it will clear current user
        if(usr) this.setCurrentUser(usr)
        else this.setCurrentUser("");

        //If credentials didn't pass, there won't be current user, so normally, that means we entered wrong username or password
        console.log(this.getCurrentUser());
        if(!this.getCurrentUser()) {
            removeSpinner();
            errorModal("Invalid username or password");
            return;
        };

        //If everything goes well, login page hides itself
        hideLogin();
        //For avoiding creating duplicate transactions, the old one should be romved
        if(document.getElementById("index-main")) document.getElementById("index-main").remove();
        //This run transactions
        transactions(this.getCurrentUser());
    };

    async addHandlerLogin(fetchUsers, transactions){
        //If there was current user it will reset it
        this.setCurrentUser("");
        //Always when login page display, the form should be cleaned
        this.clearFormElements([this.#loginUsername, this.#loginPassword]);

        //Event listener for button
        this.#loginButton.addEventListener("click", async function(e){
            this.renderSpinner();
            e.preventDefault();
            
            //Check if form is filled
            if(!this.checkFrom([this.#loginUsername.value, this.#loginPassword.value])){
                removeSpinner();
                errorModal("Please fill form");
                return;
            }
            //Waits for users to fetch
            const users = await fetchUsers();
            //When users fetch, it will check user credentials and if they are right it will run transactions
            this._checkUserCredentials(users, transactions);                
            }.bind(this));
    };

    addHandlerSignUp(){
        this.#buttonNoAccount.addEventListener("click", function(){
            hideLogin();
            showrRegister();
        }.bind(this));
    }
}

export default new LoginView();