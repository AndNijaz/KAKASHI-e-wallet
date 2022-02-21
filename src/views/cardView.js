import View from "./view.js";
import { _errorModal } from "../helpers.js";
import {showLogin} from "../helpers.js";

class CardView extends View {
    #nameOnCard;
    #cardNumber;
    #validThrough;
    #cvv;
    #proceedButton; 

    #cardCName;
    #cardCNumber; 
    #cardCValidThrough; 
    #cardsInput;
    #paymentBody; 

    #creditCard = {
        nameOnCard: "",
        cardNumber: "",
        validThrough: "",
        cvv: "",
        balance: 10000
    }

    constructor(){
        super();
    }

    _creditFormFilled(){
        return Object.values(this.#creditCard).some(property => (property === "" || property === undefined)) ? true : false;
    }

    async addHandlerProceed(patchUserCreditCard, getUsers, login){
        this.#proceedButton.addEventListener("click", async function(){
            //If form isn't filled, it will return true
            if(this._creditFormFilled()){
                _errorModal("Please fill from!");
                return;
            }

            
            let user = await getUsers()
            user = user.slice(-1);
            [user] = user;

            
            await patchUserCreditCard(user, this.#creditCard);

            this._clearFormElements([this.#cardNumber, this.#validThrough, this.#nameOnCard, ]);
            this.#paymentBody.classList.add("hidden");
            document.getElementById("payment-body").remove();
            showLogin();
            login();

        }.bind(this));

    }

    initializeHTMLelements(){
        this.#nameOnCard = document.getElementById("name-on-card");
        this.#cardNumber = document.getElementById("card-number");
        this.#validThrough = document.getElementById("valid");
        this.#cvv = document.getElementById("cvv");
        this.#proceedButton = document.getElementById("proceed");
    
        this.#cardCName = document.getElementById("card-name-card");
        this.#cardCNumber = document.getElementById("numbers");
        this.#cardCValidThrough = document.getElementById("card-valid-card-span");
        this.#cardsInput = document.querySelectorAll(".card-input");
        this.#paymentBody = document.getElementById("payment-body")
    }

    _fillCardValid(text){
        let txt;
        let txthelp = text.slice(0, 2);
        if(txthelp > -1 && txthelp < 13 && txthelp !== undefined) {
            txt = txthelp + "/" + text.slice(2, 5);
            this.#cardCValidThrough.innerText = txt;
        } else {
            text = "";
            this.#validThrough.value = text;
            _errorModal("Invalid month!");
        }
    }

    _fillNameOnCard(text){
        this.#cardCName.innerText = text;
    }

    _fillCardNumber(text){
        const allNums = document.querySelectorAll(".num");
        
        let a=0, b=4;
        allNums.forEach(num => {
            num.innerText = text.slice(a, b);
            a += 4;
            b += 4;
        });
}

    _liveFormInputEvent(){
        this.#cardsInput.forEach(inp => inp.addEventListener("input", function(){
            let text;
            const el = document.getElementById(inp.dataset[Object.keys(inp.dataset)[0]]);

            if(el.getAttribute("id") === "numbers"){
                text = this.#cardNumber.value;
                this._fillCardNumber(text);
                if(text.length === 16) this.#creditCard.cardNumber = text;
            };

            if(el.getAttribute("id") === "card-name-card"){
                text = this.#nameOnCard.value;
                const regex = /[1-9,./*?=()/_:;<>!"#$%&|~ˇ^˘°`˙˝¨-]/g;
                if(text.match(regex)){
                    text = "";
                    this.#nameOnCard.value = text;
                    _errorModal("Please enter valid card name!");
                    return;
                };

                this._fillNameOnCard(text);
                this.#creditCard.nameOnCard = text;
            }

            if(el.getAttribute("id") === "cvv"){
                text = this.#cvv.value;
                if(text.length === 3) this.#creditCard.cvv = text; 
            }

            if(el.getAttribute("id") === "card-valid-card-span"){
                text = this.#validThrough.value; 
                this._fillCardValid(text);
                if(text.length === 4) this.#creditCard.validThrough  = text;
            }

        }.bind(this)));

    }

}

export default new CardView();