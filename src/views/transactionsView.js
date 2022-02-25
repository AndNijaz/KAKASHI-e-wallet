import View from "./view.js";
import { errorModal } from "../helpers.js";
import { showLogin } from "../helpers.js";
import hair from "../../assets/hair.png";
import { removeSpinner } from "../helpers.js";
// let hair = "../../assets/hair.png";

class TransactionView extends View {
    #mainRegister = document.getElementById("main-register");
    #sort = "toUP"
    #curBal;

    #movementsContainer;
    #depositInput;
    #updateBalance;
    #transactionsFunction;
    #transferUsernameInput;
    #transferMoneyInput;
    #delAccountUsername;
    #delAccountPW;
    #setNameSpan;
    #asOfDateSpan;
    #inMoney;
    #outMoney;
    #sortMoney;
    #sortSpan;
    #logOut;
    #transferCard;

    constructor(){
        super();
    }

    initializeHTMLelements(){
        this.#movementsContainer = document.getElementById("transactions-page");
        this.#depositInput = document.getElementById("deposit-input");
        this.#updateBalance = document.getElementById("updatable-balance");

        this.#transactionsFunction = document.querySelectorAll(".buttonI");
        this.#transferUsernameInput = document.getElementById("transfer-username");
        this.#transferMoneyInput = document.getElementById("transfer-money");

        this.#delAccountUsername = document.getElementById("del-account-username");
        this.#delAccountPW = document.getElementById("del-account-pw");
        this.#setNameSpan = document.getElementById("set-name")
        this.#asOfDateSpan = document.getElementById("as-of-date");

        this.#inMoney = document.getElementById("in-money");
        this.#outMoney = document.getElementById("out-money");
        this.#sortMoney = document.getElementById("sort-money");
        this.#sortSpan = document.getElementById("sort-span");
        this.#logOut = document.getElementById("log-out");
        this.#transferCard = document.getElementById("transfer-on-card");
        this.#sort = "toUP";
    }

    

