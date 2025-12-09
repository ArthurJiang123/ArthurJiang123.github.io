/* === IMAGE GALLERY LOGIC === */

// images for galleries
const galleryImages1 = ['img/sy2.jpg', 'img/sy3.jpg'];
const galleryImages2 = ['img/jn2.jpg', 'img/jn3.jpg'];

/**
 * A reusable function to handle gallery loading logic.
 * @param {string} btnId - The ID of the "See More" button
 * @param {string} galleryId - The ID of the container where images will be added
 * @param {Array} imageList - The array of image paths to load
 */
function setupGalleryHandler(btnId, galleryId, imageList){
    let currentIndex = 0; // Track how many images have been added
    const button = document.getElementById(btnId);
    const galleryContainer = document.getElementById(galleryId);

    button.addEventListener('click', function(){
        // Check if there are more images left to show
        if (currentIndex < imageList.length){
            // Get the next image path
            const imgSrc = imageList[currentIndex];

            // Create the HTML structure for the new image card
            const imageElement = `
                <div class="col-sm-6 col-md-4">
                    <div class="card mb-4">
                        <img src="${imgSrc}" class="card-img-top" alt="gallery image">
                    </div>
                </div>
            `;
            // Append the new image card to the container
            galleryContainer.innerHTML += imageElement;

            // Move to the next index
            currentIndex++;

            // If we have shown all images, hide the button
            if (currentIndex >= imageList.length){
                button.style.display = "none";
            }
        }
    })


}

// Initialize the logic for both galleries
setupGalleryHandler('addImage1', 'IG1', galleryImages1);
setupGalleryHandler('addImage2', 'IG2', galleryImages2);

/* === NAVIGATION LOGIC === */

// Helper function to hide all content sections
function hideAllSections() {
    document.getElementById("home").style.display = "none";
    document.getElementById("personal").style.display = "none";
    document.getElementById("portfolio").style.display = "none";
    document.getElementById("blog").style.display = "none";
}

// Helper function to manage the "active" class on buttons
function setActiveButton(activeButtonId) {
    document.getElementById('homeButton').classList.remove("active");
    document.getElementById('personalButton').classList.remove("active");
    document.getElementById('portfolioButton').classList.remove("active");
    document.getElementById('blogButton').classList.remove("active");
    document.getElementById(activeButtonId).classList.add("active");
}

// Home Button
document.getElementById("homeButton").addEventListener("click", function (e) {
    e.preventDefault();
    hideAllSections();
    setActiveButton("homeButton");
    document.getElementById("home").style.display = "block";
    window.location.hash = 'home';
});

// Personal Button
document.getElementById("personalButton").addEventListener("click", function (e) {
    e.preventDefault();
    hideAllSections();
    setActiveButton("personalButton");
    document.getElementById("personal").style.display = "block";
    window.location.hash = 'personal';
});

// Portfolio Button (NEW)
document.getElementById("portfolioButton").addEventListener("click", function (e) {
    e.preventDefault();
    hideAllSections();
    setActiveButton("portfolioButton");
    document.getElementById("portfolio").style.display = "block";
    window.location.hash = 'portfolio';
});

// Blog Button (NEW)
document.getElementById("blogButton").addEventListener("click", function (e) {
    e.preventDefault();
    hideAllSections();
    setActiveButton("blogButton");
    document.getElementById("blog").style.display = "block";
    window.location.hash = 'blog';
});

// Function to show the correct section based on the URL hash (UPDATED)
function showSectionFromHash() {
    const hash = window.location.hash;
    
    if (hash === '#personal') {
        document.getElementById('personalButton').click();
    } else if (hash === '#portfolio') {
        document.getElementById('portfolioButton').click();
    } else if (hash === '#blog') {
        document.getElementById('blogButton').click();
    } else {
        // Default to home
        document.getElementById('homeButton').click();
    }
}

// Run showSectionFromHash when the page first loads
document.addEventListener('DOMContentLoaded', showSectionFromHash);
// Run showSectionFromHash when the hash changes (e.g., user hits back/forward)
window.addEventListener('hashchange', showSectionFromHash);


/* === MESSAGE BOARD LOGIC === */
function loadComments(){
    // get data with the key "siteMessages".
    // if empty, default to an empty array []
    const storedData = localStorage.getItem("siteMessages");
    // convert the JSON string back to an array type
    const storedComments = storedData ? JSON.parse(storedData) : [];

    const commentBoard = document.getElementById("messageList");
    // clear existing messages to avoid duplication
    commentBoard.innerHTML = '';

    // loop through each comment and add to the board
    storedComments.forEach((commentText, index) => {
        addCommentToDOM(commentText, index);
    });

}

// helper function to add a comment to the DOM (prevents XSS)
function addCommentToDOM(text, index) {
    const commentBoard = document.getElementById("messageList");
    // 1. Create a wrapper div for the comment
    const msgWrapper = document.createElement("div");
    msgWrapper.className = "mb-2 comment-item";

    // 2. Create a text node, using "textContent" to prevent XSS attacks
    const textNode = document.createElement("span");
    textNode.textContent = text;

    // 3. Create a remove button
    const deleteBtn = document.createElement("a");
    deleteBtn.href = "#";
    deleteBtn.className = "remove-msg text-danger ml-2";
    deleteBtn.textContent = "[Remove]";
    // Store the index so we know which comment to delete
    deleteBtn.dataset.index = index;

    // 4. Assemble the elements: wrapper contains text and button
    msgWrapper.appendChild(textNode);
    msgWrapper.appendChild(deleteBtn);
    
    // 5. Add the assembled comment to the board
    commentBoard.appendChild(msgWrapper);
}


