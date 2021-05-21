import { 
        createElement, 
        addClickListener, 
        getNext10Posts, 
        infinite_scroll,
        user_info,
        push_notification,
        clearPage,
        } from "./helpers.js"
import { 
        // home_page,
        go_profile, 
        logout,
        search_user
        } from "./addEventListener.js"
import { post_form } from "./post.js";

export const navbar = () => {
    const nav = document.querySelector(".nav");
    nav.style.visibility = 'visible';
    const home_btn = document.querySelector("#home");
    const create_btn = document.querySelector("#create-btn");
    const dropdown = document.querySelector(".nav-drop");
    const profile = document.querySelector("#profile-btn");
    const log = document.querySelector("#logout-btn");
    let nav_list = [home_btn, create_btn, profile, log];

    for(var item of nav_list){
        addClickListener(item, nav_list, dropdown);
    }
    // home_page();
    go_profile();
    post_form();
    search_user();
    logout();
}

export const feed = () => {
    navbar();
    user_info();
    const body = document.getElementById("root");
    const container = createElement("div", "", {id: "feed-list-container"});
    const notice = createElement("div", "hmm...you don't have any feeds yet", {id: "notice"});
    container.appendChild(notice);
    body.appendChild(container);
    getNext10Posts();
    infinite_scroll();
}