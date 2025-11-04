/* === IMAGE GALLERY LOGIC === */
let IG1Count = 0; // # of pics in IG1
const IG1 = ['img/sy2.jpg', 'img/sy3.jpg'];

let IG2Count = 0; // # of pics in IG2
const IG2 = ['img/jn2.jpg', 'img/jn3.jpg'];

document.getElementById('addImage1').addEventListener('click', function () {
    if (IG1Count < 2) {
        const gallery = document.querySelector('#IG1');
        const imageElement = `
            <div class="col-sm-6 col-md-4">
                <div class="card mb-4">
                    <img src="${IG1[IG1Count]}" class="card-img-top" alt="sanya${IG1Count + 1}">
                </div>
            </div>
        `;
        gallery.innerHTML += imageElement;
        IG1Count++;
    }
});

document.getElementById('addImage2').addEventListener('click', function () {
    if (IG2Count < 2) {
        const gallery = document.querySelector('#IG2');
        const imageElement = `
            <div class="col-sm-6 col-md-4">
                <div class="card mb-4">
                    <img src="${IG2[IG2Count]}" class="card-img-top" alt="jinan${IG2Count + 1}">
                </div>
            </div>
        `;
        gallery.innerHTML += imageElement;
        IG2Count++;
    }
});

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
document.getElementById("addMsgBtn").addEventListener("click", function () {
    var commentInput = document.getElementById("commentInput");
    var comment = commentInput.value; // Get text from the textarea
    
    if (comment) {
        var commentBoard = document.getElementById("messageList");
        // Add the new comment with a remove link
        commentBoard.innerHTML += `<p class="mb-2">${comment} <a href="#" class="remove-msg text-danger">[Remove]</a></p>`;
        commentInput.value = ""; // Clear the input field
    }
});

// Listener to remove a message
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-msg")) {
        e.preventDefault();
        e.target.parentElement.remove();
    }
});

/* === DARK MODE TOGGLE === */
document.getElementById("darkModeToggle").addEventListener("click", function () {
    // toggle the class
    const isDarkMode = document.body.classList.toggle("dark-mode-background");
    // update the button text
    this.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
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