// Event Listener for the Submit Button
document.getElementById("addMsgBtn").addEventListener("click", function () {
    var commentInput = document.getElementById("commentInput");
    var commentText = commentInput.value; // Get text from the textarea
    
    if (commentText) {
        // 1. load the existing comments from localStorage
        const storedData = localStorage.getItem("siteMessages");
        const comments = storedData ? JSON.parse(storedData) : [];
        
        // 2. Add the new comment to the array and save back to Local Storage
        comments.push(commentText);
        localStorage.setItem("siteMessages", JSON.stringify(comments));

        // 3. Update the UI to show the new message
        addCommentToDOM(commentText, comments.length - 1);

        // 4. Clear the input field
        commentInput.value = "";
    }
});

// Load the comments when the page finishes loading
document.addEventListener("DOMContentLoaded", loadComments);


// Listener to remove a message
document.addEventListener("click", function (e) {
    // Check if the clicked element is a remove button
    if (e.target.classList.contains("remove-msg")) {
        e.preventDefault(); // prevent default link behavior

        // 1. Get the index of the comment to remove
        const indexToDelete = e.target.dataset.index;
        
        // 2. Load existing comments from localStorage
        const storedData = localStorage.getItem("siteMessages");
        const comments = storedData ? JSON.parse(storedData) : [];

        // 3. Remove the comment from the array
        // Use splice to remove the comment at the specified index
        if(indexToDelete !== undefined){
            // splice(starting index, number of items to remove)
            comments.splice(indexToDelete, 1);
        }

        // 4. Save the updated array back to localStorage
        localStorage.setItem("siteMessages", JSON.stringify(comments));

        // 5. Reload the comments to update indices and UI
        // This ensures the indices are correct after deletion
        loadComments();
    }
});

/* === DARK MODE TOGGLE === */
// Helper function to apply the theme to the body and update the button text
function applyTheme(isDark){
    const body = document.body;
    const btn = document.getElementById("darkModeToggle");

    if(isDark){
        // Add the dark mode class to the body
        body.classList.add("dark-mode-background");
        // Change button text to indicate we can switch to Light Mode
        btn.textContent = "Light Mode";   
    } else {

        // Remove the dark mode class
        body.classList.remove("dark-mode-background");
        // Change button text to indicate we can switch to Dark Mode
        btn.textContent = "Dark Mode";
    }
}

// Initialize the theme when the page loads
function initTheme(){
    // 1. Check if the user has a saved preference in Local Storage
    const savedTheme = localStorage.getItem("userTheme");

    if (savedTheme == "dark") {
        // User previously selected Dark Mode
        applyTheme(true);
    } else if (savedTheme == "light") {
        // User previously selected Light Mode
        applyTheme(false);
    } else {
        // 2. If no saved preference, check the system/OS settings
        // window.matchMedia checks the user's system preference
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(systemPrefersDark);
    }
}

// Run the initialization on page load
initTheme();

// Event listener for the toggle button
document.getElementById("darkModeToggle").addEventListener("click", function () {
    // Check the current theme by looking for the class on the body
    const isCurrentDark = document.body.classList.contains("dark-mode-background");
    
    if (isCurrentDark) {
        // Switch to Light Mode
        applyTheme(false);
        // Save the preference in Local Storage ("userTheme" is the key)
        localStorage.setItem("userTheme", "light");
    } else {
        // Switch to Dark Mode
        applyTheme(true);
        // Save the preference in Local Storage
        localStorage.setItem("userTheme", "dark");
    }
});

/* === FOOTER COPYRIGHT YEAR === */
document.getElementById("copyrightYear").textContent = new Date().getFullYear();

/* === BACK TO TOP BUTTON === */
var backToTopBtn = document.getElementById("backToTopBtn");

window.onscroll = function() {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
};


/* === BLOG MODAL LOADER LOGIC === */
// This uses jQuery, which is already loaded by Bootstrap

// Create one Showdown converter to reuse
const markdownConverter = new showdown.Converter();

$('#blogModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var postTitle = button.data('title'); // Get data from data-* attributes
    var postFile = button.data('file');

    var modal = $(this);
    modal.find('.modal-title').text(postTitle);
    modal.find('.modal-body').html('<p><em>Loading content...</em></p>');

    // Fetch the Markdown file
    fetch(postFile)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(markdownText => {
            // Convert Markdown to HTML
            var htmlContent = markdownConverter.makeHtml(markdownText);
            // Display in the modal
            modal.find('.modal-body').html(htmlContent);
        })
        .catch(error => {
            console.error('Error fetching blog post:', error);
            modal.find('.modal-body').html('<p class="text-danger">Sorry, the post could not be loaded.</p>');
        });
});