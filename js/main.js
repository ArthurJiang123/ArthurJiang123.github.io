/* === IMAGE GALLERY: SHOW ALL + LIGHTBOX (reuses #blogModal for full-size image) === */
const galleryImages1 = ['img/sy2.jpg', 'img/sy3.jpg'];
const galleryImages2 = ['img/jn2.jpg', 'img/jn3.jpg'];

function openImageLightbox(src, altText) {
    removeBlogPostingJsonLd();
    const modal = $('#blogModal');
    modal.find('.modal-title').text('Photo');
    const img = $('<img>', { src: src, alt: altText || 'Gallery photo', class: 'img-fluid d-block mx-auto' });
    modal.find('.modal-body').empty().append(img);
    modal.modal('show');
}

/**
 * One-click reveal of all extra images; delegated clicks open lightbox.
 */
function setupGalleryShowAllAndLightbox(btnId, galleryId, imageList) {
    const button = document.getElementById(btnId);
    const galleryContainer = document.getElementById(galleryId);

    button.addEventListener('click', function () {
        imageList.forEach(function (src) {
            const col = document.createElement('div');
            col.className = 'col-sm-6 col-md-4';
            const card = document.createElement('div');
            card.className = 'card mb-4';
            const img = document.createElement('img');
            img.src = src;
            img.className = 'card-img-top gallery-photo';
            img.alt = 'Travel photo';
            card.appendChild(img);
            col.appendChild(card);
            galleryContainer.appendChild(col);
        });
        button.style.display = 'none';
    });

    galleryContainer.addEventListener('click', function (ev) {
        const img = ev.target.closest('img.gallery-photo');
        if (!img) return;
        openImageLightbox(img.getAttribute('src'), img.getAttribute('alt'));
    });
}

setupGalleryShowAllAndLightbox('addImage1', 'IG1', galleryImages1);
setupGalleryShowAllAndLightbox('addImage2', 'IG2', galleryImages2);

/* === NAVIGATION LOGIC === */

function hideAllSections() {
    document.getElementById('home').style.display = 'none';
    document.getElementById('personal').style.display = 'none';
    document.getElementById('portfolio').style.display = 'none';
    document.getElementById('blog').style.display = 'none';
}

function applyNavUi(activeButtonId) {
    const ids = ['homeButton', 'personalButton', 'portfolioButton', 'blogButton'];
    ids.forEach(function (id) {
        document.getElementById(id).classList.toggle('active', id === activeButtonId);
    });
    var pageTitle = "Jiahao's Website";
    if (activeButtonId === 'homeButton') pageTitle = 'Home | Jiahao';
    else if (activeButtonId === 'personalButton') pageTitle = 'Personal | Jiahao';
    else if (activeButtonId === 'portfolioButton') pageTitle = 'Portfolio | Jiahao';
    else if (activeButtonId === 'blogButton') pageTitle = 'Blog | Jiahao';
    document.title = pageTitle;
}

document.getElementById('homeButton').addEventListener('click', function (e) {
    e.preventDefault();
    hideAllSections();
    applyNavUi('homeButton');
    document.getElementById('home').style.display = 'block';
    window.location.hash = 'home';
});

document.getElementById('personalButton').addEventListener('click', function (e) {
    e.preventDefault();
    hideAllSections();
    applyNavUi('personalButton');
    document.getElementById('personal').style.display = 'block';
    window.location.hash = 'personal';
});

document.getElementById('portfolioButton').addEventListener('click', function (e) {
    e.preventDefault();
    hideAllSections();
    applyNavUi('portfolioButton');
    document.getElementById('portfolio').style.display = 'block';
    window.location.hash = 'portfolio';
});

document.getElementById('blogButton').addEventListener('click', function (e) {
    e.preventDefault();
    $('#blogModal').modal('hide');
    hideAllSections();
    applyNavUi('blogButton');
    document.getElementById('blog').style.display = 'block';
    window.location.hash = 'blog';
});

