import '../style.css'
import { ALL_PROFILES_URL, queryStringProfileInfo } from "./endpoints/api";
import { getToken, getUsername } from "./storage/storage";

const profilesOutPut = document.getElementById("all-profiles");

const myFollowers = document.getElementById("followers");
const iAmfollowing = document.getElementById("following");

const showNumberFollowing = document.getElementById("number-of-following");
const showNumberFollowers = document.getElementById("number-of-followers");


const profileUser = getUsername();

const profileInfoURL = `${ALL_PROFILES_URL}${profileUser}${queryStringProfileInfo}`;
//console.log(profileInfoURL);


async function myInfo() {

    try {
        const response = await fetch(profileInfoURL, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        })

        const data = await response.json();

        if (response.ok) {
            console.log("success");
            console.log(data);
            allProfiles(data);
            showFollowing(data);
            showFollowers(data);
            catchData(data);
        }

        else {
            console.log("error", data)
        }
    }
    catch (error) {
        console.log(error);
    }

};

myInfo();


async function allProfiles(profileData) {
    
    try {
        const response = await fetch(ALL_PROFILES_URL, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        })

        const data = await response.json();

        if (response.ok) {
            console.log("success");
            console.log(profileData);
            listProfiles(data, profileData);

        }

        else {
            console.log("error", data)
            
        }
    }

    catch (error) {
        console.log(error);
      
    }
};


function listProfiles (data, profileData) {

    console.log(data);

    console.log(profileData);

    let meFollowing = profileData.following;
    let nameArray = [];
    for (let follower of meFollowing) {
        nameArray.push(follower.name);
    }
    console.log(nameArray); //array av mine followers
     

    let oneProfile = "";

    let name;
    let email;
    let banner;
    let avatar;
    let info;

    for (let profile of data) {

    if (profile.name) {
        name = profile.name;
    }

    if (profile.email) {
        email = profile.email;
    }

    if (profile.banner === "") {
        profile.banner = "https://i.imgur.com/M3m9Y3W.png";
    }

    if (profile.banner) {
        banner = profile.banner;
    }

    if (profile.avatar === "") {
        profile.avatar = "https://i.imgur.com/0D99Xsk.png";
    }
   
    if (profile.avatar) {
        avatar = profile.avatar
    }


    oneProfile = 
        `
        <div class="p-6 mb-4 bg-gray-100 max-w-md flex flex-col items-center">
        <h2 class="pb-2 text-xl font-bold">${name}</h2>
        <p>${email}</p>
        <figure><img class="w-40 h-40 rounded-full" src=${avatar}></figure> 
        <figure><img class="w-40 h-40" src=${banner}></figure>
        <button id="${name}" class="followButton bg-yellow-300 p-2">Follow</button>
        <button id="${name}" class="unfollowButton hidden bg-red-300 p-2">Unfollow</button>
        </div>
        `
        profilesOutPut.innerHTML += oneProfile;
    }

    const followButtons = document.getElementsByClassName("followButton");
    const unfollowButtons = document.getElementsByClassName("unfollowButton");

 

    for (let button of followButtons) {
        let buttonId = button.id;
        if (nameArray.includes(buttonId)){
            console.log(buttonId);
            button.innerHTML = `<button id="${name}" disabled class="followButton bg-gray-300 disabled">Following</button>`;
        }
        button.addEventListener("click", function (event) {
            event.preventDefault();
            // hvis button id(navnet på person) er i arrayen av mine følere, så disable button  
            followProfile(buttonId);
            myInfo();
        })
    } // JAAAA FOR FAEN I HELVETE EG EIAR



    for (let button of unfollowButtons) {
        let buttonId = button.id;

        if (nameArray.includes(buttonId)) {
            button.classList.remove("hidden");

            button.addEventListener("click", function (event) {
                event.preventDefault();
                unfollowProfile(buttonId);
            })
        }
       
    } 
}


function showFollowing({following}) { 

    //console.log(following); 

    let numberOfFollowing = [];
    numberOfFollowing = following.length;
    let adjustMessage = "people";

    if (numberOfFollowing === 1) {
        adjustMessage = "person";
    }

    showNumberFollowing.innerHTML = `You are following ${numberOfFollowing} ${adjustMessage}`;

    let followingName;
    let followingAvatar;
    let followingHTML;



    for (let profile of following) {

        followingName = profile.name;
        followingAvatar = profile.avatar;
    
        followingHTML = 
        `
        <div class="flex flex-col items-center">
            <p>${followingName}</p>
            <img class="w-12" src="${followingAvatar}">
        </div>
        `

        iAmfollowing.innerHTML += followingHTML;
    }
};


function showFollowers({followers}) { 

    console.log(followers); 

    
    let numberOfFollowers = followers.length;
    let adjustMessage = "followers";

    if (numberOfFollowers === 1) {
        adjustMessage = "follower";
    }

    showNumberFollowers.innerHTML = `You have ${numberOfFollowers} ${adjustMessage}`;

    let followerName;
    let followerAvatar;
    let followerHTML = null;


    for (let profile of followers) {

        followerName = profile.name;
        followerAvatar = profile.avatar;

    
        followerHTML = 
        `
        <div class="flex flex-col items-center">
            <p>${followerName}</p>
            <img class="w-12" src="${followerAvatar}">
        </div>
        `

        myFollowers.innerHTML += followerHTML;
    }
};


async function followProfile(profileName) {

    try {
        const response = await fetch(`${ALL_PROFILES_URL}${profileName}/follow`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        })

        const data = await response.json();

        if (response.ok) {
            console.log("success");
            //console.log(data);

        }

        else {
            console.log("error", data)
        }
    }

    catch (error) {
        console.log(error);
    }

};


async function unfollowProfile(profileName) {

    try {
        const response = await fetch(`${ALL_PROFILES_URL}${profileName}/unfollow`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        })

        const data = await response.json();

        if (response.ok) {
            console.log("success");
            console.log(data);
        }

        else {
            console.log("error", data)
        }
    }

    catch (error) {
        console.log(error);
    }

};

