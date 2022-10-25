import "../style.css";

import { ALL_POSTS_URL } from "./endpoints/api";
import { checkAccess } from "./utils/validation.js";
import { getToken } from "./storage/storage";
import { userProfile } from "./utils/header.js";
import { postComment } from "./utils/request-functions";

checkAccess(getToken());

userProfile();

const dayjs = require("dayjs");
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const queryString = window.location.search;
const postId = new URLSearchParams(queryString).get("id");
const ONE_POST_URL = `${ALL_POSTS_URL}/${postId}`;
const showPost = document.getElementById("single-post");

(async function getPost() {
  try {
    const response = await fetch(
      `${ONE_POST_URL}?_author=true&_comments=true`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    const data = await response.json();

    if (response.ok) {
      console.log("success");
      console.log(data);
      listPost(data);
    } else {
      console.log("error", data);
    }
  } catch (error) {
    console.log(error);
  }
})();

function listPost(data) {
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
    media = `<img class="w-fit max-h-52 box-content object-scale-down rounded-md" src="${data.media}">`;
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
      updated = `<img class="h-4" src="../../img/clock.png">Last updated ${timeUpdated}`;
    } else {
      updated = "";
    }
  }
  if (data.id) {
    id = data.id;
  }

  document.title = `${title} | By ${creator}`;

  if (data.comments != "") {
    let fullComment;
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

      fullComment = `<div class="flex flex-col gap-2 my-4 px-6 items-end odd:items-start">
                    <p class="uppercase font-normal">${commenter}</p>
                    <div class="flex flex-col items-end gap-2">
                        <p class="bg-white px-8 py-2 w-fit rounded-md">${commentContent}</p>
                        <p class="flex flex-row items-center gap-2 font-josefine text-sm font-light">
                            ${commentCreated}
                        </p>
                    </div>
                </div>
                `;
      allComments += fullComment;
    }
  } else {
    allComments = `<p class="text-center">No comments yet, be the first!</p>`;
  }

  onePost = `<div class=" flex flex-col pb-4 w-full h-fit gap-4">
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
                    <div class="flex flex-col gap-8 w-full px-6">
                        <form id="${id}" class="commentForm flex flex-col gap-2">
                            <input class="focus:outline-none border border-mainBeige rounded-md w-full py-2 px-4 text-sm" type="text" name="comment" id="comment" placeholder="Comment on ${creator}s post">
                            <button class="w-fit text-xs bg-mainBeige shadow-md py-2 px-4 rounded-md ml-auto">Comment</button>
                        </form>
                        <div class="font-robotoC font-light bg-mainBeige px-2 py-3 text-sm">${allComments}</div>
                    </div>
                </div>`;

  showPost.innerHTML = onePost;

  let commentForms = document.getElementsByClassName("commentForm");
  //console.log(commentForms);

  let requestBody;

  for (let form of commentForms) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      let postId = form.id;
      let commentContent = form[0].value;
      if (commentContent === "") {
        requestBody = null;
        console.log("oops"); //vise feilmelding
      } else {
        requestBody = `{"body": "${commentContent}"}`;
      }

      postComment(postId, requestBody);
    });
  }
}
