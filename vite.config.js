const {resolve} = require('path');
import vitePluginRequire from "vite-plugin-require";

export default {
    build: {
        rollupOptions: {
            input: {
                home: resolve(__dirname, 'index.html'),
                signUp: resolve(__dirname, 'signup.html'),
                logIn: resolve(__dirname, 'login.html'),
                singlePost: resolve(__dirname, 'post.html'),
                myProfile: resolve(__dirname, 'myprofile.html'),
            },
        },
    },
    plugins: [
		vitePluginRequire({
			// @fileRegex RegExp
			// optional：default file processing rules are as follows
			// fileRegex:/(.jsx?|.tsx?|.vue)$/
		}),
	],
};