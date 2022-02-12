import View from "./view.js";
import { _errorModal } from "../helpers.js";
import {showLogin} from "../helpers.js";
import {hideRegister} from "../helpers.js";

class Register extends View{
    #mainRegister = document.getElementById("main-register");
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

    addHandlerSignIn(){
        this.#buttonSignIn.addEventListener("click", ()=> {
            hideRegister();
            showLogin();
        });
    }

    _sendRegistredUser(){
        return this.#user;
    };

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
            balance: 0
        }
    }

    async _createUserObject(users, handler, cardView){

        //If form is not filled, it will return false
        if(!this._checkFrom([this.#firstName.value, this.#lastName.value, this.#email.value, this.#username.value, this.#password.value, this.#cPassword.value])){
            _errorModal("Please fill form!");
            return;
        };
        
        //If there is duplicate username, it will return false
        if(!this._checkUsername(users)){
            _errorModal("Username already in use!");
            return;
        }

        //If passwords don't match it will return false
        if(!this._checkPassword()) {
            _errorModal("Password don't match!");
            return; 
        }

        //If cookies arent checked, it will return false
        if(!this._checkCookies()){
            _errorModal("Please check cookies!");
            return;
        }


        //If form is filled, no existing username, password match, cookies accepted, create user object
        this._createViewUserObject();

        //This sends data to api
        await handler(this.#user);
        

        //Clear form elements
        this._clearFormElements([this.#firstName, this.#lastName, this.#email, this.#username, this.#password, this.#cPassword, ]);

        //Generate markup
        this._generaterPaymentMarkup(cardView);

        //Run card view functions
        cardView();

    };

    _generaterPaymentMarkup(){
        const markup = `
        <div id="payment-body" class="">

        <section id="payment-header">
            <h1> PAYMENT DETAILS </h1>
        </section>
        <section id="card-holder">
            <div id="credit-card-holder">
                <div id="credit-card">
                    <div id="chip">
                        <img src="/assets/chip.png">
                    </div>
                    <div id="numbers">
                        <div class="num">1234</div>
                        <div class="num">5678</div>
                        <div class="num">9101</div>
                        <div class="num">1121</div>
                    </div>
                    <div id="info">
                        <p id="card-name-card"> ${this.#user.firstName} ${this.#user.lastName} </p>
                        <p> Valid through: <span id="card-valid-card-span">02/22</span></p>
                    </div>
                </div>
            </div>
            <div id="form-holder">
                <form>
                    <div id="data-inputs">
                        <div class="form-row" id="name-row">
                            <div class="input-text">
                                <p>Name on card</p>
                            </div>
                            <div class="inputs-place">
                                <input type="text" placeholder="Name Surname" class="input-card card-input" id="name-on-card" data-altID="card-name-card">
                            </div> 
                        </div>    
                        
                        <div class="form-row" id="card-row">
                            <div class="input-text">
                                <p>Card Number</p>
                            </div>
                            <div class="inputs-place">
                                <input type="number" placeholder="1234 5678 9101 1121" maxlength="16"  class="input-card card-input" id="card-number" data-altID="numbers"
                                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                                >
                            </div> 
                        </div>    
                        
                        <div class="form-row" id="valid-row">
                            <div class="input-texts">
                                <p>Valid Through</p>
                                <p>CVV</p>
                            </div>
                            <div class="inputs-place">
                                <input type="text" placeholder="02/22" class="input-card sinput card-input" id="valid" maxlength="4" data-altID="card-valid-card-span">
                                <input type="number" placeholder="201" class="input-card sinput card-input" id="cvv" maxlength="3" 
                                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                                data-altID="cvv">
                            </div> 
                        </div>
                    </div>
                </form>
            </div>
        </section>
        <section id="button-holder">
            <button type="button" class="button" id="proceed">Proceed</button>
        </section>
        </div>
        `;

        //Display markup and hide previous site
        this._displayMarkup(markup, this.#mainRegister);

    }

    addHandlerSignUp(users, handler, cardView){
        this.#buttonSignUp.addEventListener("click", this._createUserObject.bind(this, users, handler, cardView));
    }

}

export default new Register();