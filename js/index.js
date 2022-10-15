import '../style.css'
import { ALL_POSTS_URL } from "./endpoints/api";
import { ALL_PROFILES_URL, queryStringProfileInfo } from "./endpoints/api";
import { getToken, getUsername } from "./storage/storage";
import { checkAccess, confirmingPassword } from './utils/validation';
import {myInfo} from './utils/request-functions';
import { postComment } from './utils/request-functions';
import {userProfile} from "./utils/header.js"





import { zip } from 'lodash';


const dayjs = require('dayjs')
//import dayjs from 'dayjs' // ES 2015


var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime);




checkAccess(getToken());

userProfile();


const feed = document.getElementById("feed");
const profiles = document.getElementById("listProfiles");

const showPosts = document.getElementById("show-posts");
const showProfiles = document.getElementById("show-profiles");



showPosts.addEventListener("click", function() {
    //console.log("posts");
    feed.innerHTML = "";
    allPosts();
    showPosts.disabled = true;
    showProfiles.disabled = false;
})

showProfiles.addEventListener("click", function() {
    //console.log("profiles");
    feed.innerHTML = "";
    profileInfoForListing();
    showPosts.disabled = false;
    showProfiles.disabled = true;
})

const queryString = window.location.search;
//console.log(queryString);







async function allPosts() {
    
    try {
        const response = await fetch(`${ALL_POSTS_URL}/?_author=true&_comments=true&limit=10`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        })

        const data = await response.json();

        if (response.ok) {
            //console.log("success");
            //console.log(data);
            listPosts(data);
            sendposts(data)
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




const theArr = [];
function sendposts(posts) {
  
    for (let post of posts) {
        theArr.push(post)
    }

    return theArr;
}

console.log("hei",theArr)




function listPosts (data) {
    console.log(data);


    for (let post of data) {


    let onePost;
    let allComments = "";
    let title;
    let content;
    let tags = [];
    let media;
    let created;
    let updated;
    let id;
    let creator;


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

  
    if (post.author["name"]) {
        creator = post.author["name"];
        //console.log(creator);
    }

    if (post.media) {
        media = `<img class="rounded-t-md w-full max-h-52 object-cover" src="${post.media}">`
    }

    if (post.media === "") {
        media = "";
    }

    if (post.created) {
        let time = dayjs().to(dayjs(post.created));
        created = time;
    }

    if (post.updated) {
        
        let timeUpdated = dayjs().to(dayjs(post.updated));
        if (timeUpdated !== created) {
            updated =  `<img class="h-4" src="../../img/clock.png">Last updated ${timeUpdated}`;
        }
        else { updated = ""};
    }
    if (post.id) {
        id = post.id
    }

    if (post.comments != "") {

        console.log(post.comments);
  
       
        let fullComment;
        let commentsArray = post.comments;
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
            commentCreated = dayjs().to(dayjs(comment.created));

            fullComment =
            `<div class="flex flex-col gap-2 my-4 px-6 items-end odd:items-start">
                <p class="uppercase font-normal">${commenter}</p>
                <div class="flex flex-col items-end gap-2">
                    <p class="bg-white px-8 py-2 w-fit rounded-md">${commentContent}</p>
                    <p class="flex flex-row items-center gap-2 font-josefine text-sm font-light">
                        ${commentCreated}
                    </p>
                </div>
            </div>
            `
            allComments += fullComment;
        }
    }
    else {allComments = `<p class="text-center">No comments yet, be the first!</p>`}



  
        onePost = 
        `<div class="bg-white drop-shadow-md rounded-lg flex flex-col pb-4 w-96 h-fit gap-4">
             <a href="post.html?id=${id}">
                <div class="flex flex-col gap-4 w-full">
                    <div class="w-full">
                        <figure class="w-full">
                         ${media}
                        </figure>
                    </div>
                    <div class="flex flex-col gap-2 w-full items-center px-6">
                    <p class="font-light text-sm"> //  ${creator}</p>
                        <h2 class="font-robotoC text-xl md:text-2xl uppercase font-normal tracking-wide text-center">${title}</h2>
                     
                        <p class="flex flex-row items-center gap-2 font-josefine text-sm font-light w-max">
                        <img class="h-4" src="../../img/clock.png">Posted ${created}
                        </p>
                        <p class="flex flex-row items-center gap-2 text-sm font-josefine font-extralight w-max">
                            ${updated}
                        </p>
                        <hr class="w-full bg-mainBeige h-0.5">
                        <p class="font-robotoC font-light text-md leading-snug max-w-sm py-4">${content}</p>
                        <ul>${tags}</ul>
                        <hr class="w-full bg-mainBeige h-0.5">
                    </div>
                </div>
                </a>
                <div class="flex flex-col gap-8 w-full px-6">
                    <form id="${id}" class="commentForm flex flex-col gap-2">
                        <input class="focus:outline-none border border-mainBeige rounded-md w-full py-2 px-4 text-sm" type="text" name="comment" id="comment" placeholder="Comment on ${creator}s post">
                        <button class="w-fit text-xs bg-mainBeige shadow-md py-2 px-4 rounded-md ml-auto">Comment</button>
                    </form>
                    <div class="font-robotoC font-light bg-mainBeige px-2 py-3 text-sm">${allComments}</div>
                </div>
            </div>`
  
        feed.innerHTML += onePost;
   

        
      
        let commentForms = document.getElementsByClassName("commentForm");
        //console.log(commentForms);
  
        let requestBody;

     

        for (let form of commentForms) {
            form.addEventListener("submit", function(event) {
                event.preventDefault();
                let postId = form.id;
                let commentContent = form[0].value;
                    if (commentContent === "") {
                        requestBody = null;
                        console.log("oops")//vise feilmelding
                    }
                    else {
                        requestBody = `{"body": "${commentContent}"}`;
                       
                    }

                postComment(postId, requestBody);
            })
        }
    }
}


function profileInfoForListing() {
    myInfo().then((value) => {
        allProfiles(value);
    })
};


async function allProfiles(value) {
    
    try {
        const response = await fetch(`${ALL_PROFILES_URL}?_followers=true&_following=true&_posts=true&limit=50`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        })

        const data = await response.json();

        if (response.ok) {
            //console.log("success");
            listProfiles(data, value);

        }

        else {
            console.log("error", data)
            
        }
    }

    catch (error) {
        console.log(error);
      
    }
};



