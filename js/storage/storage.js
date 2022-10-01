
export {logInUser}

let accessToken;
let username;

function logInUser (name, token) {
    localStorage.setItem("username", name);
    username = name;

    localStorage.setItem("accessToken", token);
    accessToken = token;
}

// nå er funksjonen bundet til log in. Heller få til separate save, delete, endre locale storage funksjoner. 
//Kunne sende token til andre funksjoner