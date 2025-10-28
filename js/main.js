
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

document.getElementById("homeButton").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById('homeButton').classList.add("active");
    document.getElementById('personalButton').classList.remove("active");
    //document.getElementById('projectButton').classList.remove("active");
    document.getElementById("home").style.display = "block";
    document.getElementById("personal").style.display = "none";
    
    window.location.hash = 'home';
});

document.getElementById("personalButton").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById('personalButton').classList.add("active");
    document.getElementById('homeButton').classList.remove("active");
    //document.getElementById('projectButton').classList.remove("active");
    document.getElementById("home").style.display = "none";
    document.getElementById("personal").style.display = "block";
    
    window.location.hash = 'personal';
});

// Function to show section based on URL hash
function showSectionFromHash() {
    const hash = window.location.hash;
    
    if (hash === '#personal') {
        document.getElementById('personalButton').click();
    } else {
        // Default to home if hash is empty or #home
        document.getElementById('homeButton').click();
    }
}

// 1. Run when the page first loads
document.addEventListener('DOMContentLoaded', showSectionFromHash);

// 2. Run when the hash changes (e.g., user hits back/forward button)
window.addEventListener('hashchange', showSectionFromHash);


// New Message Board Logic
document.getElementById("addMsgBtn").addEventListener("click", function () {
    var commentInput = document.getElementById("commentInput");
    // Get text from the textarea
    var comment = commentInput.value;
    
    if (comment) {
        var commentBoard = document.getElementById("messageList");
        // Add the new comment with a remove link
        commentBoard.innerHTML += `<p class="mb-2">${comment} <a href="#" class="remove-msg text-danger">[Remove]</a></p>`;
        commentInput.value = ""; // Clear the input field
    }
});


document.addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-msg")) {
        e.preventDefault();
        e.target.parentElement.remove();
    }
});

document.getElementById("darkModeToggle").addEventListener("click", function () {

    // toggle the class
    const isDarkMode = document.body.classList.toggle("dark-mode-background");

    // update the button text
    this.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
});

// Set dynamic copyright year in footer
document.getElementById("copyrightYear").textContent = new Date().getFullYear();


var backToTopBtn = document.getElementById("backToTopBtn");

// When the user scrolls down 200px from the top, show the button
window.onscroll = function() {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
};