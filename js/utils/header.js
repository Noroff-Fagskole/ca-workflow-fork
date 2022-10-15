
import {myInfo} from './request-functions';

const nav = document.getElementById("nav");

import '../../img/socialapi_logo.svg';

/*


let logo = `<a href="index.html"><img src="../../img/logo_white.svg" class="inline-block"></a>`;

async function getInfo() {
    const data = await myInfo();
    //console.log(data);
}

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

*/
const userSection = document.getElementById("usersData");



function userProfile() {
    myInfo().then((value) => {
        listProfileData(value);
    })
};


function listProfileData(data) {
    console.log(data);

    let profileImg = data.banner;
    let profileName = data.name;
    let followers = data.followers.length;
    let following = data.following.length;

    userSection.innerHTML = 
    
    `<a href="myprofile.html">
    <div class="flex flex-col items-center gap-2 cursor-pointer text-white font-robotoC font-light">
        <p class="text-5xl tracking-wide">${profileName}</p>
        <div class="flex flex-row font-robotoC font-extralight gap-6 text-sm">
            <div class="flex flex-col items-center">
                <span class="font-normal text-2xl">${followers}</span>
                <p class="text-center">Followers</p>
            </div>
            <div class="flex flex-col items-center">
                <span class="font-normal text-2xl">${following}</span>
                <p class="text-center">Following</p>
            </div>
        </div>
    </div>
    </a>
    `
}




export {userProfile}