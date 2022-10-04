import { SIGN_UP_URL } from "./endpoints/api";
//console.log(SIGN_UP_URL);
import { validateEmail, validatePassword,confirmingPassword } from "./utils/validation";

const signUpForm = document.getElementById("sign-up-form");

const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const signUpButton = document.getElementById("sign-up-button");

const usernameMessage = document.getElementById("username-message");
const emailMessage = document.getElementById("email-message");
const passwordMessage = document.getElementById("password-message");
const confirmPasswordMessage = document.getElementById("confirm-password-message");


signUpForm.addEventListener("submit", function (event) {
    signUp(event);
});

function signUp (e) {

    e.preventDefault();

    let validForm = false;

    //username
    // kan ikke ha annet enn _, men dette er det APIET som fikser?

    let usernameContent = username.value;
    let validUsername = false;

    if (usernameContent) {
        validUsername = true;
        usernameMessage.innerHTML = "all good";

        if (usernameContent === " ") {
            validUsername = false;
            usernameMessage.innerHTML = "we need more..";
        }
    }

    else {
        usernameMessage.innerHTML = "we need something..";
    }

    let emailContent = email.value;
    let validEmail = false;

    if (emailContent) {
        const validadedEmail = validateEmail(emailContent); //false or true

        if (validadedEmail) {
            validEmail = true;
        } else {
            emailMessage.innerHTML = "Must be valid email, with noroff.no og stud.noroff.no";
        }

    } else {
            emailMessage.innerHTML = "we need something..";
    }

    let passwordContent = password.value;
    let validPassword = false;

    if (passwordContent) {

       const validadedPassword = validatePassword(passwordContent) 
       console.log(validadedPassword);
       
       if (validadedPassword) {
            validPassword = true;
            passwordMessage.innerHTML = "Nice job";

        } else {
            validPassword = false;
            passwordMessage.innerHTML = `Must be 8 characters or more`;
        }
    } else {
            passwordMessage.innerHTML = "we need something..";
    }

    let confirmPasswordContent = confirmPassword.value;
    let validConfirmPassword = false;

    if (confirmPasswordContent) {

        const matchingPasswords = confirmingPassword(passwordContent, confirmPasswordContent);

        if (matchingPasswords) {
            validConfirmPassword = true;
            console.log("yey password matching");
            confirmPasswordMessage.innerHTML = "good";
        }
        else {
            validConfirmPassword = false;
            confirmPasswordMessage.innerHTML = "not matching";
        }
    } else {
        validConfirmPassword = false;
        confirmPasswordMessage.innerHTML = "need something";
    }



  
    if (validUsername && validEmail && validPassword && validConfirmPassword) {
        validForm = true;

    } else {
        validForm = false;
        console.log("something wrong");
    }


    const signUpBody = {
        name : `${usernameContent}`,
        email: `${emailContent}`,
        password: `${passwordContent}`
    }
    //console.log(signUpBody);

    const inJSON = JSON.stringify(signUpBody);

    register(inJSON);

}

async function register(body) {
    try {
        const response = await fetch(SIGN_UP_URL, {
            method: "POST",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: body,
          })
        
          const data = await response.json();

          if (response.ok) {
            console.log("success");
            console.log(data);
            //window.location.replace('/index.html')
          }

          else {
            console.log("error", data)
            //Si ifra til bruker
          }
    }
    
    catch (error) {
        console.log(error);
    }
};