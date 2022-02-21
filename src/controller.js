// import {API_URL} from "./configuration.js"
import { getJSON } from "./helpers.js";
import * as model from "./model.js";
import Register from "./views/registerView.js";
import cardView from "./views/cardView.js";
import loginView from "./views/loginView.js";
import transactionsView from "./views/transactionsView.js";
import { _errorModal } from "./helpers.js";


//Transactions view
const transactions = async function(user){
    //Because transactionsView is new object, it's current user will be reset so we have to manually set it again
    transactionsView._setCurrentUser(user);
    //This will generate neccesary html for transactions view
    transactionsView.generateHTML();
    //This will initialize HTML elements
    transactionsView.initializeHTMLelements();
    //This gonna fill html data with user data
    transactionsView.fillHTML();

    transactionsView.transactionsFunctions(model.patchUserCreditCard, model.patchUserMovements, model.fetchUserAccounts, model.removeAccount, login);

    transactionsView.addHandlerLogOut(login);

    transactionsView.addHandlerTransferOnCard(model.patchUserCreditCard, model.patchUserMovements);

    transactionsView.addHandlerSort();
}


//Login view
const login = async function(){

    loginView.initializeHTMLelements();

    loginView.addHandlerLogin(model.fetchUserAccounts, transactions);
    loginView.addHandlerSignUp();
}

//Card view 
const card = async function(){

    //Function that calls function from model for patching user account
    //1. Argument: UserID 
    //2. Argument: credit card object
    const patchRegisterCreditCard = async function(user, creditCard){
        await model.patchUserCreditCard(user, creditCard);
    }

    //When markup generates (after Sign Up) it will automatically incialise object elements to dom elements values
    cardView.initializeHTMLelements();

    //Run card view live events
    cardView._liveFormInputEvent();
    
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
    // 1. Argument: aLL users; Array;
    // 2. Aregument: Function for sending data to api
    // 3. Card view which must happen after sign up
    Register.addHandlerSignUp(await model.fetchUserAccounts(), sendRegisterdUser, card);

    //Function which handles what will happen when SignIn is pressed
    Register.addHandlerSignIn(login);

}

//Function which trigger on load
const init = async function(){
    await register();
}
init();