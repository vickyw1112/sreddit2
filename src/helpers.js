import API_URL from "./backend_url.js"
import { check_other_profile, 
    delete_post, 
    edit_post, 
        submitComment, 
        } from "./addEventListener.js"
import { profile_page } from "./profile.js"
/**
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 * 
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
export function fileToDataUrl(file) {
    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);
    // Bad data, let's walk away.
    if (!valid) {
        throw Error('provided file is not a png, jpg or jpeg image.');
    }
    
    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve,reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
}

export const createElement = (tag, data, options = {}) => {
    const e = document.createElement(tag);
    e.textContent = data;

    return Object.entries(options).reduce((element, [key, value]) => {
        element.setAttribute(key, value);
        return element;
    }, e);

}

// alert message
export const alert = (message, color="r") => {
    const root = document.querySelector("#header");
    let acolor;
    switch(color) {
        case "r":
            acolor = "alert-danger";
            break;
        case "b":
            acolor = "alert-primary";
            break;
        case 'g':
            acolor = "alert-success";
            break;
    }

    const alert_wrap = createElement("div", message, {
                       class: `alert ${acolor} po`, 
                       role: "Close", id: "alerts"});
    const icon = createElement("span", "X", {class: "closebtn"});
    alert_wrap.appendChild(icon);
    root.appendChild(alert_wrap);

    icon.addEventListener("click", () => {
        root.removeChild(alert_wrap);
    });
}

// count for infinity scroll
let count = 0;
export const clearPage = (id) => {
    if(id == "alerts") {
        let header = document.querySelector("#header");
        while(header.lastChild) {
            if(header.lastElementChild.classList.contains('nav')) {
                break;
            }
            header.lastChild.remove();
        }
        return;
    }

    if(id == "root") {
        count = 0;
    }
    const root = document.querySelector(`#${id}`);
    while(root.firstChild) {
        root.firstChild.remove();
    }
}
// helper function for navbar
export const addClickListener = (btn, nav_list, dropdown) => {
    btn.addEventListener("click", () =>{
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
    });
}

// each time add 10 posts
export const getNext10Posts = () => {
    const list = document.getElementById("#feed-list-container");
    fetch(`${API_URL}/user/feed?` + new URLSearchParams({
        p: count,
    }), {
        method: "GET", headers:{
            Authorization: `Token ${localStorage.getItem('token')}`
        }    
    })
    .then(res => {
        switch (res.status) {
            case 200:
                return res.json();
            case 403:
                alert("Invalid Auth Token");
                throw new Error('403: bad token');
        }
    })
    .then(data => {
        const container = document.getElementById("feed-list-container");
        if(!data.posts.length) {
            return;
        } 
        else {
            Object.keys(data.posts).map(key => {
                generateFeeds(data.posts[key]);
            });
            if(document.getElementById("notice") != null) {
                document.getElementById("notice").remove();
            }
        }
    });
    count += 10
}

export const generateFeeds = (post) => {
    const container = document.getElementById("feed-list-container");
    let feed = createElement("div", "", {id: post.id, class: "feed-container"});
    container.appendChild(feed);
    let feed_body = createElement("div", "", {class: "panel-body"})
    feed.appendChild(feed_body);
    let img_wrap = createElement("div", "", {class: "image-wrapper"})
    feed_body.appendChild(img_wrap);
    let a = createElement("a", "", {class: "image-wrapper"});
    img_wrap.appendChild(a);
    let img = createElement("img", "", {"src": `data:image/png;base64,${post.src}`, 
                                        alt: "photo of feed", class: "img-fluid"});
    a.appendChild(img);

    let top = createElement("div", "", {class: "top-wrap"});
    let author = createElement("span", `${post.meta.author}`, {class: "author"});
    top.appendChild(author);
    var date = new Date(post.meta.published * 1000).toLocaleDateString("en-US");
    let time = createElement("span", ` | Post on ${date} | `, {class: "post-time"});
    top.appendChild(time);
    let numC = createElement("span", `${post.comments.length} comments`, {class: "num-comments"});
    top.appendChild(numC);


    let middle = createElement("div", post.meta.description_text, {class: "feed-text"});
    feed_body.appendChild(middle);

    let like_wrap = createElement("span", "", {
                class: "post-like text-muted", 
                });
    feed_body.appendChild(like_wrap);
    feed_body.appendChild(top);

    let heart = createElement("i", "", {class: "fa fa-heart heart", 
                "data-toggle": "tooltip", 
                "data-placement": "top",
                title: "I like this post!"});
    like_wrap.appendChild(heart);

    if(post.meta.likes.includes(parseInt(localStorage.getItem("uid")))) {
        localStorage.setItem(`liked${post.id}`, post.meta.likes.length);
        heart.classList.add("liked");
    }
    let heartC = createElement("span", post.meta.likes.length, {
                class: "heart-count",
                "data-toggle": "tooltip", 
                "data-placement": "top",
                title: "Who liked this post?"});
    like_wrap.appendChild(heartC);

    if(post.meta.author == localStorage.getItem("username")){
        const edit_post_btn = createElement("button", "Edit Post", {class: "btn btn-primary edit-post-btn"});
        feed_body.appendChild(edit_post_btn);

        const delete_post_btn = createElement("button", "Delete Post", {class: "btn btn-danger delete-post-btn"});
        feed_body.appendChild(delete_post_btn);

        delete_post_btn.addEventListener('click', (e) => {
            delete_post(e);
        });
        edit_post_btn.addEventListener('click', (e) => {
            edit_post(e, post);
        });
 
    }

    // eventlistener for img
    img_wrap.addEventListener('click', (e) => {
        check_feed_detail(e, post);
    });
    // eventlistener for like post
    heart.addEventListener('click', function(e){
        like_unlike_post(e, post, heartC);
    }, false);
    //=========================================
    // eventlistener for check comments
    numC.addEventListener('click', function(e){
        check_feed_detail(e, post);
    });

    // eventlistener for check who liked this post
    heartC.addEventListener('click', function(e){
        check_who_liked(e, post);
    });

    //eventlistener for username
    author.addEventListener('click', function(e){
        check_other_profile(post.meta.author);
    });
}

function info_edit() {
    const form = document.getElementById("info-form");
    var payload = {};
    if (form.email.value != "") {
        payload.email = form.email.value
    }
    if (form.name.value != "") {
        payload.name = form.name.value
    }
    if (form.psd.value != "") {
        payload.password = form.psd.value
    }

    if(form.email.value == "" && form.name.value == "" && form.psd.value == "") {
        alert("Please provide at least one field");
        return;
    }
    fetch(API_URL + "/user/", {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        if (res.status == 400) {
            throw new Error('400: Malformed Request');
        }
        else if (res.status == 403) {
            throw new Error("403: Invalid Token");
        }
        document.body.removeChild(document.body.lastElementChild);
        clearPage("root");
        user_info().then(data => {
            profile_page(data)
        });
    })

}

export const edit_form = () => {
    const div = createElement("div", "", {class: "modal"});
    document.body.appendChild(div);
    const modal_content = createElement("div", "", {class: "modal-content"})
    div.appendChild(modal_content);
    const ul = createElement("ul", "", {id: "like-people"});
    const icon = createElement("span", "X", {class: "closebtn"});
    ul.appendChild(icon);
    modal_content.appendChild(ul);

    // close modal
    icon.addEventListener('click', () => {
        document.body.removeChild(document.body.lastChild);
    })

    let form = createElement("form", "", {id: "info-form"});
    modal_content.appendChild(form);
    // name
    var card_body = createElement("div", "", {class: "form-group row profile-info-row"});
    form.appendChild(card_body);
    var label = createElement("label", "Name", {for: "name", class: "col-sm-3 col-form-label"});
    card_body.appendChild(label);
    var name_wrap = createElement("div", "", {class: "col-sm-8"});
    card_body.appendChild(name_wrap);
    var name = createElement("input", "", {"class": "form-control text-secondary", 
            id:"name", name: "name"});
    name_wrap.appendChild(name);
    form.appendChild(document.createElement("hr"));

    // email
    card_body = createElement("div", "", {class: "form-group row profile-info-row"});
    form.appendChild(card_body);
    var label = createElement("label", "Email", {for: "email", class: "col-sm-3 col-form-label"});
    card_body.appendChild(label);
    var email_wrap = createElement("div", "", {class: "col-sm-8"});
    card_body.appendChild(email_wrap);
    var email = createElement("input", "", {"class": "form-control text-secondary", 
            id:"email", name: "email"});
    email_wrap.appendChild(email);
    form.appendChild(document.createElement("hr"));

    // password
    card_body = createElement("div", "", {class: "form-group row profile-info-row"});
    form.appendChild(card_body);
    var label = createElement("label", "Password", {for: "psd", class: "col-sm-3 col-form-label"});
    card_body.appendChild(label);
    var psd_wrap = createElement("div", "", {class: "col-sm-8"});
    card_body.appendChild(psd_wrap);
    var psd = createElement("input", "", {"class": "form-control text-secondary", 
            id:"psd", name: "psd"});
    psd_wrap.appendChild(psd);
    form.appendChild(document.createElement("hr"));

    const submit = createElement("button", "submit", {type: "button", class: "btn btn-danger info-btn"});
    form.appendChild(submit);

    submit.addEventListener('click', info_edit);
}

export const check_following = (lists) => {
    var urls = [];
    lists.forEach(id => {
        var url = API_URL + '/user/?id=' + id;
        urls.push(url);
    });

    const div = createElement("div", "", {class: "modal"});
    document.body.appendChild(div);
    const modal_content = createElement("div", "", {class: "modal-content"})
    div.appendChild(modal_content);
    const ul = createElement("ul", "", {id: "like-people"});
    const icon = createElement("span", "X", {class: "closebtn"});
    ul.appendChild(icon);
    modal_content.appendChild(ul);

    // close modal
    icon.addEventListener('click', () => {
        document.body.removeChild(document.body.lastChild);
    })

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
    .then(data => {
        for(var user of data) {
            const li = createElement("li", "", {class: "ppl-list"});
            let user_pic = createElement("img", "", {
                        class: "d-flex mr-3 rounded-circle comment-user-pic", 
                        src: "img/rick.png", alt: "user's photo"}); 
            li.appendChild(user_pic);
            let span = createElement("span", `${user.username}`, {class: "people-name"});
            span.addEventListener('click', (e) => {
                check_other_profile(e.target.textContent);
            })
            li.appendChild(span)
            ul.appendChild((li));
        }
    })
    .catch(e => console.log("Error: "+ e));
}

function check_who_liked(e, post) {
    var urls = [];
    post.meta.likes.forEach(id => {
        var url = API_URL + '/user/?id=' + id;
        urls.push(url);
    });
    // create a modal window 
    const div = createElement("div", "", {class: "modal"});
    document.body.appendChild(div);
    const modal_content = createElement("div", "", {class: "modal-content"})
    div.appendChild(modal_content);
    const ul = createElement("ul", "", {id: "like-people"});
    const icon = createElement("span", "X", {class: "closebtn"});
    ul.appendChild(icon);
    modal_content.appendChild(ul);

    // close modal
    icon.addEventListener('click', () => {
        document.body.removeChild(document.body.lastChild);
    })

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
    .then(data => {
        for(var user of data) {
            console.log(user.username)
            const li = createElement("li", "", {class: "ppl-list"});
            let user_pic = createElement("img", "", {
                        class: "d-flex mr-3 rounded-circle comment-user-pic", 
                        src: "img/rick.png", alt: "user's photo"}); 
            li.appendChild(user_pic);
            let span = createElement("span", `${user.username}`, {class: "people-name"});
            li.appendChild(span)
            ul.appendChild((li));

            span.addEventListener('click', () => {
                check_other_profile(user.username);
            });
        }
    })
    .catch(e => console.log("Error: "+ e));

}

export const like_unlike_post = (e, post, heart_count) => {
    const feed = document.getElementById(post.id);

    // for unlike api
    if(localStorage.getItem(`liked${post.id}`)) {
        var url = API_URL + '/post/unlike/?id=' + post.id; 
        fetch(url, {
            method: "PUT",
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            switch(res.status){
                case 200:
                    heart_count.textContent = parseInt(heart_count.textContent) - 1;
                    localStorage.removeItem(`liked${post.id}`)
                    e.target.classList.remove("liked");
                    return;
                case 400:
                    throw new Error('400: Malformed Resuest');
                case 403:
                    throw new Error('403: Invalid Token');
                case 404:
                    throw new Error("404: Post Not Found");
            }

        })
        .catch(e => console.log("Error: " + e));
        return;
    }

    // for like and unlike api (live update)
    var url = API_URL + '/post/like/?id=' + post.id; 
    fetch(url, {
        method: "PUT",
        headers: {
            Authorization: `Token ${localStorage.getItem('token')}`
        }
    })
    .then(res => {
        switch(res.status){
            case 200:
                var liked = parseInt(heart_count.textContent) + 1;
                localStorage.setItem(`liked${post.id}`, liked);
                e.target.classList.add("liked");
                heart_count.textContent = liked;
                return res.json();
            case 400:
                throw new Error('400: Malformed Resuest');
            case 403:
                throw new Error('403: Invalid Token');
            case 404:
                throw new Error("404: Post Not Found");
        }

    })
    .catch(e => console.log("Error: " + e));
}

function checkforNewFeed() {
    var lastDiv = document.querySelector("#feed-list-container > div:last-child");
    if(lastDiv == null) {
        return;
    }
    var lastDivOffset = lastDiv.offsetTop + lastDiv.clientHeight;
    var pageOffset = window.pageYOffset + window.innerHeight;

    if(pageOffset > lastDivOffset - 20) {
        getNext10Posts();
    }
}
export const infinite_scroll = () => {
    document.addEventListener("scroll", () => {
        if(document.querySelector("#root").lastElementChild == null) {
            return;
        }
        if(document.querySelector("#root").lastElementChild.id == "feed-list-container") {
            checkforNewFeed()

        }
    });

}

export const user_info = (id=-1) => {
    var url = `${API_URL}/user/`;
    if(id != -1) {
        url = API_URL + '/user/?username=' + id;
    }
    
    return fetch(url, {
        method: "GET", headers:{
            Authorization: `Token ${localStorage.getItem('token')}`
        }    
    })
    .then(res => {
        switch (res.status) {
            case 200:
                return res.json();
            case 403:
                alert("Invalid Auth Token");
                throw new Error('403: bad token');
            case 404:
                alert("User not found");
                throw new Error('404: user not found');
        }
    })
    .then(data => {
        if(id == -1) {
            localStorage.setItem("uid", data.id);
            localStorage.setItem("username", data.username);
            localStorage.setItem("following", JSON.stringify(data.following));

        }
        return data;
    });

}

// feed detail page
function check_feed_detail(e, post) {
    clearPage("root");
    const root = document.getElementById("root");
    const container = createElement("div", "", {id: "feed-page-container"});
    root.appendChild(container);

    let feed_body = createElement("div", "", {id: "panel-body"})
    container.appendChild(feed_body);
    let img_wrap = createElement("div", "", {class: "feed-image-wrapper"})
    feed_body.appendChild(img_wrap);
    let a = createElement("a", "", {class: "feed-image-wrapper"});
    img_wrap.appendChild(a);
    let img = createElement("img", "", {src : `data:image/png;base64,${post.src}`,
                                        alt: "photo of feed", class: "img-fluid"});
    a.appendChild(img);

    // wrap for author, date and comments
    let top = createElement("div", "", {class: "top-wrap"});
    let author = createElement("span", `${post.meta.author}`, {class: "author"});
    top.appendChild(author);
    var date = new Date(post.meta.published * 1000).toLocaleDateString("en-US");
    let time = createElement("span", ` | Post on ${date} | `, {class: "post-time"});
    top.appendChild(time);
    let numC = createElement("span", `${post.comments.length} comments`, {class: "feed-num-comments"});
    top.appendChild(numC);

    let middle = createElement("p", post.meta.description_text,
            {class: "feed-text"});
    feed_body.appendChild(middle);

    let like_wrap = createElement("span", "", {
                class: "post-like text-muted", 
                });
    feed_body.appendChild(like_wrap);
    feed_body.appendChild(top);

    let heart = createElement("i", "", {class: "fa fa-heart heart", 
                "data-toggle": "tooltip", 
                "data-placement": "top",
                title: "I like this post!"});
    like_wrap.appendChild(heart);

    if(post.meta.likes.includes(parseInt(localStorage.getItem("uid")))) {
        localStorage.setItem(`liked${post.id}`, post.meta.likes.length);
        heart.classList.add("liked");
    }

    let heartC = createElement("span", post.meta.likes.length, {
                class: "heart-count",
                "data-toggle": "tooltip", 
                "data-placement": "top",
                title: "Who liked this post?"});
    like_wrap.appendChild(heartC);
    // eventlistener for like post
    heart.addEventListener('click', function(e){
        like_unlike_post(e, post, heartC);
    }, false);

    // eventlistener for check who liked this post
    heartC.addEventListener('click', function(e){
        check_who_liked(e, post);
    });
    //=========================================

    // for leave comment layout
    let comment_container = createElement("div", "", {class: "card my-4", id: "leave-comment-wrap"});
    container.appendChild(comment_container);
    let h5 = createElement("h5", "Leave a Comment", {class: "card-header"});
    comment_container.appendChild(h5);
    let div = createElement("div", "", {class: "card-body"});
    comment_container.appendChild(div);
    let form = createElement("form", "", {});
    div.appendChild(form);
    let com_wrap = createElement("div", "", {class: "form-group", id:"comment-form"});
    form.appendChild(com_wrap);
    let comments = createElement("textarea", "", {class: "form-control", id: "comment", row: 3});
    com_wrap.appendChild(comments);
    let submit_com = createElement("button", "submit", {id: "comment-submit", class: "btn btn-primary", type: "button"});
    form.appendChild(submit_com);

    // comment
    for (var c of post.comments) {
        let single_comment_con = createElement("div", "", {class: "media mb-4 comments-wrap"});
        container.appendChild(single_comment_con);
        let user_pic = createElement("img", "", {
                    class: "d-flex mr-3 rounded-circle comment-user-pic", 
                    src: "img/rick.png", alt: "user's photo"}); 
        single_comment_con.appendChild(user_pic);
        let acctual_com_wrap = createElement("div", "", {class: "media-body"});
        single_comment_con.appendChild(acctual_com_wrap);
        h5 = createElement("h5", c.author, {class: "com-user"});
        acctual_com_wrap.appendChild(h5);
        let posted_comment = createElement("p", c.comment, {});
        acctual_com_wrap.appendChild(posted_comment);

        // add eventlistener for username
        h5.addEventListener("click", function(e){
            check_other_profile(c.author);
        });
    }

    // add eventlistener for submit comment
    submitComment(post);

    // add eventlistener for username
    author.addEventListener("click", function(e){
        check_other_profile(post.meta.author);
    });
}

export const push_notification = () => {
    const following = JSON.parse(localStorage.getItem("following"));
    var urls = [];
    following.forEach(id => {
        var url = API_URL + '/user/?id=' + id;
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
                    throw new Error("404: User not found");
            }
        })
        .catch(e => {
            return e;
        })
    ))
    .then(data => {
        var f = {};
        for(var user of data) {
            var post_id = user.posts.slice(-1)[0];
            if(post_id == undefined) {
                continue;
            }

            f[user.id] = post_id;
            if(localStorage.getItem("f2f")) {
                var lf = JSON.parse(localStorage.getItem("f2f"));
                if(post_id > lf[user.id.toString()]) {
                    alert(`${user.username} has new post!`, "b");
                }

            }
        }
        localStorage.setItem('f2f', JSON.stringify(f));
    })
    .catch(e => console.log("Error: "+ e));
}