function parseLocationHash() {
    var raw = window.location.hash || '';
    var blogPostMatch = raw.match(/^#\/blog\/([^/]+)$/);
    if (blogPostMatch) {
        return { kind: 'blog-post', slug: decodeURIComponent(blogPostMatch[1]) };
    }
    var lower = raw.toLowerCase();
    if (lower === '#/blog' || lower === '#blog') {
        return { kind: 'blog' };
    }
    if (raw === '#personal') return { kind: 'personal' };
    if (raw === '#portfolio') return { kind: 'portfolio' };
    return { kind: 'home' };
}

function fileToBlogSlug(file) {
    return String(file).replace(/\.md$/i, '');
}

function removeBlogPostingJsonLd() {
    var el = document.getElementById('jsonld-blog-posting');
    if (el) el.remove();
}

function injectBlogPostingJsonLd(title, slug, dateStr) {
    removeBlogPostingJsonLd();
    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'jsonld-blog-posting';
    var postUrlObj = new URL(window.location.href);
    postUrlObj.hash = '#/blog/' + slug;
    var postUrl = postUrlObj.toString();
    var payload = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        url: postUrl,
        author: {
            '@type': 'Person',
            name: 'Jiahao Jiang'
        }
    };
    if (dateStr) {
        payload.datePublished = dateStr;
    }
    script.textContent = JSON.stringify(payload);
    document.head.appendChild(script);
}

const markdownConverter = new showdown.Converter({ tables: true });

function sanitizeHtml(html) {
    if (typeof DOMPurify !== 'undefined') {
        return DOMPurify.sanitize(html);
    }
    return html;
}

/**
 * Loads markdown into the blog modal and updates JSON-LD + document title.
 */
function loadBlogModalContent(postTitle, postFile, slug, dateStr) {
    var modal = $('#blogModal');
    modal.find('.modal-title').text(postTitle);
    modal.find('.modal-body').html('<p><em>Loading content...</em></p>');
    document.title = postTitle + ' | Jiahao Jiang';
    if (slug) {
        injectBlogPostingJsonLd(postTitle, slug, dateStr || '');
    }
    fetch(postFile)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(function (markdownText) {
            var htmlContent = sanitizeHtml(markdownConverter.makeHtml(markdownText));
            modal.find('.modal-body').html(htmlContent);
        })
        .catch(function (error) {
            console.error('Error fetching blog post:', error);
            modal.find('.modal-body').html('<p class="text-danger">Sorry, the post could not be loaded.</p>');
        });
}

function openBlogPostFromSlug(slug) {
    fetch('public/data/blog.json')
        .then(function (r) {
            if (!r.ok) throw new Error('blog list');
            return r.json();
        })
        .then(function (posts) {
            var post = posts.find(function (p) {
                return fileToBlogSlug(p.file) === slug;
            });
            if (!post) {
                return;
            }
            var s = fileToBlogSlug(post.file);
            loadBlogModalContent(post.title, 'public/blog/' + post.file, s, post.date || '');
            $('#blogModal').modal('show');
        })
        .catch(function (err) {
            console.error(err);
        });
}

function showSectionFromHash() {
    var loc = parseLocationHash();
    if (loc.kind === 'blog-post') {
        hideAllSections();
        document.getElementById('blog').style.display = 'block';
        applyNavUi('blogButton');
        openBlogPostFromSlug(loc.slug);
        return;
    }
    if (loc.kind === 'blog') {
        document.getElementById('blogButton').click();
        return;
    }
    if (loc.kind === 'personal') {
        document.getElementById('personalButton').click();
        return;
    }
    if (loc.kind === 'portfolio') {
        document.getElementById('portfolioButton').click();
        return;
    }
    document.getElementById('homeButton').click();
}

document.addEventListener('DOMContentLoaded', showSectionFromHash);
window.addEventListener('hashchange', showSectionFromHash);

$('#blogModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    if (button && button.length && button.data('file')) {
        var postTitle = button.data('title');
        var postFile = button.data('file');
        var slug = button.data('slug');
        var postDate = button.data('date') || '';
        loadBlogModalContent(postTitle, postFile, slug, postDate);
        if (slug && window.history && window.history.replaceState) {
            window.history.replaceState(null, '', '#/blog/' + encodeURIComponent(slug));
        }
    }
});

$('#blogModal').on('hidden.bs.modal', function () {
    removeBlogPostingJsonLd();
    var loc = parseLocationHash();
    if (loc.kind === 'blog-post' && window.history && window.history.replaceState) {
        window.history.replaceState(null, '', '#blog');
    }
    var activeNav = document.querySelector('.sidebar a.active');
    if (activeNav && activeNav.id) {
        applyNavUi(activeNav.id);
    }
});

