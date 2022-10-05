
function validateEmail(email) {
    const regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(stud.noroff.no|noroff.no)$/;
    return email.match(regEx) ? true : false;
}

function validatePassword(password) {
    let number = 8;
    if (password >= number) {
        return true;
    }
}

function confirmingPassword(password, confirmPassword) {

    if (!password) {
        return false;
    }

    if (!confirmPassword) {
        return false;
    }


    if (password === confirmPassword) {
        return true;
    }
}

function checkAccess(access) {
    if (access === null) {
     console.log("bad token")
     window.location.replace("/login.html");
    }
 };


export {validateEmail, validatePassword, confirmingPassword, checkAccess}