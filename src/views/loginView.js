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
        if(this._getCurrentUser()) return;
        let usr = "";
        users.some(user => {
            if(user.username === this.#loginUsername.value && user.password === this.#loginPassword.value){
                // this._setCurrentUser(user);
                usr = user;
            }
        });
        if(usr) this._setCurrentUser(usr)
        else this._setCurrentUser("");

        if(!this._getCurrentUser()) {
            _errorModal("Invalid username or password");
            return;
        };

        hideLogin();
        if(document.getElementById("index-main")) document.getElementById("index-main").remove();
        transactions(this._getCurrentUser());
    };

    async addHandlerLogin(fetchUsers, transactions){
        this._setCurrentUser("");
        this._clearFormElements([this.#loginUsername, this.#loginPassword]);
        // const users = await fetchUsers();
        this.#loginButton.addEventListener("click", async function(e){
            e.preventDefault();
            // const useri = await fetchUsers();
            
            if(!this._checkFrom([this.#loginUsername.value, this.#loginPassword.value])){
                _errorModal("Please fill form");
                return;
            }
            const users = await fetchUsers();
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