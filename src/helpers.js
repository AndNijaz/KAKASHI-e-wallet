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