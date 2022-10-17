import '../style.css'
import { ALL_POSTS_URL, ALL_PROFILES_URL } from "./endpoints/api";
import { getUsername, getToken } from "./storage/storage";
import { checkAccess } from './utils/validation';
import {myInfo} from './utils/request-functions';
import { userProfile } from './utils/header.js';



checkAccess(getToken());

userProfile();



const dayjs = require('dayjs')
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime);



const userSection = document.getElementById("usersData");
const myPostsURL = `${ALL_PROFILES_URL}${getUsername()}?_posts=true`;
//console.log(myPostsURL);

const myPosts = document.getElementById("my-posts");

const editSection = document.getElementById("edit-section");
const editForm = document.getElementById("edit-form");
const titleInputEDIT = document.getElementById("edit-title");
const mediaInputEDIT = document.getElementById("mediaEDIT");
const tagsInputEDIT = document.getElementById("tagsEDIT");
const contentInputEDIT = document.getElementById("edit-body");
const submitChangeButton = document.getElementById("submit-change-button");


const createPostForm = document.getElementById("create-post");
const titleInput = document.getElementById("title"); 
const contentInput = document.getElementById("body"); //opt
const tagsInput = document.getElementById("tags"); //opt
const mediaButton = document.getElementById("media-button"); //opt
const submitButton = document.getElementById("submit");
const xOut = document.getElementById("exitButton");

const settingsButton = document.getElementById("settingsButton");
const logOutButton = document.getElementById("logOutButton");
const editMediaSection = document.getElementById("edit-profile-media")
const editMediaForm = document.getElementById("edit-media-form")
const editAvatarInput = document.getElementById("change-avatar")
const editBannerInput = document.getElementById("change-banner")

const avatarIMG = document.getElementById("avatarIMG");
const bannerIMG = document.getElementById("bannerIMG");


settingsButton.addEventListener("click", getUserInfo);
logOutButton.addEventListener("click", ()=> {
    let doubleCheck = confirm("Are you sure?");
    if (doubleCheck === false) {
        return;
    }
    else {
        localStorage.clear();
    window.location.reload();
    }    
});

/*

function userProfile() {
    myInfo().then((value) => {
        listProfileData(value);
    })
};
userProfile();


function listProfileData(data) {
    console.log(data);

    let profileImg = data.banner;
    let profileName = data.name;
    let followers = data.followers.length;
    let following = data.following.length;

    userSection.innerHTML = 
    
    `
    <div class="flex flex-col items-center p-6 gap-6 rounded-md w-fit">
        <figure class="w-44 h-44">
            <img class="h-full rounded-full object-cover object-left shadow-md border border-white" src="${profileImg}">
        </figure>
        <p class="text-2xl tracking-wide font-josefine">${profileName}</p>
        <div class="flex flex-row font-robotoC font-extralight gap-6 text-sm">
            <div class="flex flex-col items-center">
                <span class="font-normal text-2xl font-josefine">${followers}</span>
                <p class="border rounded-md w-24 py-3 text-center">Followers</p>
            </div>
            <div class="flex flex-col items-center">
                <span class="font-normal text-2xl font-josefine">${following}</span>
                <p class="border rounded-md w-24 py-3 text-center">Following</p>
            </div>
        </div>
    </div>
    `
}*/

submitButton.addEventListener('click', function(event) {
    event.preventDefault();
    validatePost();

})


function validatePost () {

    let titleValue = titleInput.value;
    let contentValue = contentInput.value;
    let tagsValue = tagsInput.value;


    let validTitle = false;
    let validForm = false;


    if (titleValue) {
        validTitle = true;
    }


    const newPostBody = {
        title: `${titleValue}`,
    }

    if (contentValue) {
        newPostBody.body = `${contentValue}`;
    }

    if (tagsValue) {
        newPostBody.tags = [];
        newPostBody['tags'].push(tagsValue);     
    }

    //console.log(newPostBody);

    const bodyInJSON = JSON.stringify(newPostBody);

    if (validTitle) {
        validForm = true;
    }

    if (validForm) {
        requestPost(bodyInJSON);
    }
}


async function requestPost(body) {
    try {
        const response = await fetch(ALL_POSTS_URL, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                Authorization: `Bearer ${getToken()}`,
            },
            body: body,
        })

        const data = await response.json();

        if (response.ok) {
            console.log(data);
        }

        else {
            console.log("oh no" + data);
        }
    }

    catch (error) {
        console.log(error);
    }
}




