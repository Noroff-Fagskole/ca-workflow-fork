import '../style.css'
import { ALL_POSTS_ADDITIONAL_URL } from "./endpoints/api";
import { ALL_PROFILES_URL, queryStringProfileInfo } from "./endpoints/api";
import { getToken, getUsername } from "./storage/storage";
import { checkAccess } from './utils/validation';
import {myInfo} from './utils/request-functions';

checkAccess(getToken());

const myData = myInfo();
console.log("myData  ",myData);


function getInfo() {
    const resolved = Promise.resolve(myInfo());
    resolved.then((value) => {
        //console.log(value);
        usersData(value);
        //Kjøre funksjonen som skal liste profildata
    })
};


const feed = document.getElementById("feed");

const showPosts = document.getElementById("show-posts");
const showProfiles = document.getElementById("show-profiles");

showPosts.addEventListener("click", function() {
    console.log("posts");
    feed.innerHTML = "";
    allPosts();
    showPosts.disabled = true;
    showProfiles.disabled = false;
})

showProfiles.addEventListener("click", function() {
    console.log("profiles");
    feed.innerHTML = "";
    allProfiles();
    showPosts.disabled = false;
    showProfiles.disabled = true;
})

const queryString = window.location.search;
//console.log(queryString);


const userSection = document.getElementById("usersData");

function usersData(data) {
    console.log(data);
}

usersData();




async function allPosts() {
    
    try {
        const response = await fetch(ALL_POSTS_ADDITIONAL_URL, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        })

        const data = await response.json();

        if (response.ok) {
            console.log("success");
            console.log(data);
            listPosts(data);
        }

        else {
            console.log("error", data)
        }
    }

    catch (error) {
        console.log(error);
    }

};

allPosts();


function listPosts (data) {
    console.log(data);

    let onePost;
    let fullComment;

    let title;
    let content;
    let tags = [];
    let media;
    let created;
    let updated;
    let id;
    let info;

    for (let post of data) {

    if (post.title) {
        title = post.title;
    }

    if (post.body) {
        content = post.body;
    }
    if (post.tags) {
        for (let tag of post.tags) {
            tags += `<li>${tag}</li>`; //TODO får du objekter i arrays..
        }

    }

  

    if (post.media) {
        media = `<img src="${post.media}">`
    }

    if (post.media === "") {
        media = "";
    }

    if (post.created) {
        created = post.created
    }
    if (post.updated) {
        updated = post.updated
    }
    if (post.id) {
        id = post.id
    }

    if (post._count["comments"]) {
        let commentsArray = (post["comments"]); // får array med objektet/ene inni, kan jeg endre det i kallet på if
        let commentContent;
        let commentId;
        let commenter;
        let originalPostId;
        let commentCreated;

        for (let comment of commentsArray) {

            commentContent = comment.body;
            commentId = comment.id;
            commenter = comment.owner;
            originalPostId = comment.postId;
            commentCreated = comment.created;

            fullComment =
            `<div>
                <p>${commentContent}, id: ${commentId}, made by: ${commenter}, original post id: ${originalPostId}, created: ${commentCreated}</p>
            </div>
            `
        }

        let amountComments = post._count["comments"];
        //console.log(amountComments);
    }

    else {
        fullComment = "No comments"; //se om du vil ha tomt eller hva
    }
  
        onePost = 
        `<a href="post.html?id=${id}">
            <div class="border-2 border-pink-100 rounded-lg flex flex-row gap-12 p-6 w-3/5 justify-between items-center">
                <div class="flex flex-col">
                    <h2 class="text-xl font-bold">${title}</h2>
                    <p>${content}</p>
                    <ul>${tags}</ul>
                    <p>${created}</p>
                    <p>${updated}</p>
                    <p>id: ${id}</p> <br>
                    <span>${fullComment}</span>
                </div>
                <div class="max-w-xs"> 
                    <figure class="h-max">
                    ${media}
                    </figure>
                </div>
            </div>
        </a>`
        feed.innerHTML += onePost;
    }
}


async function allProfiles() {
    
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
            listProfiles(data);

        }

        else {
            console.log("error", data)
            
        }
    }

    catch (error) {
        console.log(error);
      
    }
};


function listProfiles (data) {

    console.log(data);

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
        feed.innerHTML += oneProfile;
    }

    const followButtons = document.getElementsByClassName("followButton");
    const unfollowButtons = document.getElementsByClassName("unfollowButton");

 

    for (let button of followButtons) {
        let buttonId = button.id;
     
        button.addEventListener("click", function (event) {
            event.preventDefault();
            // hvis button id(navnet på person) er i arrayen av mine følere, så disable button  
            followProfile(buttonId);
        })
    } // JAAAA FOR FAEN I HELVETE EG EIAR


    for (let button of unfollowButtons) {
        let buttonId = button.id;

         button.addEventListener("click", function (event) {
        event.preventDefault();
        unfollowProfile(buttonId);
        })
    } 
}