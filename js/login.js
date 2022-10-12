import '../style.css'
import { LOG_IN_URL } from "./endpoints/api";
import { saveToken,saveUser } from "./storage/storage";

const logInForm = document.getElementById("login-form")
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const emailMessage = document.getElementById("email-message");
const passwordMessage = document.getElementById("password-message");

const signUpButton = document.getElementById("signUpButton");

logInForm.addEventListener("submit", logIn)

function logIn (event) {

    event.preventDefault();

    let accessToken;
    let username;

    let emailValue = emailInput.value;
    let validEmail = false;

    let passwordValue = passwordInput.value;
    let validPassword = false;

    let validForm = false;

    if (emailValue) {
        validEmail = true;
        emailMessage.innerHTML = null;

    } else {
        validEmail = false;
        emailMessage.innerHTML = "Missing email";
    }

    if (passwordValue) {
        validPassword = true;
        passwordMessage.innerHTML = null;
    } else {
        validPassword = false;
        passwordMessage.innerHTML = "Missing password";
    }

    

    if (validEmail && validPassword) {
        validForm = true;
    }

    if (validForm) {

        let loginBody = {
            email: `${emailValue}`,
            password: `${passwordValue}`
        }

        let jsonBody = JSON.stringify(loginBody);
    

        (async function requireLogIn() {

            try {
            const response = await fetch(LOG_IN_URL, {
                method: 'POST',
                body: jsonBody,

            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            })

            const data = await response.json();

            if (response.ok) {
                console.log("success");
                console.log(data);
                accessToken = data.accessToken;
                username = data.name;
                console.log(accessToken);
                saveToken(accessToken);
                saveUser(username);
                window.location.replace('/index.html');
            }

            else {
                console.log("error", data)
                passwordMessage.innerHTML = data.message; //få til å endre melding etter ka statuskode? 
                //Lage egen message sted
            }
            }
            catch (error) {
                console.log(error);
            }

        })();
    }
 }


signUpButton.addEventListener("click", () => {
    window.location.assign("signup.html");
})