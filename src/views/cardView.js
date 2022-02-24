import View from "./view.js";
import { errorModal } from "../helpers.js";
import { showLogin } from "../helpers.js";
import  chip  from "../../assets/chip.png";
// let chip = "../../assets/chip.png";

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

    generateHTML(user){
        const markup = `
        <div id="payment-body" class="">

        <section id="payment-header">
            <h1> PAYMENT DETAILS </h1>
        </section>
        <section id="card-holder">
            <div id="credit-card-holder">
                <div id="credit-card">
                    <div id="chip">
                        <img src="${chip}">
                    </div>
                    <div id="numbers">
                        <div class="num">1234</div>
                        <div class="num">5678</div>
                        <div class="num">9101</div>
                        <div class="num">1121</div>
                    </div>
                    <div id="info">
                        <p id="card-name-card"> ${user.firstName} ${user.lastName} </p>
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

                                <span class="expiration">
                                    <input type="text" name="month" placeholder="MM" maxlength="2" size="2" / id="card-valid-one" data-altID="card-valid-card-span" class="card-valid-inp card-input" min="1" max="12">
                                    <span>/</span>
                                    <input type="text" name="year" placeholder="YY" maxlength="2" size="2" / id="card-valid-two" data-altID="card-valid-card-span" class="card-valid-inp card-input">
                                </span>

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
        this.displayMarkup(markup, document.getElementById("main-register"));
    }


    async addHandlerProceed(patchUserCreditCard, getUsers, login){
        let user;
        let users;
        this.#proceedButton.addEventListener("click", async function(){
            //If form isn't filled it will throw error!
            if(!this.checkFrom([this.#nameOnCard.value, this.#cardNumber.value, this.#validThroughOne.value, this.#validThroughTwo.value ,this.#cvv.value])){
                errorModal("Please fill from!");
                return;
            }
            //If user enters invalid credit card number, it will throw error!
            if(this.#creditCard.cardNumber.length !== 16){
                errorModal("Please enter valid card number!");
                return;
            }
            //If user enters invalid valid through month, it will throw error!
            if(+this.#validThroughOne.value < 1 || +this.#validThroughOne.value > 12){
                errorModal("Invalid month!");
                this.clearFormElements([this.#validThroughOne]);
                return;
            }
            //If user enters invalid valid through year and valid through year but passed month, it will throw error!
            if((+this.#validThroughTwo.value === +String(new Date().getFullYear()).slice(2)) && (+this.#validThroughOne.value < ((new Date().getMonth()+1)))){
                errorModal("Your credit card is not valid!");
                this.clearFormElements([this.#validThroughTwo]);
                return;
            }
            if(this.#cvv.value.length < 3){
                errorModal("Invalid cvv!");
                this.clearFormElements([this.#cvv]);
                return;
            }

            //Fetching all users so it can take last one to patch his credit card
            users = await getUsers()
            //Taking last user because last user is newly registred user
            user = users.slice(-1);
            //Destructuring array
            [user] = user;
            
            //Patching credit card to newly created user
            await patchUserCreditCard(user, this.#creditCard);

            //Clears form elements
            this.clearFormElements([this.#cardNumber, this.#validThroughOne, this.#validThroughTwo, this.#nameOnCard, ]);
            //hides payment body
            this.#paymentBody.classList.add("hidden");
            //removes payment body
            document.getElementById("payment-body").remove();
            //shows login
            showLogin();
            //runs login
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

    liveFormInputEvent(){
        this.#cardsInput.forEach(inp => inp.addEventListener("input", function(){
            let text;
            //On input, there is data-altID element which has id name of image credit card elements, so we take its id
            const el = document.getElementById(inp.dataset[Object.keys(inp.dataset)[0]]);
            
            //This happens when user inputs card number
            if(el.getAttribute("id") === "numbers"){
                text = this.#cardNumber.value;
                //This function fills image card number
                this._fillCardNumber(text);
                this.#creditCard.cardNumber = text;
            };

            //This happens when user inputs card name 
            if(el.getAttribute("id") === "card-name-card"){
                text = this.#nameOnCard.value;
                //This is regex flag, it contains all items that username should't contain
                const regex = /[1-9,./*?=()/_:;<>!"#$%&|~ˇ^˘°`˙˝¨-]/g;
                //This checks if text contains something from regex, if does it will reset input and card name!
                if(text.match(regex)){
                    text = "";
                    this.#nameOnCard.value = text;
                    errorModal("Please enter valid card name!");
                    return;
                };
                this._fillNameOnCard(text);
                this.#creditCard.nameOnCard = text;
            }

            //This happens when user inputs cvv
            if(el.getAttribute("id") === "cvv"){
                text = this.#cvv.value;
                this.#creditCard.cvv = text; 
            }

            //This happens when user inputs valid through 
            if(el.getAttribute("id") === "card-valid-card-span"){
                let text1; //text helper1
                let text2; //text helper2
                //If input is valid through input for month
                if(inp.getAttribute("id") === "card-valid-one"){
                    text1 = this.#validThroughOne.value; 
                    text2 = this.#validThroughTwo.value;
                    //This will fill image credit card valid.
                    this._fillCardValid(`${text1}/${text2}`);
                    //This will fill app credit card 
                    this.#creditCard.validThrough  = `${text1}/${text2}`;
                }
                if(inp.getAttribute("id") === "card-valid-two"){
                    text1 = this.#validThroughOne.value;
                    text2 = this.#validThroughTwo.value; 
                    //This will fill image credit card valid.
                    this._fillCardValid({type: "year", value: `${text1}/${text2}`});
                    //This will fill app credit card
                    this.#creditCard.validThrough  = `${text1}/${text2}`;
                }
            }
        }.bind(this)));

    }

}

export default new CardView();