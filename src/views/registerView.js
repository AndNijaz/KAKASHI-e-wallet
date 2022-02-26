import View from "./view.js";
import { errorModal } from "../helpers.js";
import { showLogin } from "../helpers.js";
import { hideRegister } from "../helpers.js";
import { removeSpinner } from "../helpers.js";


class Register extends View{
    #firstName = document.getElementById("first-name-inp");
    #lastName = document.getElementById("last-name-inp");
    #email = document.getElementById("mail-inp");
    #username = document.getElementById("username-inp");
    #password = document.getElementById("password-inp");
    #cPassword = document.getElementById("confirm-password-inp");
    #cookies = document.getElementById("terms");
    #buttonSignUp = document.getElementById("sign-up");
    #buttonSignIn = document.getElementById("sign-in");

    #user;


    constructor(){
        super();
    }

    addHandlerSignIn(loginView){
        this.#buttonSignIn.addEventListener("click", function(){
            console.log("signclicked");
            hideRegister();
            this.clearFormElements([this.#firstName, this.#lastName, this.#email, this.#username, this.#password, this.#cPassword]);
            showLogin();
            loginView();
         }.bind(this));
    }

    _sendRegistredUser(){
        return this.#user;
    };

    _checkMail(){
        let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if((this.#email.value).match(regexEmail)) return true;
        else return false;
    }

    //As argument recieves users array
    _checkUsername(users){
        return users.some(user => user.username === this.#username.value) ? false : true;
    }

    _checkCookies(){
        return this.#cookies.checked;
    }

    _checkPassword(){
        return this.#password.value === this.#cPassword.value;
    }

    _createViewUserObject(){
         this.#user = {
            firstName: this.#firstName.value,
            lastName: this.#lastName.value,
            email: this.#email.value,
            username: this.#username.value,
            password: this.#password.value,
            creditCard: {},
            movements:[],
        }
    }

    async _createUserObject(fetchUsers, sendUser, cardView){
        this.renderSpinner();
        //Fetching users
        const users = await fetchUsers();
        //If form is not filled, it will return false
        if(!this.checkFrom([this.#firstName.value, this.#lastName.value, this.#email.value, this.#username.value, this.#password.value, this.#cPassword.value])){
            removeSpinner();
            errorModal("Please fill form!");
            return;
        };

        //If email format is not good, it will return false
        if(!this._checkMail()){
            removeSpinner();
            errorModal("Invalid email format!")
            return;
        }
        
        //If there is duplicate username, it will return false
        if(!this._checkUsername(users)){
            removeSpinner();
            errorModal("Username already in use!");
            return;
        }

        //If passwords don't match it will return false
        if(!this._checkPassword()) {
            removeSpinner();
            errorModal("Password don't match!");
            return; 
        }

        //If cookies arent checked, it will return false
        if(!this._checkCookies()){
            removeSpinner();
            errorModal("Please check cookies!");
            return;
        }


        //If form is filled, no existing username, password match, cookies accepted, create user object
        this._createViewUserObject();

        //This sends data to api
        await sendUser(this.#user);
        
        //Clear form elements
        this.clearFormElements([this.#firstName, this.#lastName, this.#email, this.#username, this.#password, this.#cPassword, ]);

        //Run card view functions
        cardView(this.#user);

    };

    addHandlerSignUp(fetchUsers, sendUser, cardView){
        this.#buttonSignUp.addEventListener("click", this._createUserObject.bind(this, fetchUsers, sendUser, cardView));
    }

}

export default new Register();