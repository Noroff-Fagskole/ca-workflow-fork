import { getUsername, getToken } from "../storage/storage";
import { ALL_PROFILES_URL, queryStringProfileInfo } from "../endpoints/api";
import { ALL_POSTS_URL } from "../endpoints/api";

const profileUser = getUsername();

const profileInfoURL = `${ALL_PROFILES_URL}${profileUser}${queryStringProfileInfo}`;

async function myInfo() {

    try {
        const response = await fetch(profileInfoURL, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        })

        const data = await response.json();

        if (response.ok) {
            //console.log("success");
            //console.log(data);
            return data;
        }

        else {
            console.log("error", data)
        }
    }
    catch (error) {
        console.log(error);
    }
};



async function postComment(postId, body) {
    console.log(body,postId);
    try {
        const response = await fetch(`${ALL_POSTS_URL}/${postId}/comment`, {
            method: 'POST',
            body: body,
            headers: {
                Authorization: `Bearer ${getToken()}`,
                'Content-type': 'application/json; charset=UTF-8',
            },
            
        })

        const data = await response.json();

        if (response.ok) {
            //console.log("success");
            console.log(data);
            
        }

        else {
            console.log("error", data)
        }
    }
    catch (error) {
        console.log(error);
    }
};



export {myInfo, postComment}

