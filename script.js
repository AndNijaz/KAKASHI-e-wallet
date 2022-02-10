
// const { text } = require("stream/consumers");

///////////////////////////////////////////////////////////////////////
// register form //
const mainRegister = document.getElementById("main-register");
const firstName = document.getElementById("first-name-inp");
const lastName = document.getElementById("last-name-inp");
const email = document.getElementById("mail-inp");
const username = document.getElementById("username-inp");
const password = document.getElementById("password-inp");
const cPassword = document.getElementById("confirm-password-inp");
const mailNotf = document.getElementById("mail");
const cookies = document.getElementById("terms");
const buttonSignUp = document.getElementById("sign-up");
const buttonSignIn = document.getElementById("sign-in");

///////////////////////////////////////////////////////////////////////
// credit card form //
const nameOnCard = document.getElementById("name-on-card");
const cardNumber = document.getElementById("card-number");
const validThrough = document.getElementById("valid");
const cvv = document.getElementById("cvv");
const proceedButton = document.getElementById("proceed");

const cardCName = document.getElementById("card-name-card");
const cardCNumber = document.getElementById("numbers");
const cardCValidThrough = document.getElementById("card-valid-card-span");
const cardsInput = document.querySelectorAll(".card-input");
const paymentBody = document.getElementById("payment-body")


///////////////////////////////////////////////////////////////////////
// login form //
const loginMain = document.getElementById("login-main");
const indexMain = document.getElementById("index-main");
const loginButton = document.getElementById("login");
const loginUsername = document.getElementById("login-username");
const loginPassword = document.getElementById("login-password");
const buttonNoAccount = document.getElementById("noAccount");
const rememberPasswordInput = document.getElementById("pass");

///////////////////////////////////////////////////////////////////////
// Index form //
const movementsContainer = document.getElementById("transactions-page");
const depositInput = document.getElementById("deposit-input");
const updateBalance = document.getElementById("updatable-balance");

const transactionsFunction = document.querySelectorAll(".buttonI");
const transferUsernameInput = document.getElementById("transfer-username");
const transferMoneyInput = document.getElementById("transfer-money");

const delAccountUsername = document.getElementById("del-account-username");
const delAccountPW = document.getElementById("del-account-pw");
const setNameSpan = document.getElementById("set-name")
const asOfDateSpan = document.getElementById("as-of-date");

const inMoney = document.getElementById("in-money");
const outMoney = document.getElementById("out-money");
const sortMoney = document.getElementById("sort-money");
const sortSpan = document.getElementById("sort-span");
const logOut = document.getElementById("log-out");
const transferCard = document.getElementById("transfer-on-card");
let sort = "toUP";


class User {
    
    constructor(firstName, lastName, email, username, password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.username = username;
        this.password = password;
        this.creditCard = {};
        this.movements = [];
        this.balance = 0;
    }
}

class CreditCard {
    
    constructor(nameOnCard, cardNumber, validThrough, cvv){
        this.nameOnCard = nameOnCard;
        this.cardNumber = cardNumber;
        this.validThrough = validThrough;
        this.cvv = cvv; 
        this.balance = 10000;
    }
}

class app {
    
    #creditCard;
    
    #firstName;
    #lastName;
    #email;
    #username;
    #password;
    #confirm;
    #userCreated;
    #user;
    
    
    
    #cardNumber;
    #cardValid;
    #cardCVV;
    #cardName;
    
    #movements;
    
    #currentUser;
    
    //login
    #currentUsername;
    #currentPassword;
    #users;
    #curBal = 0;

    #transferUsername;

    #deleteUsername;
    #deletePassword;
    

    constructor(){
        //When the register page loads call this function
        this._signUpEvent();
        this._signInEvent();
        this._noAccountEvent();
        this._cardInputEvent();
        this._cardProcedEvent();
        this._loginLoad();
        this._loginButtonEvent();
        this._sortEvent();
        this._logOut();
        this._transferOnCard();
    };

