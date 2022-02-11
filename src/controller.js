import {API_URL} from "./configuration.js";
import { getJSON } from "./helpers.js";
import * as model from "./model.js";
import Register from "./views/registerView.js";
import { _errorModal } from "./helpers.js";


console.log("jen dva jen dva");
const card = async function(){
    
}

const register = async function(){

    //Function which send user data to api
    const sendRegisterdUser = function(user){
        model.postUserAccount(user);
    }

    //Function which communicate with view
    Register.addHandlerSignUp(await model.fetchUserAccounts(), sendRegisterdUser);
}

//Function which trigger on load
const init = async function(){
    await register();
}
init();