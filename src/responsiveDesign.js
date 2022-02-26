export const responsiveInit = function(){
    
    
    window.addEventListener("resize", function(){
        let query = window.matchMedia("(min-width: 481px)");
        const body = document.getElementsByTagName('body')[0];
        
        if(query.matches){
            console.log("zanpakuto");
            body.style.backgroundImage =  "none";
            if(this.document.getElementById("pfpContainer")) this.document.getElementById("pfpContainer").remove();
        }
        else {
            console.log("bankai");

            if(this.document.getElementById("pfpContainer")) return;

            body.style.backgroundImage =  `url("../assets/KAKASHI.jpg")`;
            const markup = `
            <div id="pfpContainer">
                <div id="pfp">
                    <img id="pfpIMG" src="../assets/KAKASHI.jpg">
                <div>
            </div>
            `
            this.document.getElementById("form-container").insertAdjacentHTML("afterbegin", markup);


            
        }
    })
}