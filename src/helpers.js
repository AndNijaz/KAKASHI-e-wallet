import { REGISTER_PAGE } from "./configuration.js";
import { LOGIN_PAGE } from "./configuration.js";

export const getJSON = async function(url){
    try {
        const dataJSON  = await fetch(url);
        const data = await dataJSON.json();
        return data;

    } catch(err){
        console.log(err);
    }
}

export const sendJSON = async function(url, uploadData){
    try {
        const dataJSON  = await fetch(url, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(uploadData) 
        }
        );
        // const data = await dataJSON.json();
        return dataJSON;

    } catch(err){
        console.log(err);
    }
}

export const patchUserCreditCardJSON = async function(userID, newCreditCard){
    try{
        const dataJSON = await fetch(`http://localhost:3000/datas/${userID}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                creditCard: newCreditCard
            })
        })
        .then(response => response.json()).catch(err => console.log(err));
    } catch(err){
        console.log(err);
    }
}


export const _errorModal = function(message){
    const modal = `
        <div id="modal">
        <div id="modal-container">
            <div id="x-holder">
                <img src="/assets/pngkit_png-red-x_3741314.png">
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
    document.getElementById("close-modal-button").addEventListener("click", () => document.getElementById("modal").remove());
}

export const showLogin = function(){
    LOGIN_PAGE.classList.remove("hidden");
}
export const hideLogin = function(){
    LOGIN_PAGE.classList.add("hidden");
}

export const showrRegister = function(){
    REGISTER_PAGE.classList.remove("hidden");
}
export const hideRegister = function(){
    REGISTER_PAGE.classList.add("hidden");
}