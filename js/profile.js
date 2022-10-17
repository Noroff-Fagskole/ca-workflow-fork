import '../style.css'

import { ALL_PROFILES_URL } from "./endpoints/api";
import {checkAccess} from "./utils/validation.js"
import { getToken } from "./storage/storage";
import {userProfile} from "./utils/header.js"
import {postComment} from './utils/request-functions.js';


checkAccess(getToken());

userProfile();

const queryString = window.location.search;
//console.log(queryString);

const profileID = new URLSearchParams(queryString).get('id');
//console.log(postId);

const ONE_PROFILE_URL = `${ALL_PROFILES_URL}${profileID}`;
//console.log(ONE_PROFILE_URL);

const showProfile = document.getElementById("single-profile");
const showPosts = document.getElementById("single-profile-posts");


const dayjs = require('dayjs')
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime);




(async function getProfile() {

    try {
        const response = await fetch (`${ONE_PROFILE_URL}?_posts=true&_following=true&_followers=true`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        })
        const data = await response.json();

        if (response.ok) {
            console.log("success");
            console.log(data);
            listProfile(data);
            listPosts(data.posts)
        }

        else {
            console.log("error", data)
        }
    }   

    catch (error) {
        console.log(error);
    }
})();

function listProfile (profile) {

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
    let unFollowButton;


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

     document.title = `| ${name} |`;



    oneProfile = 
        `
        <div class="pb-4 pt-4 px-4 bg-white flex flex-col items-center rounded-md text-center font-robotoC font-light text-sm cursor-pointer">
            
            <div class="border-2 border-mainBeige p-6 rounded-md flex items-center flex-row gap-12">
                <figure>
                    <img class="w-40 h-40 rounded-full shadow-md" src=${avatar}>
                </figure> 
                <div class="flex flex-col gap-2">
                    <h2 class="pt-4 text-xl font-semibold tracking-wide">${name}</h2>
                    <p class="text-sm pb-2">${email}</p>
                    <div>
                        ${followersHTML}  |  Following ${amountOfFollowing}
                    </div>
                    ${postsHTML}
                </div>
            </div>
        </div>
        `
        showProfile.innerHTML = oneProfile;
       
}



function listPosts (posts) {
    console.log(posts);

    let onePost;
    let allComments = "";
    let title;
    let content;
    let tags = [];
    let media;
    let updated;
    let created;
    let id;


    for (let post of posts) {

    if (post.title) {
        title = post.title;
    }

    if (post.body) {
        content = post.body;
    }
    if (post.tags) {
        for (let tag of post.tags) {
            tags += `<li class="bg-mainBeige">${tag}</li>`;
        }

    }
    if (post.media) {
        media = `<img class="w-fit max-h-52 box-content object-scale-down rounded-md" src="${post.media}">`
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



        onePost = 
         `<div class="bg-white drop-shadow-md rounded-lg flex flex-col py-8 px-8 justify-between items-start w-1/3 h-fit gap-8">
           <div class="flex flex-row gap-4 items-start justify-between p-4">
               <div class="flex flex-col gap-4 w-fit">
                   <h2 class="font-robotoC text-2xl uppercase font-normal tracking-wide">${title}</h2>
                   <p class="font-robotoC font-light text-normal leading-snug max-w-sm">${content}</p>
                   <ul class="flex flex-row gap-2">${tags}</ul>
                   <p class="flex flex-row items-center gap-2 font-josefine text-sm font-light w-max">
                       <img class="h-4" src="../../img/clock.png">Posted ${created}
                   </p>
                   <p class="flex flex-row items-center gap-2 text-sm w-max font-josefine font-extralight">
                       ${updated}
                   </p>
               </div>
               <div class="basis-1/2">
                   <figure>
                       ${media}
                   </figure>
               </div>
           </div>
   </div>`

       showPosts.innerHTML += onePost;
    }
    
}

 
    
