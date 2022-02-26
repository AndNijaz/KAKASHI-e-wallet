import background from "../assets/pravim se ja.png";
import pfp from "../assets/Kralj-min.png";
import registerView from "./views/registerView";

export const responsiveInit = function(){
    
    let state = 1;
    
    window.addEventListener("resize", function(){
        let query = window.matchMedia("(min-width: 481px)");
        const body = document.getElementsByTagName('body')[0];

        if(query.matches){
            if(state === 1) return;
            console.log("zanpakuto");
            body.style.backgroundImage =  "none";
            if(this.document.getElementById("pfpContainer")) this.document.getElementById("pfpContainer").remove();


            document.getElementsByTagName("form")[0].remove();
            const markup = `
            <form>
                <div class="form-row-register" id="name-row">
                    <div class="input-text-register">
                        <p>First Name</p>
                        <p>Last Name</p>
                    </div>
                    <div class="inputs-place-register">
                        <input type="text" placeholder="Someone" class="input-register" id="first-name-inp" required>
                        <input type="text" placeholder="Example" class="input-register" id="last-name-inp" required>
                    </div> 
                </div>
                <div class="form-row-register" id="email-row">
                    <!-- <div class="inputs-place-register">
                        <input type="text" placeholder="Email ID" class="input input-width">
                    </div>  -->
                    <div class="form-row-register" id="name-row">
                        <div class="input-text-register">
                            <p>Email</p>
                            <p id="username-margin">Username</p>
                        </div>
                        <div class="inputs-place-register">
                            <input type="email" placeholder="someone@kakashi.com" class="input-register " id="mail-inp" required>
                            <input type="text" placeholder="SomeoneE" class="input-register" id="username-inp" required>
                        </div> 
                    </div>
                </div>
                <div class="form-row-register" id="passowrd-row">
                    <div class="inputs-place-register">
                        <input type="password" placeholder="Password" class="input-register input-width" id="password-inp" required>
                    </div> 
                </div>
                <div class="form-row-register" id="confirm-passowrd-row">
                    <div class="inputs-place-register">
                        <input type="password" placeholder="Confirm Password" class="input-register input-width" required id="confirm-password-inp">
                    </div> 
                </div>
                <div class="form-row-register" id="form-important-row">
                    <input type="checkbox" id="mail" name="mail" value="mail" required>
                    <label for="mail" id="forMail" class="check-text">Yes, I want to recieve mails.</label><br>
                    <input type="checkbox" id="terms" name="terms" value="terms" id="forTerms" class="check-text" required>
                    <label for="terms" class="check-text">I agree to the Terms & Privacy Policy </label><br>
                </div>
                <div class="form-row-register" id="form-buttons">
                    <button type="button" class="button-register" id="sign-up"> Sign Up</button>
                    <button type="button" class="button-register" id="sign-in"> Sign In</button>
                </div>
            </form>
            `;

            this.document.getElementById("form-container").insertAdjacentHTML("afterbegin", markup);
        }
        else {

            console.log("bankai");

            if(this.document.getElementById("pfpContainer")) return;

            body.style.backgroundImage =  `url("${background}")`;

            const markup = `
            <div id="pfpContainer">
                <div id="pfp">
                    <img id="pfpIMG" src="${pfp}">
                <div>
            </div>
            `
            this.document.getElementById("form-container").insertAdjacentHTML("afterbegin", markup);


            // const a = this.document.getElementsByClassName("form-row-register");
            // const b = [].slice.call(a);
            // b.forEach(element => {
                // element.remove();
            // });

           document.getElementsByTagName("form")[0].remove();

            const markup2 = `
            <form>
                <div class="form-row-register" id="name-row">
                    <div class="input-text-register">
                        <p>First Name</p>
                    </div>
                    <div class="inputs-place-register">
                        <input type="text" placeholder="Someone" class="input-register" id="first-name-inp" required="">
                    </div> 
                </div>
                <div class="form-row-register" id="surname-row">
                    <div class="input-text-register">
                        <p>Last Name</p>
                    </div>
                    <div class="inputs-place-register">
                        <input type="text" placeholder="Example" class="input-register" id="first-name-inp" required="">
                    </div> 
                </div>
                <div class="form-row-register" id="email-row">
                    <div class="input-text-register">
                        <p>Email</p>
                    </div>
                    <div class="inputs-place-register">
                        <input type="text" placeholder="someone@kakashi.com" class="input-register" id="first-name-inp" required="">
                    </div> 
                </div>
                <div class="form-row-register" id="username-row">
                    <div class="input-text-register">
                        <p>Username</p>
                    </div>
                    <div class="inputs-place-register">
                        <input type="text" placeholder="SomeoneE" class="input-register" id="first-name-inp" required="">
                    </div> 
                </div>
                <div class="form-row-register" id="password-row">
                    <div class="input-text-register">
                        <p>Password</p>
                    </div>
                    <div class="inputs-place-register">
                        <input type="text" placeholder="**********" class="input-register" id="first-name-inp" required="">
                    </div> 
                </div>
                <div class="form-row-register" id="confirm-password-row">
                    <div class="input-text-register">
                        <p>Confirm Password</p>
                    </div>
                    <div class="inputs-place-register">
                        <input type="text" placeholder="**********" class="input-register" id="first-name-inp" required="">
                    </div> 
                </div>
                <div class="form-row-register" id="form-buttons">
                    <button type="button" class="button-register" id="sign-up"> Sign Up</button>
                    <button type="button" class="button-register" id="sign-in"> Sign In</button>
                </div>
            <form>
            `

            this.document.getElementById("form-sub-container").insertAdjacentHTML("afterbegin", markup2);

            state = 2;

            const login = "haha";

            const register = async function(){
                console.log(registerView);
                //Function which send user data to api
                const sendRegisterdUser = function(user){
                    model.postUserAccount(user);
                }
            
                
                //Function which handles what will hapen when SignUp is clicked;
                // 1. Argument: Function for fetching all users; Array;
                // 2. Aregument: Function for sending data to api
                // 3. Card view which must happen after sign up
                // registerView.addHandlerSignUp(model.fetchUserAccounts, sendRegisterdUser, card);
            
                //Function which handles what will happen when SignIn is pressed
                registerView.addHandlerSignIn(login);
            
            }

            register();
        }
    })
}