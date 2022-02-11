import { API_URL } from "./configuration";
import { getJSON } from "./helpers";
import { sendJSON } from "./helpers";

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

// export const 