    //Transfer all balance from account on card
    _transferOnCard(){
        if(!transferCard) return;
        transferCard.addEventListener("click", async function(){
            if(this.#curBal === 0) this._errorModal("You don't have money on account!");
            this.#currentUser.creditCard.balance = this.#currentUser.creditCard.balance + this.#curBal;
            this._producing("withdraw", this.#curBal);

            await this._patchUserWithCard(this.#currentUser._id, this.#currentUser.creditCard);
            // this.#curBal;
        }.bind(this));
    }
    
    // Log out function    
    _logOut(){
        if(!logOut) return;
        logOut.addEventListener("click", function(){
            location.reload();
        }.bind(this));
    }

    // Sort 
    _sortEvent(){
        let movements;
        if(!sortMoney) return;
        sortMoney.addEventListener("click", function(){
            if(!this.#currentUser) return;
            if(sort === "toUP") sortSpan.innerHTML = "\&#8595";
            if(sort === "toLower") sortSpan.innerHTML = "\&#8593";

            movements = this.#currentUser.movements;

            if(sort === "toUP"){
                movements.sort(function(a, b){
                    return a.price-b.price;
                })
                movementsContainer.innerHTML = "";
                sortSpan.innerHTML = "\&#8595";
                this._insertMovementMain(movements);
                sort = "toLower";
            }
            else if(sort === "toLower"){
                movements.sort(function(a, b){
                    return b.price-a.price;
                })
                movementsContainer.innerHTML = "";
                sortSpan.innerHTML = "\&#8593";
                this._insertMovementMain(movements);
                sort = "toUP";
            }
        }.bind(this));
    }

    // Patch movements into database
    async _updateMovements(id, user){
        await fetch(`http://localhost:3000/datas/${id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                movements: user.movements,
            })
        })
        .then(response => response.json()).catch(err => console.log(err));
    }

    // Push new movement into user movements array
    _pushMovemennt(user, value){
        user.movements.push({price: +value, date: new Date()}) 
    }

    // Based on withdrawal or deposit, this function updates movements container, current balance, in,out, user database,
    async _producing(type, value){
        //Sets movement to users movements array
        this._pushMovemennt(this.#currentUser, `${type === "deposit" ? +value : -value}`);
        //Taking last movement which we put into array right before
        const newMov = this.#currentUser.movements.slice(-1)[0];
        //Display that movement in movemennts container
        this._insertMovement(newMov);
        //Patch user movements into databse
        await this._updateMovements(this.#currentUser._id, this.#currentUser);
        //Update account balance because it changed
        this._updateBalance(this.#currentUser);
        //Count deposits and withdrawals because they cahnged
        this._countInOut();
    }

    // If user deposited transfered from application             
    async _caseTransfer(){
        let sendTo;
        this.#transferUsername = transferUsernameInput.value;       
        this.#users.forEach(async user => {
            if(user.username === this.#transferUsername){
                sendTo = user;  
            } 
        });
        if(this.#curBal < +transferMoneyInput.value) {
            this._errorModal("You don't have money on application!");
            return;
        }
        if(sendTo){
            //This will update for sender
            this._producing("withdraw", +transferMoneyInput.value);
            //This will update for reciever
            this._pushMovemennt(sendTo, +transferMoneyInput.value);
            await this._updateMovements(sendTo._id, sendTo);     
        } else {
            this._errorModal("Invalid username!");
        }
    }

    // Delete user from databse 
    async _deleteUser(){
        await fetch(`http://localhost:3000/datas/${this.#currentUser._id}`, {
                method: 'DELETE',
              })
              .then(res => res.text()) // or res.json()
              .then(res => console.log(res))   
              
              window.open("/register/register.html", "_parent");
              
    }

    // If user wants to delete account;
    _caseDelete(){
        this.#deleteUsername = delAccountUsername.value;
        this.#deletePassword = delAccountPW.value;

        if(!this.#currentUser) return;

        if(this.#currentUser.username === this.#deleteUsername && this.#currentUser.password === this.#deletePassword){
            this._deleteUser();
        } else {
            this._errorModal("Invalid username or password!");
        }
    }


    // If user deposited money from card
    async _caseDeposit(){
        if(!depositInput.value) return;
        this.#currentUser.creditCard.balance -= depositInput.value;
        if(this.#currentUser.creditCard.balance < 0) {
            this._errorModal("You don't have money on credit card!")
            return;
        }
        await this._patchUserWithCard(this.#currentUser._id, this.#currentUser.creditCard);
        this._producing("deposit", depositInput.value);
    }

    // Check wich event happepned an handle it
    _transactions(){
        transactionsFunction.forEach(tf => tf.addEventListener("click", async function(e){
            if(e.target.getAttribute("id") === "deposit-button"){
                this._caseDeposit();
            }

            if(e.target.getAttribute("id") === "transfer-button"){
                this._caseTransfer();
            }

            if(e.target.getAttribute("id") === "remove-button"){
                this._caseDelete();
            }
 
        }.bind(this)));
    }

    // Inserting in movement container
    _insertMovement(mov){
        const html = `
            <div class="transaction">
                <div class="t-div">
                    <div class="${mov.price > 0 ? "deposit" : "withdraw"}">${mov.price > 0 ? "Deposit" : "Withdraw"}</div>
                    <div>${new Date(mov.date).getDate() + "/" + new Date(mov.date).getMonth()+1 + "/" + new Date(mov.date).getFullYear()}</div>
                </div>
                    <div>${mov.price} KM</div>
                </div>
                `
        movementsContainer.insertAdjacentHTML("afterbegin", html);
    }
   
    // For each movement insert it into movement container
    _insertMovementMain(movements){
        movements.forEach(mov => {
            this._insertMovement(mov)
        });
    }

    // Count deposits & withdraw money and set them
    _countInOut(){
        let deposits = 0;
        let withdrawals = 0;
        this.#currentUser.movements.forEach(mov => {
            if(+mov.price > 0) deposits += +mov.price;
            else withdrawals += +mov.price;
        })
        if(!deposits) inMoney.innerText = 0;
        else inMoney.innerText = deposits;
        if(!withdrawals) outMoney.innerText = 0;
        else outMoney.innerText = withdrawals;
    }
    
    // Update account current balance
    _updateBalance(user){

        this.#curBal = 0;
        user.movements.forEach(mov => {
            this.#curBal += +mov.price;
        });

        updateBalance.innerText = this.#curBal;

    }

    // Set date when logged in
    _setDate(){
        const date = new Date();
        // asOfDateSpan.innerText = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`; 
        asOfDateSpan.innerText = `${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}/${(date.getMonth()+1) < 10 ? "0" + (date.getMonth()+1) : date.getMonth()+1}/${date.getFullYear()}, ${date.getHours()}:${date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes() }` 
    }

    // Set name for greeting message
    _setName(user){
        setNameSpan.innerText = user.firstName;
    }

    // Display transactions
    _displayTransactions(){
        loginMain.classList.add("hidden");
        indexMain.classList.remove("hidden");
    }

    // Check if username and password matches with any of account, if does, display transactions page and movements 
    _checkUserLoadPage(){
        this.#users.forEach(user => {
            if(user.username === this.#currentUsername && user.password === this.#currentPassword){
                this.#currentUser = user;
            }   
        });
        if(this.#currentUser){

            this._displayTransactions();
            
            this._setName(this.#currentUser);
            this._setDate();
            
            this._updateBalance(this.#currentUser);
            
            this._countInOut();
            
            this._insertMovementMain(this.#currentUser.movements);
            
            this._transactions();
        } else {
            this._errorModal("Invalid username or password!");
        }
    }

    // Take input values and call function for checking users
    _loginButtonEvent(){
        if(!loginButton) return;
        loginButton.addEventListener("click", async function(e){
            e.preventDefault();

            this.#users = await this._fetchAllUsers();
            
            this.#currentUsername = loginUsername.value;
            this.#currentPassword = loginPassword.value;
            
            this._checkUserLoadPage();                
            }.bind(this));
    }
         
    // Load login page
    _loginLoad(){
        if(!loginMain) return;
        if(!indexMain) return;
        loginMain.classList.remove("hidden");
        indexMain.classList.add("hidden");
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////                       Payment event                             //////////////
    /////////////////////////////////////////////////////////////////////////////////////////////

    // If you want to register
    _noAccountEvent(){
        if(!buttonNoAccount) return;
        buttonNoAccount.addEventListener("click", () => {
            mainRegister.classList.remove("hidden")
            loginMain.classList.add("hidden");    
        }
        );
    }

    // Add card to user in database
    async _patchUserWithCard(userID, creditCard){
        await fetch(`http://localhost:3000/datas/${userID}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                creditCard: creditCard,
            })
        })
        .then(response => response.json()).catch(err => console.log(err));
    }

    // Take last created user
    async _createCreditCard(){
        await fetch("http://localhost:3000/datas").then(response => response.json()).then(data => this.#currentUser = data.slice(-1));
        this.#creditCard = new CreditCard(this.#cardName, this.#cardNumber, this.#cardValid, this.#cardCVV);
    }

    // Check if creedit card form are filled
    _creditFormFilled(){
        if(this.#cardName === "" || this.#cardNumber === "" || this.#cardValid === "" || this.#cardCVV === "" || this.#cardName === undefined || this.#cardNumber === undefined || this.#cardValid === undefined || this.#cardCVV === undefined ) {
            this._errorModal("Please fill form!")
            return;
        }
    }

    // When proceed button is liccked
    _cardProcedEvent(){
        if(!proceedButton) return;
        proceedButton.addEventListener("click", async function(){

            this._creditFormFilled();

            await this._createCreditCard();

            if(!this.#currentUser) return;
            if(!this.#creditCard) return;
            
            [this.#currentUser] = this.#currentUser;

            await this._patchUserWithCard(this.#currentUser._id, this.#creditCard);

            loginMain.classList.remove("hidden");
            paymentBody.classList.add("hidden");
            
            // window.open("/Login/login.html", "_parent");

        }.bind(this));


    }

    // Fill day until the card is valid
    _fillCardValid(text){
        let txt;
        let txthelp = text.slice(0, 2);
        if(txthelp > -1 && txthelp < 13 && txthelp !== undefined && txthelp !== "") {
            txt = txthelp + "/" + text.slice(2, 5);
            cardCValidThrough.innerText = txt;
        } else {
            text = "";
            validThrough.value = text;
            this._errorModal("Invalid month!");
        }
    }

    // Fill name on card
    _fillNameOnCard(text){
        cardCName.innerText = text;
    }

    // Fill card with numbers
    _fillCardNumber(text){
            const allNums = document.querySelectorAll(".num");
            
            let a=0, b=4;
            allNums.forEach(num => {
                num.innerText = text.slice(a, b);
                a += 4;
                b += 4;
            });
    }
    
    // Create element on which we will set input value
    _createHandlingElement(dataset){
        return document.getElementById(dataset[Object.keys(dataset)[0]]);
    }

    // Lusten to inputs
    _cardInputEvent(){
        cardsInput.forEach(inp => inp.addEventListener("input", () => {
            let text;
            const el = this._createHandlingElement(inp.dataset);


            if(el.getAttribute("id") === "numbers"){
                text = cardNumber.value;
                this._fillCardNumber(text);
                if(text.length === 16) this.#cardNumber = text;
            }

            if(el.getAttribute("id") === "card-name-card"){
                text = nameOnCard.value;
                const regex = /[1-9,./*?=()/_:;<>!"#$%&|~ˇ^˘°`˙˝¨-]/g;
                if(text.match(regex)){
                    text = "";
                    nameOnCard.value = text;
                    this._errorModal("Please enter valid card name!");
                    return;
                };

                this._fillNameOnCard(text);
                this.#cardName = text;
            }

            if(el.getAttribute("id") === "cvv"){
                text = cvv.value;
                if(text.length === 3) this.#cardCVV = text; 
            }

            if(el.getAttribute("id") === "card-valid-card-span"){
                text = validThrough.value; 
                this._fillCardValid(text);
                if(text.length === 4) this.#cardValid  = text;
            }

        }));

    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////                       Registration event                        //////////////
    /////////////////////////////////////////////////////////////////////////////////////////////

    // If user wants to sign in
    _signInEvent(){
        if(!buttonSignIn) return;
        buttonSignIn.addEventListener("click", () => {
            // window.open("./Login/login.html", "_parent");
            window.open("/Login/login.html", "_parent")
        });
    }

    // Send user to database
    async _postUser(user){
        await fetch("http://localhost:3000/datas", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(user)
        }).then(text => text).catch(err => console.log(err.message));
    }

    // Return Fetched all usuers;
    async _fetchAllUsers(){
        return await fetch("http://localhost:3000/datas").then(response => response.json()).then(data => data); 
    }  

    _checkUsernames(users){
        let checkDuplicateUsername;
        users.forEach(user => {
            if(user.username === this.#username){
            checkDuplicateUsername = true;
            }
        });
        if(checkDuplicateUsername){
            this._errorModal("Username already in use!");
            return true;
        }
    }

    // Checking if checkboxes are checked
    _checked(val){
        if(val.checked) return true;
        else return false;
    };

    // Checking if cookies are checked
    _checkCookies(){
        return this._checked(cookies);
    };

    // Checking if notifications are checked
    _checkNotf(){
        this._checked(mailNotf);
    };

    // Checking if passowrds match
    _checkPassword(){
        if(this.#password === this.#confirm) return true;
        else false;
    }

    // Checking if form is filled
    _registerFormFilled(){
        if(this.#firstName && this.#lastName && this.#email && this.#username && this.#password !== "") return true;
        else false;
    }

    // Creating app variables from forms
    _setFormData(){
        this.#firstName = firstName.value;
        this.#lastName = lastName.value;
        this.#email = email.value;
        this.#username = username.value;
        this.#password = password.value;
        this.#confirm = cPassword.value;
    };

    // Function for creating user
    async _createUserObject(){
        //Create user data in app object
        this._setFormData();
            
        //Check if the register form is filled
        if(!this._registerFormFilled()){
            this._errorModal("Please fill form!");
            return;
        };
                
        //Check if passwords match
        if(!this._checkPassword()){
            this._errorModal("Your paswords doesen't match!");
            return;
        };
    
        //Check if the cookies are marked
        if(!this._checkCookies()) {
            this._errorModal("Accept cookies!");
            return;
        };
                
        //Get all users so we can check if the username is in use
        const users = await this._fetchAllUsers();
        //Check if the username is in use
        if(this._checkUsernames(users)) return;
        
        //Create user object
        this.#user = new User(this.#firstName, this.#lastName, this.#email, this.#username, this.#password);
    
        //Send user to database
        this._postUser(this.#user)
    
        //When everything is finished, open payment window.
        if(this.#user) {
            mainRegister.classList.add("hidden");
            loginMain.classList.remove("hidden");
            // window.open("/Payment Details/payment.html", "_parent");
        }
    };

    // When Sign-UP button is clicked, create user
    _signUpEvent(){
        if(!buttonSignIn) return;
        buttonSignUp.addEventListener("click", this._createUserObject.bind(this));
    };

    // Display error message
    _errorModal(message){
        const modal = `
            <div id="modal">
            <div id="modal-container">
                <div id="x-holder">
                    <img src="./assets/pngkit_png-red-x_3741314.png">
                </div>
                <div id="message-holder">
                    <h2>Ooops!</h2>
                    <p>Something went wrong. <span id="error-message">${message}</span></p>
                    <button type="button" id="close-modal-button" class="button">Try Again</button>
                </div>
            </div>
            </div>
        `;
        
        document.getElementsByTagName("body")[0].insertAdjacentHTML("afterend", modal);
        document.getElementById("close-modal-button").addEventListener("click", function(){
            document.getElementById("modal").remove();
        });
        
    }
}

const appi = new app();
