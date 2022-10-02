
const API_BASE_URL = "https://nf-api.onrender.com/";


const SIGN_UP_URL = API_BASE_URL + "api/v1/social/auth/register";

const LOG_IN_URL = API_BASE_URL + "api/v1/social/auth/login";

const ALL_POSTS_URL = API_BASE_URL + "api/v1/social/posts";

const ALL_POSTS_ADDITIONAL_URL = API_BASE_URL + "api/v1/social/posts/?_author=true&_comments=true&reactions=true";


const ALL_PROFILES_URL = API_BASE_URL + "api/v1/social/profiles/";



//const paramByID = "/api/v1/social/posts/229"

const queryStringProfileInfo = "?_posts=true&_following=true&_followers=true";


export {SIGN_UP_URL, LOG_IN_URL, ALL_POSTS_URL, ALL_POSTS_ADDITIONAL_URL, ALL_PROFILES_URL, queryStringProfileInfo};