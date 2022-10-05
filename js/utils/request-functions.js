import { getUsername, getToken } from "../storage/storage";
import { ALL_PROFILES_URL, queryStringProfileInfo } from "../endpoints/api";

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
            console.log("success");
            console.log(data);
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

const infomartion = myInfo().then(r => {
    return r;
})
console.log("my info", infomartion);

export {myInfo}

