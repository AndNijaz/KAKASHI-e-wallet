import background from "../assets/pravim se ja.png";
import pfp from "../assets/Kralj-min.png";
// const background = "../assets/pravim se ja.png";
// const pfp = "../assets/Kralj-min.png";
export const responsiveInit = function(){
    console.log("happen");
    let state = 1;
    
    window.addEventListener("resize", function(){
        let query = window.matchMedia("(min-width: 481px)");
        const body = document.getElementsByTagName('body')[0];

        if(query.matches){
            body.style.backgroundImage =  "none";
            if(this.document.getElementById("pfpContainer")) this.document.getElementById("pfpContainer").remove();
            if(this.document.getElementById("pfpContainer2")) this.document.getElementById("pfpContainer2").remove();



        }
        else {

            if(this.document.getElementById("index-main")){
                body.style.setProperty("--hardHight", "150%");
                // a.setProperty("height", "170%");
            } 
            else {
                body.style.setProperty("--hardHight", "100%");
                body.style.height = "95vh";
            }
            
            if(this.document.getElementById("pfpContainer")) return;

            body.style.backgroundImage =  `url("${background}")`;

            const markup = `
            <div id="pfpContainer">
                <div id="pfp">
                    <img id="pfpIMG" src="${pfp}">
                <div>
            </div>
            `
            const markup2 = `
            <div id="pfpContainer2">
                <div id="pfp">
                    <img id="pfpIMG" src="${pfp}">
                <div>
            </div>
            `
            this.document.getElementById("form-container").insertAdjacentHTML("afterbegin", markup);
            this.document.getElementById("login-forma").insertAdjacentHTML("afterbegin", markup2);



            
            

        }
    })
}

export const checkMobile = function(){

}