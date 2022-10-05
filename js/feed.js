import '../style.css'
import { ALL_POSTS_ADDITIONAL_URL } from "./endpoints/api";
import { getToken } from "./storage/storage";

const feed = document.getElementById("allposts");

const queryString = window.location.search;
console.log(queryString);


(async function allPosts() {
    
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

})();


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
            tags += `<li>${tag}</li>`;
        }

    }
    if (post.media) {
        media = post.media
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
        <div class="p-6 mb-4 bg-gray-100 max-w-md">
        <h2 class="pb-2 text-xl font-bold">${title}</h2>
        <p>${content}</p>
        <ul>${tags}</ul>
        <figure><img src=${media}></figure>
        <p>${created}</p>
        <p>${updated}</p>
        <p>id: ${id}</p> <br>

        ${fullComment}
        </div>
        </a>
        `

        feed.innerHTML += onePost;
    }
}