    generateHTML(){
        const markup = `
        <div id="index-main" class="">
            
            <header id="index-header">
                <div id="paragraph-holder">
                    <p> Good evening, <span id="set-name"></span>!</p>
                </div>
                <div id="logo-holder">
                    <img src="${hair}">
                </div>
            </header>

            <div id="main-part-container">
                
                <div id="balance-header">
                    <div id="balance-header-holder">
                        <div>
                            <p>Current balance</p>
                            <p>As of <span id="as-of-date"></span></p>
                        </div>
                        <p><span id="updatable-balance"></span> KM</p>
                    </div>
                </div>
                
                
                <div id="functions-part">

                    <div id="transactions-page"></div>

                    <div id="transactions-functions">
                        <div id="deposit" class="func">
                            <p>Deposti money</p>
                            <div id="deposit-form-box">
                                <form>
                                    <input type="text" class="input-index" id="deposit-input" placeholder="Price">
                                    <button type="button" class="buttonI" id="deposit-button">&#8594;</button>
                                </form>
                            </div>
                        </div>
                        <div id="transfer" class="func">
                            <p>Transfer money</p>
                            <div id="transfer-form-box">
                                <form>
                                    <input type="text" class="input-index" id="transfer-username" placeholder="Username">
                                    <input type="text" class="input-index" id="transfer-money" placeholder="Price">
                                    <button type="button" class="buttonI" id="transfer-button" >&#8594;</button>
                                </form>
                            </div>
                        </div>
                        <div id="close-account" class="func">
                            <p>Remove account</p>
                            <div id="close-form-box">
                                <form>
                                    <input type="text" class="input-index" id="del-account-username" placeholder="Username">
                                    <input type="password" class="input-index" id="del-account-pw" placeholder="Password">
                                    <button type="button" class="buttonI" id="remove-button">&#8594;</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="data-part">
                    <div id="left-part">
                        <p>IN: <span id="in-money"></span> KM</p> 
                        <p>OUT: <span id="out-money"></span> KM</p>
                        <button id="sort-money">SORT: <span id="sort-span">&#8593;</span></button>
                    </div>
                    <div id="right-part">
                        <button type="button" class="buttonC" id="transfer-on-card"> Transfer on card </button>
                        <button type="button" class="buttonC" id="log-out"> Log out </button>
                    </div>
                </div>
            </div>
        </div>
        `


        this.displayMarkup(markup, this.#mainRegister);

    }

    _countInOut(user){
        let deposits = 0;
        let withdrawals = 0;
        user.movements.forEach(mov => {
            if(+mov.price > 0) deposits += +mov.price;
            else withdrawals += +mov.price;
        })
        // if(!deposits) inMoney.innerText = 0;
        // else inMoney.innerText = deposits;
        !deposits ? this.#inMoney.innerText = 0 : this.#inMoney.innerText = deposits;
        // if(!withdrawals) outMoney.innerText = 0;
        // else outMoney.innerText = withdrawals;
        !withdrawals ? this.#outMoney.innerText = 0 : this.#outMoney.innerText = withdrawals;
    }

    _updateBalance(user){

        this.#curBal = 0;
        user.movements.forEach(mov => {
            this.#curBal += +mov.price;
        });

        this.#updateBalance.innerText = this.#curBal;

    }

    _setDate(){
        const date = new Date();
        // asOfDateSpan.innerText = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`; 
        this.#asOfDateSpan.innerText = `${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}/${(date.getMonth()+1) < 10 ? "0" + (date.getMonth()+1) : date.getMonth()+1}/${date.getFullYear()}, ${date.getHours()}:${date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes() }` 
    }

    _setName(user){
        this.#setNameSpan.innerText = user.firstName;
    }
    
    _generateMovementHtmlAndDisplay(mov){
        const html = `
        <div class="transaction">
            <div class="t-div">
                <div class="${mov.price > 0 ? "deposit" : "withdraw"}">${mov.price > 0 ? "Deposit" : "Withdraw"}</div>
                <div class="date-child">${new Date(mov.date).getDate() + "/" + new Date(mov.date).getMonth()+1 + "/" + new Date(mov.date).getFullYear()}</div>
                ${mov.reciever ? `<div>${mov.reciever}</div>` : ""}
            </div>
                <div>${mov.price} KM</div>
            </div>
            `
        this.#movementsContainer.insertAdjacentHTML("afterbegin", html);
    }

    _displayMovement(movements){
        movements.forEach(mov => {
            this._generateMovementHtmlAndDisplay(mov);
        });
    }

    _pushMovementAppUser(user, value, reciever = ""){
        user.movements.push({price: +value, date: new Date(), reciever});
    }

    async _movementLogic(type, user, value, patchMovementsFunction, reciever = ""){
        //This function push movement to user (in javascript);
        this._pushMovementAppUser(user, `${type === "deposit" ? +value : -value}`, reciever);
        //This takes last movement (movement pushed in last section)
        const lastMovement = user.movements.slice(-1)[0];
        //This will generate html and insert in movements container for movement
        this._generateMovementHtmlAndDisplay(lastMovement);
        //This will patch user movements
        await patchMovementsFunction(user, user.movements);
        //This will update balance on app
        this._updateBalance(user);
        //This will update countInOut on app
        this._countInOut(user);
    }

    async _caseDeposit(user, patchCardFunction, patchMovementsFunction, fetchUsers){
        //Guard clausue (if serverd doesent work, it wont be able to fetch users and it will autmatically throw error. We'll see if the server works it will be able to fetch users)
        if(!await fetchUsers()) return;

        //Gets money value from input
        const value = this.#depositInput.value;
        //If there is no money in input, it wont be possible to deposit (avoiding depositin 0)
        if(!value) return;
        
        //Check if there is balance on credit card
        if(user.creditCard.balance < 0) {
            errorModal("You don't have money on credit card!");
            return;
        }
        //Removes balance from user credit card
        user.creditCard.balance -= value;
        //This does everything with movement what should be done
        this._movementLogic("deposit", user, value, patchMovementsFunction);
        //After everything finishes it patch credit card because money is taken from credit card
        await patchCardFunction(user, user.creditCard);
        
    }

    async _caseTransfer(user, patchMovementsFunction, fetchUsers){
        //This will make temp variable for reciever
        let sendTo;
        //Fetchig all users
        const users = await fetchUsers();
        
        const recieverUsername = this.#transferUsernameInput.value;       

        //Checking if there is any user same as reciever username, if there is, it will set temp reciever variable to that user
        users.forEach(function(us){
            if(us.username === recieverUsername) sendTo = us;  
        });

        //This will check if there is current money on app, if there is not it will throw error
        if(this.#curBal < +this.#transferMoneyInput.value) {
            errorModal("You don't have money on application!");
            return;
        }
        
        //If there is no reciever it will return and throw error for invalid username 
        if(!sendTo){
            errorModal("Invalid username!");
            return;
        }

        // if(sendTo){
        if(user._id === sendTo._id) {
            errorModal("You can't transfer money to yourself!");
            return;
        };

        //This will update for sender/current user
        this._movementLogic("withdraw", user, +this.#transferMoneyInput.value, patchMovementsFunction, sendTo.username);

        //This will update for reciever
        this._pushMovementAppUser(sendTo, +this.#transferMoneyInput.value);
        await patchMovementsFunction(sendTo, sendTo.movements);     

    }

    async _caseDelete(user, removeAccount, login, fetchUsers){
        const deleteUsername = this.#delAccountUsername.value;
        const deletePassword = this.#delAccountPW.value;

        if(!(user.username === deleteUsername && user.password === deletePassword)){
            removeSpinner();
            errorModal("Invalid username or password!");
            return;
        }
        
        // if(user.username === deleteUsername && user.password === deletePassword){
        //Guard clausue (if serverd doesent work, it wont be able to fetch users and it will autmatically throw error. We'll see if the server works it will be able to fetch users)
        if(!await fetchUsers()) return;
        await removeAccount(user);
        this.setCurrentUser("");
        // } 
        // else {
            //     errorModal("Invalid username or password!");
            // }
        //If there is current user somehow, it wont execute remove.    
        if(this.getCurrentUser()) return;
        document.getElementById("index-main").remove();
        showLogin();
        login();
    }

    transactionsFunctions(patchCardFunction, patchMovementsFunction, fetchUsers, removeAccount, login){
        const user = this.getCurrentUser();
        this.#transactionsFunction.forEach(tf => tf.addEventListener("click", function(e){
            if(e.target.getAttribute("id") === "deposit-button"){
                this._caseDeposit(user, patchCardFunction, patchMovementsFunction, fetchUsers);
            }

            if(e.target.getAttribute("id") === "transfer-button"){
                this._caseTransfer(user, patchMovementsFunction, fetchUsers);
            }

            if(e.target.getAttribute("id") === "remove-button"){
                this.renderSpinner();
                this._caseDelete(user, removeAccount, login, fetchUsers);
            }
 
        }.bind(this)));
    }