/* === SKILL CARDS: TAP AND KEYBOARD FLIP === */
function setupSkillCardFlip() {
    document.querySelectorAll('.skillcard-container .skillcard').forEach(function (card) {
        var container = card.closest('.skillcard-container');
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-pressed', 'false');

        function setFlipped(on) {
            card.classList.toggle('flipped', on);
            card.setAttribute('aria-pressed', on ? 'true' : 'false');
        }

        card.addEventListener('click', function (e) {
            e.preventDefault();
            var next = !card.classList.contains('flipped');
            setFlipped(next);
            if (container && !next) {
                container.classList.add('skillcard-suppress-hover');
            }
        });

        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                var next = !card.classList.contains('flipped');
                setFlipped(next);
                if (container && !next) {
                    container.classList.add('skillcard-suppress-hover');
                }
            }
        });

        if (container) {
            container.addEventListener('mouseleave', function () {
                container.classList.remove('skillcard-suppress-hover');
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', setupSkillCardFlip);

/* === MESSAGE BOARD LOGIC === */
function loadComments() {
    const storedData = localStorage.getItem('siteMessages');
    const storedComments = storedData ? JSON.parse(storedData) : [];

    const commentBoard = document.getElementById('messageList');
    commentBoard.innerHTML = '';

    storedComments.forEach((commentText, index) => {
        addCommentToDOM(commentText, index);
    });
}

function addCommentToDOM(text, index) {
    const commentBoard = document.getElementById('messageList');
    const msgWrapper = document.createElement('div');
    msgWrapper.className = 'mb-2 comment-item';

    const textNode = document.createElement('span');
    textNode.textContent = text;

    const deleteBtn = document.createElement('a');
    deleteBtn.href = '#';
    deleteBtn.className = 'remove-msg text-danger ml-2';
    deleteBtn.textContent = '[Remove]';
    deleteBtn.dataset.index = index;

    msgWrapper.appendChild(textNode);
    msgWrapper.appendChild(deleteBtn);

    commentBoard.appendChild(msgWrapper);
}

document.getElementById('addMsgBtn').addEventListener('click', function () {
    var commentInput = document.getElementById('commentInput');
    var commentText = commentInput.value;

    if (commentText) {
        const storedData = localStorage.getItem('siteMessages');
        const comments = storedData ? JSON.parse(storedData) : [];

        comments.push(commentText);
        localStorage.setItem('siteMessages', JSON.stringify(comments));

        addCommentToDOM(commentText, comments.length - 1);

        commentInput.value = '';
    }
});

document.addEventListener('DOMContentLoaded', loadComments);

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('remove-msg')) {
        e.preventDefault();

        const indexToDelete = e.target.dataset.index;

        const storedData = localStorage.getItem('siteMessages');
        const comments = storedData ? JSON.parse(storedData) : [];

        if (indexToDelete !== undefined) {
            comments.splice(indexToDelete, 1);
        }

        localStorage.setItem('siteMessages', JSON.stringify(comments));

        loadComments();
    }
});

/* === DARK MODE TOGGLE === */
function applyTheme(isDark) {
    const body = document.body;
    const btn = document.getElementById('darkModeToggle');

    if (isDark) {
        body.classList.add('dark-mode-background');
        btn.textContent = 'Light Mode';
    } else {
        body.classList.remove('dark-mode-background');
        btn.textContent = 'Dark Mode';
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('userTheme');

    if (savedTheme == 'dark') {
        applyTheme(true);
    } else if (savedTheme == 'light') {
        applyTheme(false);
    } else {
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(systemPrefersDark);
    }
}

initTheme();

document.getElementById('darkModeToggle').addEventListener('click', function () {
    const isCurrentDark = document.body.classList.contains('dark-mode-background');

    if (isCurrentDark) {
        applyTheme(false);
        localStorage.setItem('userTheme', 'light');
    } else {
        applyTheme(true);
        localStorage.setItem('userTheme', 'dark');
    }
});

/* === FOOTER COPYRIGHT YEAR === */
document.getElementById('copyrightYear').textContent = new Date().getFullYear();

/* === BACK TO TOP BUTTON === */
var backToTopBtn = document.getElementById('backToTopBtn');

window.onscroll = function () {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }
};

backToTopBtn.addEventListener('click', function (e) {
    e.preventDefault();

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
