import {createElement} from "./helpers.js"
import {validate_login, createAccount, go2signup, go2login} from "./addEventListener.js"

export const loginPage = () => {
    const root = document.querySelector("#root");
    const nav = document.querySelector(".nav");
    nav.style.visibility = 'hidden';
    const fdiv = createElement("form", "", {id: "login-form-container"});
    root.appendChild(fdiv);
    const h2 = createElement("h2", "Sign in to Meow", {});
    fdiv.appendChild(h2);

    // user name input 
    let r = createElement("div", "", {class: "row"});
    let form_group = createElement("div", "", {class: "col-md-12 form-group"});
    r.appendChild(form_group);
    const username = createElement("input", "", {type: "text", placeholder: "Username", class: "form-control", name: "uname"})
    form_group.appendChild(username);
    fdiv.appendChild(r);

    // first password input
    r = createElement("div", "", {class: "row"});
    form_group = createElement("div", "", {class: "col-md-12 form-group"});
    r.appendChild(form_group);
    let password = createElement("input", "", {type: "password", placeholder: "Enter your password", class: "form-control", name: "psd1"})
    form_group.appendChild(password);
    fdiv.appendChild(r);

    // second password input
    r = createElement("div", "", {class: "row"});
    form_group = createElement("div", "", {class: "col-md-12 form-group"});
    r.appendChild(form_group);
    password = createElement("input", "", {type: "password", placeholder: "confirm your password", class: "form-control", name: "psd2"})
    form_group.appendChild(password);
    fdiv.appendChild(r);

    // login button
    r = createElement("div", "", {class: "row"});
    form_group = createElement("div", "", {class: "col-md-12"});
    r.appendChild(form_group);
    let btn = createElement("button", "Sign in", {id:"login-btn", type: "button", class: "btn btn-lg btn-block "});
    form_group.appendChild(btn);
    fdiv.appendChild(r);

    // sign up button
    r = createElement("div", "", {class: "row"});
    form_group = createElement("div", "", {class: "col-md-12"});
    r.appendChild(form_group);
    let btn1 = createElement("button", "New to Meow? Create an account", {id:"signup-btn", type: "button", class: "btn btn-lg btn-block "});
    form_group.appendChild(btn1);
    fdiv.appendChild(r);

    validate_login();
    go2signup();
}

// sign up page
export const signupPage = () => {
    const root = document.querySelector("#root");

    const fdiv = createElement("form", "", {id: "signup-form-container"});
    root.appendChild(fdiv);
    const h2 = createElement("h2", "Create your account", {});
    fdiv.appendChild(h2);

    // user name input 
    let r = createElement("div", "", {class: "row"});
    let form_group = createElement("div", "", {class: "col-md-12 form-group"});
    r.appendChild(form_group);
    const username = createElement("input", "", {type: "text", placeholder: "Username", class: "form-control", name: "uname"})
    form_group.appendChild(username);
    fdiv.appendChild(r);

    // first password input
    r = createElement("div", "", {class: "row"});
    form_group = createElement("div", "", {class: "col-md-12 form-group"});
    r.appendChild(form_group);
    let password = createElement("input", "", {type: "password", placeholder: "Enter your password", class: "form-control", name: "psd1"})
    form_group.appendChild(password);
    fdiv.appendChild(r);

    // second password input
    r = createElement("div", "", {class: "row"});
    form_group = createElement("div", "", {class: "col-md-12 form-group"});
    r.appendChild(form_group);
    password = createElement("input", "", {type: "password", placeholder: "confirm your password", class: "form-control", name: "psd2"})
    form_group.appendChild(password);
    fdiv.appendChild(r);

    // email
    r = createElement("div", "", {class: "row"});
    form_group = createElement("div", "", {class: "col-md-12 form-group"});
    r.appendChild(form_group);
    const email = createElement("input", "", {type: "text", placeholder: "Email", class: "form-control", name: "email"})
    form_group.appendChild(email);
    fdiv.appendChild(r);

    // name
    r = createElement("div", "", {class: "row"});
    form_group = createElement("div", "", {class: "col-md-12 form-group"});
    r.appendChild(form_group);
    const name = createElement("input", "", {type: "text", placeholder: "Name", class: "form-control", name: "name"})
    form_group.appendChild(name);
    fdiv.appendChild(r);

    // login button
    r = createElement("div", "", {class: "row"});
    form_group = createElement("div", "", {class: "col-md-12"});
    r.appendChild(form_group);
    let btn = createElement("button", "Create account", {id:"sign-up-btn", type: "button", class: "btn btn-lg btn-block "});
    form_group.appendChild(btn);
    fdiv.appendChild(r);

    // sign up button
    r = createElement("div", "", {class: "row"});
    form_group = createElement("div", "", {class: "col-md-12"});
    r.appendChild(form_group);
    let btn1 = createElement("button", "Already have an account, Sign in", {id:"back2login-btn", type: "button", class: "btn btn-lg btn-block "});
    form_group.appendChild(btn1);
    fdiv.appendChild(r);
    
    createAccount();
    go2login();
    
}