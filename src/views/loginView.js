import View from "./view.js";
import { _errorModal } from "../helpers.js";
import { hideLogin } from "../helpers.js";
import { showrRegister } from "../helpers.js";

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

        users.some(user => {
            if(user.username === this.#loginUsername.value && user.password === this.#loginPassword.value){
                this._setCurrentUser(user);
            };   
        });

        if(!this._getCurrentUser()) return;

        hideLogin();
        transactions(this._getCurrentUser());
    };

    addHandlerLogin(users, transactions){
        this.#loginButton.addEventListener("click", async function(e){
            e.preventDefault();

            if(!this._checkFrom([this.#loginUsername.value, this.#loginPassword.value])){
                _errorModal("Please fill form");
                return;
            }
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