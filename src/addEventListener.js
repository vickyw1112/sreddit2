import API_URL from "./backend_url.js"
import API from './api.js'
import {createElement, 
        alert, 
        clearPage,
        user_info,
        } from "./helpers.js"
import {signupPage, loginPage} from "./init.js"
import { feed } from "./feeds.js"
import { profile_page } from "./profile.js"
import { generate_post_form } from './post.js'

const api = new API(API_URL);

// login validation
export const validate_login = () => {
    const login_btn = document.querySelector("#login-btn");

    login_btn.addEventListener("click", () => {
        const form = document.querySelector("#login-form-container");
        const uname = form.uname.value;
        const psd1 = form.psd1.value;
        const psd2 = form.psd2.value;

        var payload = {
            username: uname,
            password: psd1
        };

        fetch(API_URL + '/auth/login', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        }) 
        .then(res =>{
            if (psd1 !== psd2) {
                alert("password1 and password2 are different!");
                return;
            }
            if(res.status == 400) {
                alert("Missing Username/Password");
                throw new Error('400');
            } else if(res.status == 403) {
                alert("Invalid Username/Password");
                throw new Error("403");
            }
            return res.json();
        })
        .then(data =>{
            // redirect to feed page
            localStorage.setItem('isLogin', 'true');
            localStorage.setItem('token', data.token);
            clearPage('alerts');
            clearPage("root");
            feed();
        })
        .catch(e => console.error("Error:", e));
    });
}

// go to signup page
export const go2signup = () => {
    const signup = document.querySelector("#signup-btn");
    signup.addEventListener('click', () => {
        clearPage('alerts');
        clearPage("root");
        signupPage();
    });
}

// back to login page
export const go2login = () => {
    const login = document.querySelector("#back2login-btn");
    login.addEventListener('click', () => {
        clearPage('alerts');
        clearPage("root");
        loginPage();
    });
}

// validate signup page
export const createAccount = () => {
    const create = document.querySelector("#sign-up-btn");
    create.addEventListener('click', () => {
        const form = document.querySelector("#signup-form-container");
        const uname = form.uname.value;
        const psd1 = form.psd1.value;
        const psd2 = form.psd2.value;
        const email = form.email.value;
        const name = form.name.value;

        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        var payload = {
            username: uname,
            password: psd1,
            email: email,
            name: name,
        };

        fetch(API_URL + '/auth/signup', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (psd1 !== psd2) {
                alert("password1 and password2 are different!");
                return;
            }
            if(!re.test(email)) {
                alert("Invalid email address!");
                return;
            }
            console.log(res);
            if(res.status == 400) {
                alert("Malformed Request");
                throw new Error('400');
            } else if(res.status == 409) {
                alert("Username Taken");
                throw new Error("409");
            }
            return res.json();
        })
        .then(data => {
            localStorage.setItem('isLogin', "true");
            localStorage.setItem('token', data.token);
            clearPage('alerts');
            clearPage("root");
            feed();
        })
        .catch(e => console.error('Error:', e));
    });
}

export const go_profile = () => {
    const profile = document.getElementById("profile-btn");
    profile.addEventListener('click', (e) => {
        clearPage("root");
        const modal = document.getElementsByClassName("modal")[0]
        if (modal != undefined) {
            document.body.removeChild(modal);
        }
        user_info().then(data => {
            const link = document.getElementById("profile-btn");
            link.setAttribute("href", "#profile=me");
        });
    })
}

export const check_other_profile = (id) => {
        clearPage("root");
        const modal = document.getElementsByClassName("modal")[0]
        if (modal != undefined) {
            document.body.removeChild(modal);
        }
        user_info(id).then(data => {
            const link = document.getElementById("profile-btn");
            link.setAttribute("href", `#profile=${data.username}`);
            link.click()
        });
}

// submit comment
export const submitComment = (post) => {
    const submit = document.getElementById("comment-submit");
    submit.addEventListener('click', () => {
        const content = document.getElementById("comment").value;
        if(content == ""){
            return;
        }
        var payload = {
            comment: content
        };
        fetch(API_URL + '/post/comment?id=' + post.id, {
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
            else if (res.status == 404) {
                throw new Error ('404: Page not found');
            }
            return res.json();
        })
        .then(data => {
            document.getElementById("comment").value = "";
            const container = document.getElementById("feed-page-container")
            let single_comment_con = createElement("div", "", {class: "media mb-4 comments-wrap"});
            container.appendChild(single_comment_con);
            let user_pic = createElement("img", "", {
                        class: "d-flex mr-3 rounded-circle comment-user-pic", 
                        src: "img/rick.png", alt: "user's photo"}); 
            single_comment_con.appendChild(user_pic);
            let acctual_com_wrap = createElement("div", "", {class: "media-body"});
            single_comment_con.appendChild(acctual_com_wrap);
            let h5 = createElement("h5", localStorage.getItem('username'), {});
            acctual_com_wrap.appendChild(h5);
            let posted_comment = createElement("p", content, {});
            acctual_com_wrap.appendChild(posted_comment);
            window.scrollTo(0,document.body.scrollHeight);

        })
        .catch(e => console.error("Error: " + e));
    });
}

