import View from "./view";
import { _errorModal } from "../helpers";

class TransactionView extends View {
    #mainRegister = document.getElementById("main-register");
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
    #sort;

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
                    <img src="/assets/hair.png">
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
        this._displayMarkup(markup, this.#mainRegister);

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
                <div>${new Date(mov.date).getDate() + "/" + new Date(mov.date).getMonth()+1 + "/" + new Date(mov.date).getFullYear()}</div>
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

    _pushMovementAppUser(user, value){
        user.movements.push({price: +value, date: new Date()});
    }

    _movementLogic(type, user, value, patchMovementsFunction){
        this._pushMovementAppUser(user, `${type === "deposit" ? +value : -value}`);
        const lastMovement = user.movements.slice(-1)[0];
        this._generateMovementHtmlAndDisplay(lastMovement);
        patchMovementsFunction(user, user.movements);
        this._updateBalance(user);
        this._countInOut(user);
    }

    async _caseDeposit(user, patchCardFunction, patchMovementsFunction){
        const value = this.#depositInput.value;
        if(!value) return;
        user.creditCard.balance -= value;

        if(user.creditCard.balance < 0) {
            _errorModal("You don't have money on credit card!");
            return;
        }
        
        this._movementLogic("deposit", user, value, patchMovementsFunction);

        await patchCardFunction(user, user.creditCard);
        
    }

    async _caseTransfer(user, patchMovementsFunction, fetchUsers){
        let sendTo;
        const users = await fetchUsers();
        const recieverUsername = this.#transferUsernameInput.value;       
        users.forEach(user => {
            if(user.username === recieverUsername){
                sendTo = user;  
            } 
        });

        if(this.#curBal < +this.#transferMoneyInput.value) {
            _errorModal("You don't have money on application!");
            return;
        }

        if(sendTo){
            //This will update for sender
            this._movementLogic("withdraw", user, +this.#transferMoneyInput.value, patchMovementsFunction);
            //This will update for reciever
            this._pushMovementAppUser(sendTo, +this.#transferMoneyInput.value);
            await patchMovementsFunction(sendTo, sendTo.movements);     
        } else {
            _errorModal("Invalid username!");
        }
    }

    transactionsFunctions(patchCardFunction, patchMovementsFunction, fetchUsers){
        const user = this._getCurrentUser();
        this.#transactionsFunction.forEach(tf => tf.addEventListener("click", async function(e){
            if(e.target.getAttribute("id") === "deposit-button"){
                this._caseDeposit(user, patchCardFunction, patchMovementsFunction);
            }

            if(e.target.getAttribute("id") === "transfer-button"){
                this._caseTransfer(user, patchMovementsFunction, fetchUsers);
            }

            if(e.target.getAttribute("id") === "remove-button"){
                this._caseDelete();
            }
 
        }.bind(this)));
    }

    fillHTML(){
        const user = this._getCurrentUser();
        this._setName(user);
        this._setDate();
        this._updateBalance(user);
        this._countInOut(user);
        this._displayMovement(user.movements);
    }


    

}

export default new TransactionView();