import { ALL_POSTS_URL } from "./endpoints/api";
import { getToken } from "./storage/storage";

const createPostForm = document.getElementById("create-post");
const titleInput = document.getElementById("title"); 
const contentInput = document.getElementById("body"); //opt
const tagsInput = document.getElementById("tags"); //opt
const mediaButton = document.getElementById("media-button"); //opt
const submitButton = document.getElementById("submit");

submitButton.addEventListener("click", submitForm);

function submitForm (event) {
    event.preventDefault();
    createPostForm.submit; //funker dette?
    validatePost();

    console.log("submitted");

}

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






async function deletePost(id) {
    try {
        const response = await fetch(`${ALL_POSTS_URL}/${id}`, {
            method: "DELETE",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                Authorization: `Bearer ${getToken()}`,
            },
          })
        
          const data = await response.json();

          if (response.ok) {
            console.log("deleted");
          }

          else {
            console.log("error", data)
          }
    }
    
    catch (error) {
        console.log(error);
    }
};

deletePost(73);
