
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
    document.getElementById('hobbyButton').classList.remove("active");
    //document.getElementById('projectButton').classList.remove("active");
    document.getElementById("home").style.display = "block";
    document.getElementById("hobby").style.display = "none";
    //document.getElementById("projects").style.display = "none";
});

document.getElementById("hobbyButton").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById('hobbyButton').classList.add("active");
    document.getElementById('homeButton').classList.remove("active");
    //document.getElementById('projectButton').classList.remove("active");
    document.getElementById("home").style.display = "none";
    document.getElementById("hobby").style.display = "block";
    //document.getElementById("projects").style.display = "none";
});

/**
document.getElementById("projectButton").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById('projectButton').classList.add("active");
    document.getElementById('homeButton').classList.remove("active");
    document.getElementById('hobbyButton').classList.remove("active");
    document.getElementById("home").style.display = "none";
    document.getElementById("hobby").style.display = "none";
    document.getElementById("projects").style.display = "block";
});
*/

document.getElementById("addMsg").addEventListener("click", function () {
    var comment = prompt("Any comment/msg for the website?");
    if (comment) {
        var commentBoard = document.getElementById("message");
        commentBoard.innerHTML += `<p>${comment} <a href="#" class="remove-msg">[Remove]</a></p>`;
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