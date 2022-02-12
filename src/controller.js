// import {API_URL} from "./configuration.js"
import { getJSON } from "./helpers.js";
import * as model from "./model.js";
import Register from "./views/registerView.js";
import cardView from "./views/cardView.js";
import { _errorModal } from "./helpers.js";

//Card view 
const card = async function(){

    //Function that calls function from model for patching user account
    //1. Argument: UserID 
    //2. Argument: credit card object
    const patchRegisterCreditCard = function(userID, creditCard){
        model.patchUserCreditCardJSON(userID, creditCard);
    }

    //When markup generates (after Sign Up) it will automatically incialise object elements to dom elements values
    cardView.initializeHTMLelements();

    //Run card view live events
    cardView._liveFormInputEvent();
    
    //Handler for proceed button
    cardView.addHandlerProceed(patchRegisterCreditCard, model.fetchUserAccounts);
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
    Register.addHandlerSignIn();

}

//Function which trigger on load
const init = async function(){
    await register();
}
init();