/*
=============================================================
PROJECT   : Notes Center - Interactive Personal Blog Platform
Module 5  : The Document Object Model 
SBA       : Dynamic and interactive web application
DATE: September 27, 2026

OBJECTIVES:

Your Interactive Personal Blog Platform must include the following features:

    1. Create New Posts:
        A form with fields for a post title and post content (e.g., using <input type="text"> for title and <textarea> for content).
        Upon submission, the new post should be added to a list of posts displayed on the page.
        The form should be validated: both title and content are required.
        Display custom, user-friendly error messages if validation fails.
    2. Display Posts:
        All created posts should be displayed on the page. Each displayed post should clearly show its title and content.
        Posts should be rendered dynamically using JavaScript.
    3. Edit Posts:
        Each displayed post should have an “Edit” button.
        Clicking “Edit” should allow the user to modify the title and content of that specific post. This might involve populating the main form (or a modal form) with the existing post data.
        After editing, the updated post should be reflected in the display.
        Form validation should also apply during editing.
    4. Delete Posts:
        Each displayed post should have a “Delete” button.
        Clicking “Delete” should remove the post from the display and from localStorage.
    5. Data Persistence with localStorage:
        All blog posts (title, content, and perhaps a unique ID and timestamp you generate) must be saved in localStorage.
        When the page is loaded or refreshed, any posts previously saved in localStorage should be retrieved and displayed.
        Updates (from edits) and deletions must also be reflected in localStorage.


============================================================= */


const postForm = document.getElementById("post-form");
const titleInput = document.getElementById("post-title");
const dateInput = document.getElementById("post-date");
const categoryInput = document.getElementById("post-category");
const contentInput = document.getElementById("post-content");
const postsContainer = document.getElementById("posts-container")


const titleInputError = document.getElementById("title-error");
const dateInputError = document.getElementById("date-error");
const categoryInputError = document.getElementById("category-error");
const contentInputError = document.getElementById("content-error");
const ContainerInputError = document.getElementById("container-error");


let posts = [];

let editingPostId = null;

const localPosts = "notesCenterPosts";


function validateForm() {

    let isValid = true;


    titleInputError.textContent = "";
    dateInputError.textContent = "";
    categoryInputError.textContent = "";
    contentInputError.textContent = "";


    if (titleInput.value.trim() === "")
    {
        titleInputError.textContent = "Please enter a title.";
        isValid = false;
    }

    if (dateInput.value === "")
    {
        dateInputError.textContent = "Please select a date.";
        isValid = false;
    }

    if (categoryInput.value === "")
    {
        categoryInputError.textContent = "Please select a category.";
        isValid = false;
    }

    if (contentInput.value.trim() === "")
    {
        contentInputError.textContent = "Please enter some content.";
        isValid = false;
    }

    return isValid;
}


function savePosts() {
    localStorage.setItem(localPosts, JSON.stringify(posts));
}

function renderPosts() {
    postsContainer.innerHTML = "";
    posts.forEach(function (post) {
        displayPost(post);
    });
}

function loadPosts() {
    const storedPosts = localStorage.getItem(localPosts);

    if (storedPosts) {

        posts = JSON.parse(storedPosts);

        posts.forEach(function (post) {
            if (!post.id) {
                post.id = Date.now() + Math.random();
            }
            // displayPost(post);
        });

        savePosts();
        renderPosts();
    }
}



console.log(JSON.parse(localStorage.getItem(localPosts)));

postForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if(!validateForm())
    {
        return;
    }

    const title = titleInput.value;
    const date = dateInput.value;
    const category = categoryInput.value;
    const content = contentInput.value;

    // Checking the initial input

    // console.log(title);
    // console.log(date);
    // console.log(category);
    // console.log(content);

    if (editingPostId === null) {



        const newPost = {
            id: Date.now(),
            title: title,
            date: date,
            category: category,
            content: content,
        };

        posts.push(newPost);
        console.log(newPost);
    }
    else {
        const postToEdit = posts.find(function (post) {
            return post.id === editingPostId;
        });
        postToEdit.title = title;
        postToEdit.date = date;
        postToEdit.category = category;
        postToEdit.content = content;
    }


    savePosts();
    renderPosts();
    // displayPost(newPost);
    postForm.reset();
    editingPostId = null;
});

function displayPost(post) {
    const postElement = document.createElement("article");
    postElement.classList.add("post");

    const titleElement = document.createElement("h3");
    titleElement.textContent = post.title;

    const dateElement = document.createElement("p");
    dateElement.textContent = "Date: " + post.date;

    const categoryElement = document.createElement("p");
    categoryElement.textContent = "Category: " + post.category;

    const contentElement = document.createElement("p");
    contentElement.textContent = post.content;

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";

    editButton.dataset.id = post.id;

    editButton.addEventListener("click", function () {
        const selectedID = Number(editButton.dataset.id);

        editingPostId = selectedID;

        console.log(editingPostId);

        const postToEdit = posts.find(function (post) {
            return post.id === selectedID;

        });
        console.log(postToEdit);
        titleInput.value = postToEdit.title;
        dateInput.value = postToEdit.date;
        categoryInput.value = postToEdit.category;
        contentInput.value = postToEdit.content;
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.dataset.id = post.id;

    deleteButton.addEventListener("click", function () {
        const selectedID = Number(deleteButton.dataset.id);

        posts = posts.filter(function (post) {
            return post.id !== selectedID;
        });

        savePosts();
        postElement.remove();
    });


    postElement.appendChild(titleElement);
    postElement.appendChild(dateElement);
    postElement.appendChild(categoryElement);
    postElement.appendChild(contentElement);

    postElement.appendChild(editButton);
    postElement.appendChild(deleteButton);

    postsContainer.appendChild(postElement);

}

loadPosts();