function listProfiles (data, value) {

    console.log(data, value);
    
    let onlyNames = [];
    let following = value.following;
    console.log(following);
    for (let person of following) {
        onlyNames.push(person.name)
    }
    console.log(onlyNames)

    let oneProfile = "";

    let name;
    let email;
    let banner;
    let avatar;
    let amountOfFollowers;
    let followersHTML;
    let amountOfFollowing;
    let amountOfPosts;
    let postsHTML;
    let followButton;
    let unFollowButton

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

    if (profile.followers) {
       amountOfFollowers = profile.followers.length;
        if(amountOfFollowers === 1) {
            followersHTML = `<span class="font-semibold text-normal">${amountOfFollowers}</span> Follower`
        }
        else { followersHTML = `<span class="font-semibold text-normal">${amountOfFollowers}</span> Followers`}
    }
   

    if (profile.following) {
        amountOfFollowing = profile.following.length;
     }

     if (profile.posts) {
        amountOfPosts = profile.posts.length;
        if (amountOfPosts === 1) {
            postsHTML =  `<p><span class="font-semibold text-normal">${amountOfPosts}</span> Post</p>`
        }
        else {postsHTML =  `<p><span class="font-semibold text-normal">${amountOfPosts}</span> Posts</p>`}
     }

    let plass = onlyNames.indexOf(name);

    if (plass !== -1) {
        followButton = `<button id="${name}" disabled class="followButton bg-mainBeige py-2 px-4 rounded-full flex flex-row align-middle shadow-sm"><img class="h-5" src="../img/verified-user.png">Following</button>`;
        unFollowButton = `<button id="${name}" class="unfollowButton hover:scale-105 bg-orange-100 py-2 px-4 rounded-full shadow-lg ">Unfollow</button>`
    }
    else {
        followButton = `<button id="${name}" class="followButton bg-mainBeige py-2 px-6 rounded-full shadow-lg hover:scale-105">Follow</button>`;
        unFollowButton = `<button id="${name}" class="unfollowButton hidden">Unfollow</button>`;
    }

    //en if her omat hvis name er samme som i ifollowlisten så er det et annet classNamw


    oneProfile = 
        `<a href="profile.html?id=${name}">
        <div class="pb-4 pt-4 px-4 mb-28 bg-white max-w-sm flex flex-col items-center rounded-md text-center font-robotoC font-light text-sm cursor-pointer">
            
            <div class="relative border-2 border-mainBeige w-48 h-48 rounded-md pt-8 flex flex-col gap-2 hover:shadow-lg">
                <figure class="absolute -top-20 left-10">
                    <img class="w-28 h-28 rounded-full  shadow-md hover:shadow-lg" src=${avatar}>
                </figure> 
                <h2 class="pt-4 text-xl font-semibold tracking-wide">${name}</h2>
                <p class="text-sm pb-2">${email}</p>
                <div>
                    ${followersHTML}  |  Following ${amountOfFollowing}
                </div>
                ${postsHTML}
            </div>
            <div class="flex flex-row gap-4 mt-6">
            ${followButton}
            ${unFollowButton}
            </div>
        </div>
        </a>
        `
        feed.innerHTML += oneProfile;
        feed.classList.add("flex-wrap", "justify-between");
        feed.classList.remove("flex-col");
    }

    //  
   // <figure><img class="w-40 h-40" src=${banner}></figure>
    const followButtons = document.getElementsByClassName("followButton");
    const unfollowButtons = document.getElementsByClassName("unfollowButton");

 
    followHandling(followButtons);
    unFollowHandling(unfollowButtons);
}





function followHandling(buttons) {

    for (let button of buttons) {
        let buttonId = button.id;
     
        button.addEventListener("click", function (event) {
            event.preventDefault();
            // hvis button id(navnet på person) er i arrayen av mine følere, så disable button  
            followProfile(buttonId);
            button.classList.add("followingButton")
        })
    } // JAAAA FOR FAEN I HELVETE EG EIAR
}

function unFollowHandling(buttons) {

    for (let button of buttons) {
        let buttonId = button.id;

         button.addEventListener("click", function (event) {
            event.preventDefault();
            unfollowProfile(buttonId);
        })
    } 
}


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
            userProfile();
            profileInfoForListing();

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
            userProfile();

        }

        else {
            console.log("error", data)
        }
    }

    catch (error) {
        console.log(error);
    }

};




