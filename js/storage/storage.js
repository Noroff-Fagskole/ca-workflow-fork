
export {saveToken, saveUser, getToken}

const accessToken = "token";
let username;


function saveToken(token) {
    saveToStorage("token", token)
}

function saveUser (username) {
    saveToStorage("username", username);
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}


function getToken() {
    //console.log(getStoredData(accessToken));
    return getStoredData(accessToken);
}


function getStoredData(key) {
    const data = localStorage.getItem(key);
    //console.log(data);
    return JSON.parse(data);
}



// nå er funksjonen bundet til log in. Heller få til separate save, delete, endre locale storage funksjoner. 
//Kunne sende token til andre funksjoner