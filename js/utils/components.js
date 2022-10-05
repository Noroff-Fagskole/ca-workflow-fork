import '../index.js'
import {myInfo} from './request-functions';

const nav = document.getElementById("nav");



let logo = `<a href="index.html"><h1 class=" text-xs bg-white inline-block p-2 rounded-full">Social <br> Media</h1></a>`;

async function getInfo() {
    const data = await myInfo();
    console.log(data);
}
getInfo();



function myHeader () {

    let imgURL;

        const resolved = Promise.resolve(myInfo());
        resolved.then((value) => {
            //console.log(value.banner);
            imgURL = value.banner;
            

        nav.innerHTML = `
            <div>${logo}</div>
            <div class="rounded-full" style="background-image: url(${imgURL})">
            Content</div>`
    });
}

//myHeader()