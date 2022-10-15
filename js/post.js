import '../style.css'

import { ALL_POSTS_URL } from "./endpoints/api";
import {checkAccess} from "./utils/validation.js"
import { getToken } from "./storage/storage";
import {userProfile} from "./utils/header.js"


checkAccess(getToken());

userProfile();

const dayjs = require('dayjs')
//import dayjs from 'dayjs' // ES 2015


var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime);

checkAccess(getToken());
myHeader();

const queryString = window.location.search;
//console.log(queryString);

const postId = new URLSearchParams(queryString).get('id');
//console.log(postId);

const ONE_POST_URL = `${ALL_POSTS_URL}/${postId}`;
//console.log(ONE_POST_URL);

const showPost = document.getElementById("single-post");


(async function getPost() {

    try {
        const response = await fetch (`${ONE_POST_URL}?_author=true&_comments=true`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        })
        const data = await response.json();

        if (response.ok) {
            console.log("success");
            console.log(data);
            listPost(data);
        }

        else {
            console.log("error", data)
        }
    }   

    catch (error) {
        console.log(error);
    }
})();

function listPost (data) {

    
        let onePost;
        let allComments = "";
        let fullComment;
        let title;
        let content;
        let tags = [];
        let media;
        let created;
        let updated;
        let id;
        let creator;
    
        if (data.title) {
            title = data.title;
        }
    
        if (data.body) {
            content = data.body;
        }
        if (data.tags) {
            for (let tag of data.tags) {
                tags += `<li>${tag}</li>`; //TODO får du objekter i arrays..
            }
    
        }
    
      
        if (data.author["name"]) {
            creator = data.author["name"];
            //console.log(creator);
        }
    
        if (data.media) {
            media = `<img class="w-fit max-h-52 box-content object-scale-down rounded-md" src="${data.media}">`
        }
    
        if (data.media === "") {
            media = "";
        }
    
        if (data.created) {
            let time = dayjs().to(dayjs(data.created));
            created = time;
        }
    
        if (data.updated) {
            
            let timeUpdated = dayjs().to(dayjs(data.updated));
            if (timeUpdated !== created) {
                updated =  `<img class="h-4" src="../../img/clock.png">Last updated ${timeUpdated}`;
            }
            else { updated = ""};
        }
        if (data.id) {
            id = data.id
        }
    
        if (data.comments) {
      
            let commentsArray = data.comments;
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
            `<div class="bg-white drop-shadow-md rounded-lg flex flex-col py-8 px-8 justify-between items-start w-full h-fit gap-8">
                 <a href="post.html?id=${id}">
                    <div class="flex flex-row gap-4 items-start justify-between p-4">
                        <div class="flex flex-col gap-4 w-max">
                            <h2 class="font-robotoC text-2xl uppercase font-normal tracking-wide w-max">${title}</h2>
                            <p class="font-light text-sm"> //  ${creator}</p>
                            <p class="font-robotoC font-light text-normal leading-snug max-w-sm">${content}</p>
    
                            <ul>${tags}</ul>
        
                            <p class="flex flex-row items-center gap-2 font-josefine text-sm font-light w-max">
                                <img class="h-4" src="../../img/clock.png">Posted ${created}
                            </p>
    
                            <p class="flex flex-row items-center gap-2 text-sm font-josefine font-extralight w-max">
                                ${updated}
                            </p>
                        </div>
                        <div class="basis-1/2">
                            <figure>
                                ${media}
                            </figure>
                        </div>
                    </div>
                    </a>
                    <div class="flex flex-col gap-8 w-full">
                        <form class="commentForm flex flex-col gap-2">
                            <input class="focus:border-none border border-mainBeige rounded-md w-full py-4 px-4 text-sm" type="text" name="comment" id="comment" placeholder="Comment on ${creator}s post">
                            <button class="w-fit text-xs bg-mainBeige shadow-md py-2 px-4 rounded-md ml-auto">Comment</button>
                        </form>
                        <div class="font-robotoC font-light bg-mainBeige rounded-md p-4">${allComments}</div>
                    </div>
                </div>`
      
            showPost.innerHTML = onePost;
        }
    
            let commentForms = document.getElementsByClassName("commentForm");
            //console.log(commentForms);
    
    
            for (let form of commentForms) {
                form.addEventListener("submit", function(event) {
                    event.preventDefault();
                    let requestBody;
                    let commentContent = form[0].value;
                        if (commentContent === "") {
                            requestBody = null;
                            console.log("oops")//vise feilmelding
                        }
                        else {
                            requestBody = `{"body": "${commentContent}"}`;
                        }
                    //console.log(requestBody);
                    let postId = id;
                    postComment(postId, requestBody);
                    // legge alt som har med liste ut kommentarfeltet i en funksjon og kjøre igjen her
                    
                })
 }
    
