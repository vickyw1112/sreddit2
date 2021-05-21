import { clearPage, createElement } from "./helpers.js";
import API_URL from "./backend_url.js"
import { post } from "./addEventListener.js";

export const post_form = () => {
    const create = document.getElementById("create-btn");
    create.addEventListener("click", () => {
        clearPage("root");
        generate_post_form();
    });
}


export const generate_post_form = (id=-1, isEdit=false) => {
    const root = document.getElementById("root");
    var form_container = createElement("form", "", {id: "post-form-container"});
    root.appendChild(form_container);
    var title = createElement("h3", "Create a post", {id: "new-post-title"});
    form_container.appendChild(title);
    var description = createElement("div", "", {id: "description-wrap", class: "form-group"});
    form_container.appendChild(description);
    var img_wrap = createElement("div", "", {id: "post-img-wrap", class: "form-group"}); 
    form_container.appendChild(img_wrap);
    var btn = createElement("button", "Post", {class: "btn btn-primary", id: "post-btn", type: "button"});
    form_container.appendChild(btn);

    var text = createElement("textarea", "Enter your description here...", 
            {
                id: "des",
                class: "form-control",
                rows: 3
            });
    description.appendChild(text);
    

    var upload = createElement("input", "Upload", {id: "upload-img-btn", class: "btn btn-info", type: "file"});
    upload.accept = "image/*";
    var image = createElement("img", "", {id: "post-form-img"});
    img_wrap.appendChild(upload);
    img_wrap.appendChild(image);
    
    upload.addEventListener('change', (e) => {
        upload_img(e.target);
    })

    btn.addEventListener('click', () => {
        post(id, isEdit);
    });
}

function upload_img(e) {
    var reader = new FileReader();
    reader.onload = function() {
        var img = document.querySelector("#post-form-img");
        img.src = reader.result;
    }
    reader.readAsDataURL(e.files[0]);
}