export const follow_unfollow = (e, id, username) => {
    const btn = document.getElementById("profile-fbtn");
    const followed = document.getElementById("profile-followed");

    if (JSON.parse(localStorage.getItem("following")).includes(id)) {
        var url = API_URL + '/user/unfollow/?username=' + username; 
        fetch(url, {
            method: "PUT",
            headers: {
                Authorization: `Token ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            switch(res.status){
                case 200:
                    btn.classList.remove("unfollow-btn");
                    btn.classList.add("follow-btn");
                    btn.textContent = "Follow";
                    followed.textContent = parseInt(followed.textContent) - 1;
                    var s = JSON.parse(localStorage.getItem("following"));
                    var index = s.indexOf(id);
                    s.splice(index, 1);
                    localStorage.setItem("following", JSON.stringify(s));
                    return;
                case 400:
                    throw new Error('400: Malformed Resuest');
                case 403:
                    throw new Error('403: Invalid Token');
            }

        })
        .catch(e => console.log("Error: " + e));
        return;
    }
    // for like and unlike api (live update)
    var url = API_URL + '/user/follow/?username=' + username; 
    fetch(url, {
        method: "PUT",
        headers: {
            Authorization: `Token ${localStorage.getItem('token')}`
        }
    })
    .then(res => {
        switch(res.status){
            case 200:
                btn.classList.remove("follow-btn");
                btn.classList.add("unfollow-btn");
                btn.textContent = "Unfollow";
                followed.textContent = parseInt(followed.textContent) + 1;
                var array = JSON.parse(localStorage.getItem("following"));
                array.push(id);
                localStorage.setItem("following", JSON.stringify(array));
                return res.json();
            case 400:
                throw new Error('400: Malformed Resuest');
            case 403:
                throw new Error('403: Invalid Token');
        }

    })
    .catch(e => console.log("Error: " + e));
}

export const post = (id=-1, isEdit=false) => {
    const des = document.getElementById("des").value;
    var payload = {
        "description_text": des,
    }
    if(des == "") {
        alert("Description can not be empty");
        return;
    }
    if(document.querySelector("#post-form-img").src == "") {
        alert("Image can not be empty");
        return;
    }
    else {
        const img = document.querySelector("#post-form-img");
        payload.src = img.src.split(",")[1];
        if(id == -1){
            fetch(API_URL + "/post/", {
                method: 'POST',
                body: JSON.stringify(payload),
                headers:{
                    Authorization: `Token ${localStorage.getItem('token')}`,
                    'Content-Type': "application/json"
                }
            })
            .then(res => {
                switch(res.status){
                    case 200:
                        alert("Post Success", "b");
                        clearPage("root");
                        generate_post_form();
                    return;
                    case 400:
                        alert("Malformed Requst / Image could not be processed");
                        return;
                    case 403:
                        throw new Error("403: InvalidToken");
                }
            })
            .catch(e => console.log("Error" + e));
        }
        else {
            fetch(API_URL + "/post/?id=" + id, {
                method: 'PUT',
                body: JSON.stringify(payload),
                headers:{
                    Authorization: `Token ${localStorage.getItem('token')}`,
                    'Content-Type': "application/json"
                }
            })
            .then(res => {
                switch(res.status){
                    case 200:
                        clearPage("root");
                        user_info().then(data => {
                            profile_page(data)
                        });
                    return;
                    case 400:
                        alert("Malformed Requst / Image could not be processed");
                        return;
                    case 403:
                        throw new Error("403: InvalidToken");
                }
            })
            .catch(e => console.log("Error" + e));

        }
    }
}


export const delete_post = (e) => {
    const del = e.target;
    const post_id = del.parentElement.parentElement.id;
    fetch(API_URL + '/post/?id=' + post_id, {
        method: 'DELETE',
        headers:{
            Authorization: `Token ${localStorage.getItem('token')}`,
        }
    })
    .then(res => {
        switch(res.status) {
            case 200:
                const bottom = document.querySelector("#feed-list-container");
                const n = document.getElementById(post_id);
                bottom.removeChild(n);
                window.scrollTo(0, 0);
                alert("Delete success", "b");
            break;
            case 400:
                alert("Malformed Requst");
                throw new Error("400: Malformed Requst");
            case 403:
                throw new Error("403: InvalidToken");
            case 404:
                alert("Post Not Found");
                throw new Error("404: Post Not found");
        }
    })
    .catch(e => console.log("error" + e));
}

export const edit_post = (e, post) => {
    const post_id = post.id;
    clearPage("root");
    generate_post_form(post_id, true);
    const title = document.getElementById("new-post-title");
    title.textContent = "Edit a post";        
    const des = document.getElementById("des");
    des.textContent = post.meta.description_text;
    const img = document.getElementById("post-form-img");
    img.src = `data:image/png;base64,${post.src}`;
}

export const logout = () => {
    const out = document.getElementById("logout-btn");
    out.addEventListener('click', (e) => {
        clearPage("root");
        document.getElementById("logout-btn").click();
        localStorage.clear();
        location.reload();
        // loginPage();

    })
}

export const search_user = () => {
    const btn = document.getElementById("search-btn");
    btn.addEventListener("click", () => {
        var input = document.getElementById("search-bar").value;
        if(input !== "") {
            clearPage("root");
            if(input !== localStorage.getItem("username")) {
                input = input.charAt(0).toUpperCase() + input.slice(1);
            }
            check_other_profile(input);
            document.getElementById("search-bar").value = ""; 
        }
    });
}