(async function myPosts() {
    
    try {
        const response = await fetch(myPostsURL, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        })

        const data = await response.json();

        if (response.ok) {
            console.log("success");
            console.log(data.posts);
            listPosts(data);
        }

        else {
            console.log("error", data)
        }
    }

    catch (error) {
        console.log(error);
    }

})();

function listPosts ({posts}) {
    console.log(posts);

    let onePost;
    let allComments = "";
    let fullComment;
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
      tags = post.tags

    }
    if (post.media) {
        media = post.media;
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

   


    if (post.comments) {
  
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
    else {allComments = "No comments yet, be the first!"}
  
        onePost = 
         `<div id="nr${id}" data-id="${id}" data-title="${title}" data-content="${content}" data-tags="${tags}" data-media="${media}" class="dataset bg-white drop-shadow-md rounded-lg flex flex-col pb-4 w-96 h-fit gap-4">
            <a href="post.html?id=${id}" class="z-10">
                <div class="flex flex-row gap-4 items-start justify-between p-4">
                    <div class="flex flex-col gap-4 w-full">
                        <div class="w-full">
                            <figure class="w-full">
                                <img class="w-fit max-h-52 box-content object-scale-down rounded-md" src="${media}">
                            </figure>
                        </div>
                        <div class="flex flex-col gap-2 w-full items-center px-6">
                            <h2 class="font-robotoC text-xl md:text-2xl uppercase font-normal tracking-wide text-center">${title}</h2>
                            <p class="flex flex-row items-center gap-2 font-josefine text-sm font-light w-max">
                                <img class="h-4" src="../../img/clock.png">Posted ${created}
                            </p>
                            <p class="flex flex-row items-center gap-2 text-sm font-josefine font-extralight w-max">
                                ${updated}
                            </p>
                            <hr class="w-full bg-mainBeige h-0.5">
                            <p class="font-robotoC font-light text-md leading-snug max-w-sm py-4">
                                ${content}
                            </p>
                            <ul>${tags}</ul>
                            <hr class="w-full bg-mainBeige h-0.5">
                        </div>
                    </div>
                </div>
            </a>
            <div class="flex flex-col gap-8 w-full px-6">
                <form id="${id}" class="commentForm flex flex-col gap-2">
                    <input class="focus:outline-none border border-mainBeige rounded-md w-full py-2 px-4 text-sm" type="text" name="comment" id="comment" placeholder="Comment on the post">
                    <button class="w-fit text-xs bg-mainBeige shadow-md py-2 px-4 rounded-md ml-auto">Comment</button>
                </form>
                <div class="font-robotoC font-light bg-mainBeige px-2 py-3 text-sm">
                    ${allComments}
                </div>
            </div>
            <hr class="my-4">
            <div class="flex flex-row justify-center gap-6">
                <button id="${id}" class="editButton bg-mainBeige shadow-md py-3 px-6 rounded-md"><img class="w-4" src="../img/edit.png"></button>
                <button id="${id}" class="deleteButton bg-amber-900 shadow-md py-2 px-5 rounded-md"><img class="w-6" src="../img/trash_white.svg"></button>
            </div>
        </div>
     `

        myPosts.innerHTML += onePost;


      
       
        

        const editButtons = document.getElementsByClassName("editButton");
        const deleteButtons = document.getElementsByClassName("deleteButton");


        let buttonId;
      
     

       
        for (let button of editButtons) {
            button.addEventListener("click", function (event) {
                event.preventDefault();
                buttonId = button.id;
                console.log(buttonId);
                beforeEdit(buttonId);
            })
        }


        for (let button of deleteButtons) {
            button.addEventListener("click", function (event) {
                event.preventDefault();
                buttonId = button.id;
                //console.log(buttonId);
               deletePost(buttonId);
            })
        }


        function beforeEdit (buttonId) {
            const div = document.getElementById(`nr${buttonId}`);
            let postId = div.dataset.id;
            let postTitle = div.dataset.title;
            let postContent = div.dataset.content;
            let postMedia = div.dataset.media;
            let postTags = div.dataset.tags;
            editPost(postId, postTitle, postContent, postMedia, postTags)
        }

  
    }
}



