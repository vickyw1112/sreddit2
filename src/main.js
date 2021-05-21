import API from './api.js';
// A helper you may want to use when uploading new images to the server.
import {clearPage, 
        createElement, 
        user_info, 
        push_notification} from './helpers.js';
import {loginPage} from './init.js'
import {feed} from "./feeds.js"
import{generate_post_form} from "./post.js"
import {profile_page} from "./profile.js"
// This url may need to change depending on what port your backend is running
// on.
// const api = new API('http://localhost:5000');
//TODO put this in Log out
// localStorage.clear();
if(localStorage.getItem('isLogin') === null) {
    localStorage.setItem('isLogin', 'false');
}

// else {
//Registered routes
var routes = [
    {
        url: 'login', callback: function (username) {
            clearPage("root");
            loginPage();
        }
    }
];

//Routing function
function Routing() {
    var hash = window.location.hash.substr(1).replace(/\//ig, '/');
    var username = "me";
    if(hash.includes("=")){
        var t = hash.split("="); 
        hash = t[0];
        username = t[1]; 
    }

    var route = routes[0];
    //Find matching route
    if(localStorage.getItem('isLogin') === 'true'){
        var route = routes[1];
        for (var index = 0; index < routes.length; ++index) {
            var testRoute = routes[index];
            if (hash == testRoute.url) {
                route = testRoute;
            }
        }
    } 

    if(route === null) {
        clearPage("body");
        document.body.appendChild(createElement("h2", "Page Not Found", {id: "page-not-found"}));
    }
    route.callback(username);
}
//Listener
window.addEventListener('popstate', Routing);
//Initial call
setTimeout(Routing, 0);
//Add other routes
routes.push({ url: "feed", callback: function (username) {
    clearPage("root");
    // const home = document.querySelector("#home");
    // nav_click(home);
    feed();
}});

routes.push({ url: "create", callback: function (username) {
    clearPage("root");
    const create_btn = document.querySelector("#create-btn");
    nav_click(create_btn);
    generate_post_form();
}});
routes.push({ url: "profile", callback: function (username) {
    clearPage("root");
    const profile = document.querySelector("#profile-btn");
    nav_click(profile);
    if(username === "me" || username === localStorage.getItem("username")) {
        user_info().then(data => {
            profile_page(data);
        });
    }
    else {
        username = username.charAt(0).toUpperCase() + username.slice(1);
        user_info(username).then(data => {
            profile_page(data)
        });
    }
}});

// for push notification
var intervalId = window.setInterval(function(){
    if(localStorage.getItem("following") != null)
        push_notification();
}, 2000);

export const nav_click = (btn) => {
    const nav = document.querySelector(".nav");
    const home_btn = document.querySelector("#home");
    const create_btn = document.querySelector("#create-btn");
    const dropdown = document.querySelector(".nav-drop");
    const profile = document.querySelector("#profile-btn");
    const log = document.querySelector("#logout-btn");
    let nav_list = [home_btn, create_btn, profile, log];
    for(var item of nav_list) {
        if(item.classList.contains('dropdown-item')) {
            dropdown.classList.remove('noHover');
        }
        if(item.classList.contains("noHover")) {
            item.classList.remove("noHover");
        }
    }
    if(btn.classList.contains('dropdown-item')) {
        dropdown.classList.add('noHover');
    }
    btn.classList.add('noHover');
}