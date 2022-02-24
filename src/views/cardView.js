import View from "./view.js";
import { _errorModal } from "../helpers.js";
import { showLogin } from "../helpers.js";

class CardView extends View {
    #nameOnCard;
    #cardNumber;
    #validThroughOne;
    #validThroughTwo;
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



    async addHandlerProceed(patchUserCreditCard, getUsers, login){
        this.#proceedButton.addEventListener("click", async function(){
            if(!this._checkFrom([this.#nameOnCard.value, this.#cardNumber.value, this.#validThroughOne.value, this.#validThroughTwo.value ,this.#cvv.value])){
                _errorModal("Please fill from!");
                return;
            }
            if(this.#creditCard.cardNumber.length !== 16){
                _errorModal("Please enter valid card number!");
                return;
            }
            if(+this.#validThroughOne.value < 1 || +this.#validThroughOne.value > 12){
                _errorModal("Invalid month!");
                this._clearFormElements([this.#validThroughOne]);
                return;
            }
            if((+this.#validThroughTwo.value === +String(new Date().getFullYear()).slice(2)) && (+this.#validThroughOne.value < ((new Date().getMonth()+1)))){
                _errorModal("Your credit card is not valid!");
                
                this._clearFormElements([this.#validThroughTwo]);
                return;
            }

            
            let user = await getUsers()
            user = user.slice(-1);
            [user] = user;

            
            await patchUserCreditCard(user, this.#creditCard);

            this._clearFormElements([this.#cardNumber, this.#validThroughOne, this.#validThroughTwo, this.#nameOnCard, ]);
            this.#paymentBody.classList.add("hidden");
            document.getElementById("payment-body").remove();
            showLogin();
            login();

        }.bind(this));

    }

    initializeHTMLelements(){
        this.#nameOnCard = document.getElementById("name-on-card");
        this.#cardNumber = document.getElementById("card-number");
        this.#validThroughOne = document.getElementById("card-valid-one");
        this.#validThroughTwo = document.getElementById("card-valid-two");
        this.#cvv = document.getElementById("cvv");
        this.#proceedButton = document.getElementById("proceed");
    
        this.#cardCName = document.getElementById("card-name-card");
        this.#cardCNumber = document.getElementById("numbers");
        this.#cardCValidThrough = document.getElementById("card-valid-card-span");
        this.#cardsInput = document.querySelectorAll(".card-input");
        this.#paymentBody = document.getElementById("payment-body")
    }

    _fillCardValid(object){
        if(object.type === "month") this.#cardCValidThrough.innerText = `${object.value}`; 
        if(object.type === "year") this.#cardCValidThrough.innerText = `${object.value}`; 
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
                this.#creditCard.cardNumber = text;
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

            
            // console.log(el.getAttribute("id") === "card-valid-card-span");
            // let text = "";
            
            if(el.getAttribute("id") === "card-valid-card-span"){
                let text1;
                let text2;
                if(inp.getAttribute("id") === "card-valid-one"){
                    text1 = this.#validThroughOne.value; 
                    text2 = this.#validThroughTwo.value;

                    // const helperString = text;
                    // const restString = `${text.slice(3) ? text.slice(3) : ""}`;
                    this._fillCardValid({type: "month", value: `${text1}/${text2}`});
                    this.#creditCard.validThrough  = `${text1}/${text2}`;
                }
                if(inp.getAttribute("id") === "card-valid-two"){
                    text1 = this.#validThroughOne.value;
                    text2 = this.#validThroughTwo.value; 

                    this._fillCardValid({type: "year", value: `${text1}/${text2}`});
                    this.#creditCard.validThrough  = `${text1}/${text2}`;
                }
            }
            // if(el.getAttribute("id") === "card-valid-card-span"){
            //     text = this.#validThroughTwo.value; 
            //     this._fillCardValid(text);
            //     if(text.length === 4) this.#creditCard.validThrough  = text;
            // }

        }.bind(this)));

    }

}

export default new CardView();