function editPost (id, title, content, media, tags) {
    console.log(id, title);

    let validForm = false;
    let postID;



    editSection.classList.remove("hidden");
  

    xOut.addEventListener("click", function(event) {
            editSection.classList.add("hidden");
    })

    
    if (id) {
        postID = id;
    }

    if (title) {
        titleInputEDIT.value = title;
    }

    if (content) {
        contentInputEDIT.value = content;
    }

    if (tags) {
        tagsInputEDIT.value = tags;
    }
    if (media) {
        mediaInputEDIT.value = media;
    }

   




    let alteredTitle;
    let alteredContent;
    let alteredTags;  
    let alteredMedia;




    submitChangeButton.addEventListener("click", function (event) {
        event.preventDefault();
        console.log(postID);
        alteredTitle = titleInputEDIT.value;
        alteredContent = contentInputEDIT.value;
        alteredTags = tagsInputEDIT.value;
        alteredMedia = mediaInputEDIT.value;
        const theBody = updateBody(alteredTitle, alteredContent, alteredTags, alteredMedia);
        console.log(theBody);
        requestChange(theBody, postID);
    })  
    
    let updatedBody;


    function updateBody (title, content, tags, media) {
        updatedBody = {
            title: `${title}`,
            body: `${content}`,
            tags: `${tags}`,
            media: `${media}`
        }
        console.log(updatedBody);
        let jsonBody =  JSON.stringify(updatedBody);
        return jsonBody;
    }
}

async function requestChange(body, id) {
    
    try {
        const response = await fetch(`${ALL_POSTS_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                Authorization: `Bearer ${getToken()}`,
            },
            body: body,
        })

        const data = await response.json();

        if (response.ok) {
            console.log("success");
            //console.log(data);
            window.location.reload();
        }
        else {
            console.log("error", data)
        }
    }

    catch (error) {
        console.log(error);
    }

};


async function deletePost(id) {
    
    try {
        const response = await fetch(`${ALL_POSTS_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        })

        const data = await response.json();

        if (response.ok) {
            console.log("success");
            //console.log(data);
            //window.location.reload();
        }
        else {
            console.log("error", data)
        }
    }

    catch (error) {
        console.log(error);
    }

};

function getUserInfo() {
    myInfo().then((value) => {
        showProfileMedia(value);
    })
};


function showProfileMedia (data) {

    let banner;
    let avatar;
    let profileName = data.name;

    if(data.banner) {
        banner = data.banner;
    }

    if(data.avatar) {
        avatar = data.avatar;
    }

    editMediaSection.classList.remove("hidden");
    editMediaSection.classList.add("absolute");

    document.addEventListener("click", function(event) {
        if( !event.target.closest(".modal")) {
            closeOverlay();
        }
    },false)

    function closeOverlay() {
        editMediaSection.classList.add("hidden");
        editMediaSection.classList.remove("absolute");
      }

    editAvatarInput.value = avatar;
    editBannerInput.value = banner;

    let alteredAvatar;
    let alteredBanner;

    let avatarImg = `<img class="h-full w-full rounded-full object-cover" src="${avatar}">`;
    avatarIMG.innerHTML = avatarImg;

    let bannerImg = `<img class="h-full w-full rounded-full object-cover" src="${banner}">`;
    bannerIMG.innerHTML = bannerImg;

    editMediaForm.addEventListener("submit", function (event) {
        event.preventDefault();
        alteredAvatar = editAvatarInput.value;
        alteredBanner = editBannerInput.value;
        let mediaBody = updateMedia(alteredBanner, alteredAvatar);
        console.log(mediaBody)
        requestMediaChange(mediaBody, profileName);
    })

    function updateMedia (banner, avatar) {
        let newBody = {
            banner: `${banner}`,
            avatar: `${avatar}`
        }
        console.log(newBody);
        let inJSON =  JSON.stringify(newBody);
        return inJSON;
    }
}

async function requestMediaChange(body, name) {
    
    try {
        const response = await fetch(`${ALL_PROFILES_URL}${name}/media`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                Authorization: `Bearer ${getToken()}`,
            },
            body: body,
        })

        const data = await response.json();

        if (response.ok) {
            console.log("success");
            //console.log(data);
            window.location.reload();
        }
        else {
            console.log("error", data)
        }
    }

    catch (error) {
        console.log(error);
    }

};