    fillHTML(){
        const user = this.getCurrentUser();
        this._setName(user);
        this._setDate();
        this._updateBalance(user);
        this._countInOut(user);
        this._displayMovement(user.movements);
    }


    addHandlerLogOut(login){
        this.#logOut.addEventListener("click", function(){
            this.setCurrentUser("");
            document.getElementById("index-main").remove();
            showLogin();
            login();
        }.bind(this));
    }
    
    addHandlerTransferOnCard(patchUserCreditCard, patchMovementsFunction){
        const user = this.getCurrentUser();
        this.#transferCard.addEventListener("click", async function(){
            if(this.#curBal === 0) {
                errorModal("You don't have money on account!")
                return;
            };
            user.creditCard.balance = user.creditCard.balance + this.#curBal;
            this._movementLogic("withdraw", user, this.#curBal, patchMovementsFunction, "Credit Card");

            await patchUserCreditCard(user, user.creditCard);
        }.bind(this));
    }

    _sortMovementsLogic(movements){
        console.log(this.#sort);
        this.#sortSpan.innerHTML = `${this.#sort === "toUP" ? "\&#8595" : "\&#8593"}`;
        movements.sort(function(a, b){
            return `${this.#sort === "toUP" ? a.price-b.price : b.price-a.price}`
        }.bind(this));
        this.#movementsContainer.innerHTML = "";
        this._displayMovement(movements);
        this.#sort = `${this.#sort === "toUP" ? "toLower" : "toUP"}`
        console.log(this.#sort);
    }
    
    addHandlerSort(){
        this.#sortMoney.addEventListener("click", function(){
            console.log("clciked");
            this._sortMovementsLogic(this.getCurrentUser().movements);
        }.bind(this));
    }
}

export default new TransactionView();