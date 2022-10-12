
import {myInfo} from './request-functions';

const nav = document.getElementById("nav");

import '../../img/socialapi_logo.svg';




let logo = `<a href="index.html"><img src="../../img/socialapi_logo.svg" class="inline-block rounded-full"></a>`;

async function getInfo() {
    const data = await myInfo();
    //console.log(data);
}
getInfo();



function myHeader () {

    let imgURL;

        const resolved = Promise.resolve(myInfo());
        resolved.then((value) => {
            //console.log(value.banner);
            imgURL = value.banner;
            

        nav.innerHTML = `
            <div>${logo}</div>
            <ul class="flex flex-row gap-6">
                <li><img src=".././img/bell.png" style="max-width: 2rem"></li>
                <li>
                    <button id="profile">
                        <img src=".././img/user.png" style="max-width: 2rem">
                    </button>
                </li>
                <li>
                    <button id="logOut">
                        <img src=".././img/log-out.png" style="max-width: 2rem">
                    </button>
                </li>
            </ul>
            `

            const logOutButton = document.getElementById("logOut");
            logOutButton.addEventListener("click", () => {
                let doubleCheck = confirm("Are you sure?");
                if (doubleCheck == false) {
                    return;
                }
                else {
                    localStorage.clear();
                    window.location.reload();
                }    
            })

            const profileButton = document.getElementById("profile");
            profileButton.addEventListener("click", () => {
                window.location.assign("/myprofile.html")
            })

    });
}




export {myHeader}