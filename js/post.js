

import { ALL_POSTS_URL } from "./endpoints/api";

import { getToken } from "./storage/storage";

const queryString = window.location.search;
//console.log(queryString);

const postId = new URLSearchParams(queryString).get('id');
//console.log(postId);

const ONE_POST_URL = `${ALL_POSTS_URL}/${postId}`;
//console.log(ONE_POST_URL);

const showPost = document.getElementById("single-post");


(async function getPost() {

    try {
        const response = await fetch (ONE_POST_URL, {
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

    //console.log(data);

    let post;
    let fullComment;

    let title;
    let content;
    let tags = [];
    let media;
    let created;
    let updated;
    let id;
    let info;



    if (data.title) {
        title = data.title;
    }

    if (data.body) {
        content = data.body;
    }
    if (data.tags) {
        for (let tag of data.tags) {
            tags += `<li>${tag}</li>`;
        }

    }
    if (data.media) {
        media = data.media
    }
    if (data.created) {
        created = data.created
    }
    if (data.updated) {
        updated = data.updated
    }
    if (data.id) {
        id = data.id
    }

        post = 
        `
        <div class="p-6 mb-4 bg-gray-100 max-w-md">
        <h2 class="pb-2 text-xl font-bold">${title}</h2>
        <p>${content}</p>
        <ul>${tags}</ul>
        <figure><img src=${media}></figure>
        <p>${created}</p>
        <p>${updated}</p>
        <p>id: ${id}</p> <br>
        </div>
        `

        showPost.innerHTML = post;
    
}