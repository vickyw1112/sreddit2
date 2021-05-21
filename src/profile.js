import { follow_unfollow } from "./addEventListener.js";
import { createElement,
        check_following,
        generateFeeds ,
        edit_form } from "./helpers.js";
import API_URL from "./backend_url.js"
import {nav_click} from "./main.js"
export const profile_page = (data) => {
    // const link = document.getElementById("profile-btn");
    // nav_click(link);
    const root = document.getElementById('root');
    const container  = createElement('div', "", {id: "profile-container"});
    root.appendChild(container);
    const profile_top = createElement("div", "", {id: "profile-top"});
    container.appendChild(profile_top);
    const profile_bottom = createElement("div", "", {id: "profile-bottom"});
    container.appendChild(profile_bottom);

    var card = createElement("div", "", {class: "card profile-top-left"});
    profile_top.appendChild(card);
    var card_body = createElement("div", "", {class: "card-body d-flex flex-column align-items-center text-center"});
    card.appendChild(card_body);
    var img = createElement("img", "", {src: "img/rick.png", class:"rounded-circle", width: "150"});
    card_body.appendChild(img);
    var text_wrap = createElement("div", "", {class: "mt-3"});
    card_body.appendChild(text_wrap);
    var name = createElement("h4", data.username, {});
    text_wrap.appendChild(name);
    var email = createElement("p", data.email, {class: "text-muted mb1"});
    text_wrap.appendChild(email);
    var followed_wrap = createElement("p", "", {class: "text-secondary mb-1", id: "followed-wrap"});
    text_wrap.appendChild(followed_wrap);
    var folled_title = createElement("span", "Followed: ", {});
    followed_wrap.appendChild(folled_title);
    var followed = createElement("span", `${data.followed_num}`, {id: "profile-followed"});
    followed_wrap.appendChild(followed);
    var following = createElement("p", `Following: ${data.following.length}`, {class: "text-secondary mb-1", id: "profile-following"});
    text_wrap.appendChild(following);
    if(data.id != localStorage.getItem("uid")) {
        var follow = createElement("button", "Follow", 
                {
                    class: "btn", 
                    id: "profile-fbtn"
                });
        if (localStorage.getItem("following").includes(data.id)) {
            follow.classList.add("unfollow-btn");
            follow.textContent = "Unfollow";
        } else {
            follow.classList.add("follow-btn");
            follow.textContent = "Follow";

        }
        text_wrap.appendChild(follow);
        follow.addEventListener('click', (e) => {
            follow_unfollow(e, data.id, data.username);
        });

    }
        following.addEventListener("click", () => {
            check_following(data.following);
    });


    // username
    card = createElement("div", "", {class: "card profile-top-right"});
    profile_top.appendChild(card);
    let form = createElement("form", "", {id: "profile-form"});
    card.appendChild(form);
    card_body = createElement("div", "", {class: "form-group row profile-info-row"});
    form.appendChild(card_body);
    var label = createElement("label", "Username", {for: "username", class: "col-sm-3 col-form-label"});
    card_body.appendChild(label);
    var uname_wrap = createElement("div", "", {class: "col-sm-8"});
    card_body.appendChild(uname_wrap);
    var uname = createElement("input", "", {"class": "form-control-plaintext text-secondary", 
            id: "username", value: data.username});
    uname.readOnly = true;
    uname_wrap.appendChild(uname);
    form.appendChild(document.createElement("hr"));

    // name
    card_body = createElement("div", "", {class: "form-group row profile-info-row"});
    form.appendChild(card_body);
    var label = createElement("label", "Name", {for: "name", class: "col-sm-3 col-form-label"});
    card_body.appendChild(label);
    var name_wrap = createElement("div", "", {class: "col-sm-8"});
    card_body.appendChild(name_wrap);
    var name = createElement("input", "", {"class": "form-control-plaintext text-secondary", 
            id: "name", value: data.name});
    name.readOnly = true;
    name_wrap.appendChild(name);
    form.appendChild(document.createElement("hr"));
   

    // email
    card_body = createElement("div", "", {class: "form-group row profile-info-row"});
    form.appendChild(card_body);
    var label = createElement("label", "Email", {for: "email", class: "col-sm-3 col-form-label"});
    card_body.appendChild(label);
    var email_wrap = createElement("div", "", {class: "col-sm-9"});
    card_body.appendChild(email_wrap);
    var email = createElement("input", "", {"class": "form-control-plaintext text-secondary", 
            id: "email", value: data.email});
    email.readOnly = true;
    email_wrap.appendChild(email);
    form.appendChild(document.createElement("hr"));
    card_body = createElement("div", "", {class: "form-group row profile-info-row"});
    form.appendChild(card_body);


    if(data.id == localStorage.getItem("uid")){
        // password
        var label = createElement("label", "Password", {for: "psd", class: "col-sm-3 col-form-label"});
        card_body.appendChild(label);
        var psd_wrap = createElement("div", "", {class: "col-sm-8"});
        card_body.appendChild(psd_wrap);
        var psd = createElement("input", "", {"class": "form-control-plaintext text-secondary", 
                id: "psd", value: ""});
        psd.disabled = true;
        psd_wrap.appendChild(psd);
        form.appendChild(document.createElement("hr"));
        const edit = createElement("button", "Edit", {class: "btn btn-primary edit-btn", type: "button"});
        
        edit.addEventListener('click', () => {
        edit_form();
        })
        form.appendChild(edit);
    }

    // generate posts
    if(data.posts.length == 0) {
        return;
    }
    const feed_container = createElement("div", "", {id: "feed-list-container"});
    profile_bottom.appendChild(feed_container);
    var urls = [];
    data.posts.forEach(id => {
        var url = API_URL + '/post/?id=' + id;
        urls.push(url);
    });
    Promise.all(urls.map(url =>
        fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            switch(res.status) {
                case 200:
                    return res.json();
                case 400:
                    throw new Error("400: Malformed Request");
                case 403:
                    throw new Error("403: Invalid token");
                case 404:
                    throw new Error("404: Page not found");
            }
        })
        .catch(e => {
            return e;
        })
    ))
    .then(d => {
        for(var p of d) {
            generateFeeds(p);
        }
    })
    .catch(e => console.log("Error: "+ e));

}