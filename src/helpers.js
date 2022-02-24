import { API_URL, REGISTER_PAGE } from "./configuration.js";
import { LOGIN_PAGE } from "./configuration.js";
import xPic from "../assets/pngkit_png-red-x_3741314.png";

export const getJSON = async function(url){
    try {
        const res  = await fetch(url);
        const data = await res.json();
        if(!res.ok) throw new Error(`${data.message} ${res.status}`);
        return data;

    } catch(err){
        errorModal(`${err.message}, ${err.message === "Failed to fetch" ? "Server error." : ""}!`);
    }
}

export const sendJSON = async function(url, uploadData){
    try {
        const res  = await fetch(url, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(uploadData) 
        }
        );
        const data = res.json();
        if(!res.ok) throw new Error(`${data.message} ${res.status}`);
        return res;

    } catch(err){
        errorModal(err.message);
    }
}

export const patchUserCreditCardJSON = async function(userID, newCreditCard){
    try{
        const res = await fetch(`${API_URL}/${userID}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                creditCard: newCreditCard
            })
        })
        const data = res.json();
        if(!res.ok) throw new Error(`${data.message} ${res.status}`);
        return res;
    } catch(err){
        errorModal(err.message);
    }
}

export const patchUserMovementsJSON = async function(userID, newMovements){
    try{
        const res = await fetch(`${API_URL}/${userID}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                movements: newMovements
            })
        })
        const data = res.json();;
        if(!res.ok) throw new Error(`${data.message} ${res.status}`);
        return res;
    } catch(err){
        errorModal(err.message);
    }
}   

export const removeAccountJSON = async function(userID){
    try {

        const res = await fetch(`${API_URL}/${userID}`, {
            method: 'DELETE',
        })
        const data = res.json();;
        if(!res.ok) throw new Error(`${data.message} ${res.status}`);
        return res;
    }
    catch(err){
        errorModal(err.message);
    }
}

export const errorModal = function(message){
    if(document.getElementById("modal")) return;
    const modal = `
        <div id="modal">
        <div id="modal-container">
            <div id="x-holder">
                <img src="${xPic}">
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
