const {resolve} = require('path');

export default {
    build: {
        rollupOptions: {
            input: {
                home: resolve(__dirname, 'index.html'),
                signUp: resolve(__dirname, 'signup.html'),
                logIn: resolve(__dirname, 'login.html'),
                feed: resolve(__dirname, 'feed.html'),
                singlePost: resolve(__dirname, 'post.html'),
            },
        },
    },
};