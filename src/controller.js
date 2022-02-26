import * as model from "./model.js";
import registerView from "./views/registerView.js";
import cardView from "./views/cardView.js";
import loginView from "./views/loginView.js";
import transactionsView from "./views/transactionsView.js";
import { removeSpinner } from "./helpers.js";
import * as responsive from "./responsiveDesign.js";


//Transactions view
const transactions = async function(user){
    //Because transactionsView is new object, it's current user will be reset so we have to manually set it again
    transactionsView.setCurrentUser(user);
    //This will generate neccesary html for transactions view
    transactionsView.generateHTML();
    //This removes spiner when transaction page is loaded and when html is displayed
    removeSpinner();
    //This will initialize HTML elements
    transactionsView.initializeHTMLelements();
    //This gonna fill html data with user data
    transactionsView.fillHTML();
    //This will run eventlistener of transactions functions block (deposit, withdraw, delete account);
    transactionsView.transactionsFunctions(model.patchUserCreditCard, model.patchUserMovements, model.fetchUserAccounts, model.removeAccount, login);
    //This will run eventlistener for logout
    transactionsView.addHandlerLogOut(login);
    //This will run eventlistner for transfer on card 
    transactionsView.addHandlerTransferOnCard(model.patchUserCreditCard, model.patchUserMovements);

    transactionsView.addHandlerSort();
}


//Login view
const login = async function(){
    //This removes spinerr as soon as login loads
    removeSpinner();
    //Its aleary created so only it needs to initialize element
    loginView.initializeHTMLelements();
    //Add event listener when login is clicked
    loginView.addHandlerLogin(model.fetchUserAccounts, transactions);
    loginView.addHandlerSignUp();
}

//Card view 
const card = async function(user){
    //Function that calls function from model for patching user account
    //1. Argument: UserID 
    //2. Argument: credit card object
    const patchRegisterCreditCard = async function(user, creditCard){
        await model.patchUserCreditCard(user, creditCard);
    }
    
    //This function generates html for payment view
    cardView.generateHTML(user);

    //This removes spiner when card is loaded and when html is displayed
    removeSpinner();

    //When markup generates (after Sign Up) it will automatically incialise object elements to dom elements values
    cardView.initializeHTMLelements();

    //Run card view live events
    cardView.liveFormInputEvent();
    
    //Handler for proceed button
    cardView.addHandlerProceed(patchRegisterCreditCard, model.fetchUserAccounts, login);
}

//rEGISTER VIEW
const register = async function(){
    //Function which send user data to api
    const sendRegisterdUser = function(user){
        model.postUserAccount(user);
    }

    
    //Function which handles what will hapen when SignUp is clicked;
    // 1. Argument: Function for fetching all users; Array;
    // 2. Aregument: Function for sending data to api
    // 3. Card view which must happen after sign up
    registerView.addHandlerSignUp(model.fetchUserAccounts, sendRegisterdUser, card);

    //Function which handles what will happen when SignIn is pressed
    registerView.addHandlerSignIn(login);

}

//Function which trigger on load
const init = async function(){
    await register();
    responsive.responsiveInit();
}
init();