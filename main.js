import './style.css'



const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const logInForm = document.getElementById("login");
const submitButton = document.getElementById("submitform");


function submitForm(e) {
    e.preventDefault();
    console.log("submitted");

    if(emailInput) {
        //...
    }
    else {
        
    }
};

logInForm.addEventListener("submit", submitForm);

function logIn(email, password) {
    fetch('https://nf-api.onrender.com/api/v1/social/auth/login', {
         method: 'POST',
         body: JSON.stringify({
             "email": `${email}`,
             "password": `${password}`
         }),
         headers: {
           'Content-type': 'application/json; charset=UTF-8',
         },
       })
         .then((response) => response.json())
         .then((data) => {
         console.log(data);
         return data.accessToken});
 };
       
 
 const myemail = `solveig.rebnord@noroff.no`;
 const mypassword = `Solveig123`;

 logIn(myemail, mypassword);