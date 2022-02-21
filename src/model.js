import { API_URL } from "./configuration.js";
import { getJSON } from "./helpers.js";
import { sendJSON } from "./helpers.js";
import { patchUserCreditCardJSON } from "./helpers.js";
import { patchUserMovementsJSON } from "./helpers.js";

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

export const state = {
    currentUser: "",
    user: {}
}

export const fetchUserAccounts = async function(){
    const data = await getJSON(API_URL);
    return data;
}

export const postUserAccount = async function(user){
    const data = await sendJSON(API_URL, user);
    return data;
}

export const patchUserCreditCard = async function(user, creditCard){
    await patchUserCreditCardJSON(user._id, creditCard);
} 

export const patchUserMovements = async function(user, movements){
    await patchUserMovementsJSON(user._id, movements)
}



// export const 

//user = {_id: '6212b7f29f04f821af37437f', firstName: 'Nijaz', lastName: 'Andelić', email: 'andelicnijaz@gmail.com', username: 'Nyzz7', …}, patchCardFunction = async ƒ (user, creditCard), patchMovementsFunction = async ƒ (user, movements)
