import '../style.css'
import { ALL_POSTS_URL, ALL_PROFILES_URL, queryStringPosts } from "./endpoints/api";
import { getUsername, getToken } from "./storage/storage";

const myPostsURL = `${ALL_PROFILES_URL}${getUsername()}${queryStringPosts}`;
//console.log(myPostsURL);

const myPosts = document.getElementById("my-posts");

const editSection = document.getElementById("edit-section");
const editForm = document.getElementById("edit-form");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("body");
const submitChangeButton = document.getElementById("submit-change-button");


async function myData() {

    let myBody = {
        "banner": "stilig",
        "avatar": "funk"
    }

    let myJSINBody = JSON.stringify(myBody);
    
    try {
        const response = await fetch(`https://nf-api.onrender.com/api/v1/social/profiles/Sara/media`, {
            method: 'PUT',
            body: JSON.stringify({
                banner: "https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_1280.jpg",
                avatar: "https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_1280.jpg"
            }),
            headers: {
                Authorization: `Bearer ${getToken()}`,
                'Content-type': 'application/json; charset=UTF-8',
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

}; // Ikke i bruk, funksjon for å endre profile media


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

function listPosts ({posts}) {
    console.log(posts);

    let onePost;

    let title;
    let content;
    let tags = [];
    let media;
    let created;
    let updated;
    let id;
    let info;

    for (let post of posts) {

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
  
        onePost = 
        `
        <div class="p-6 mb-4 bg-gray-100 max-w-md">
        <h2 class="pb-2 text-xl font-bold">${title}</h2>
        <p>${content}</p>
        <ul>${tags}</ul>
        <figure><img src=${media}></figure>
        <p>${created}</p>
        <p>${updated}</p>
        <p>id: ${id}</p> <br>
        <button id="${id}" class="editButton bg-red-300 p-2 rounded-md">Edit</button>
        </div>
        `
        myPosts.innerHTML += onePost;

        const editButtons = document.getElementsByClassName("editButton");

        let buttonId;

        for (let button of editButtons) {
            button.addEventListener("click", function (event) {
                event.preventDefault();
                buttonId = button.id;
                console.log(buttonId);
                editPost(buttonId, post);
            })
        }
    }
}

function editPost (id, data) {
    //console.log(data);

    let validForm = false;
    editSection.classList.remove("hidden");

    const postID = id;

    if (data.title) {
        titleInput.value = data.title;
    }

    if (data.body) {
        contentInput.value = data.body;
    }

    let alteredTitle;
    let alteredContent;

    submitChangeButton.addEventListener("click", function (event) {
        event.preventDefault();
        console.log(postID);
        alteredTitle = titleInput.value;
        alteredContent = contentInput.value;
        const theBody = updateBody(alteredTitle, alteredContent);
        console.log(theBody);
        requestChange(theBody, postID);
    })  
    
    let updatedBody;


    function updateBody (title, content) {
        updatedBody = {
            title: `${title}`,
            body: `${content}`
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

