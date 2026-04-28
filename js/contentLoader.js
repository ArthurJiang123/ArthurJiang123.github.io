/* === EXPAND/COLLAPSE FOR WORK/RESEARCH === */
function setAllDescriptions(sectionID, show) {
    const section = document.getElementById(sectionID);
    const descriptions = section.querySelectorAll('.description');
    const buttons = section.querySelectorAll('.toggleDescription');
    descriptions.forEach(desc => (desc.style.display = show ? 'block' : 'none'));
    buttons.forEach(btn => (btn.textContent = show ? 'Show Less' : 'Show More'));
}
document.getElementById('expandAllWork').addEventListener('click', () => setAllDescriptions('workSection', true));
document.getElementById('collapseAllWork').addEventListener('click', () => setAllDescriptions('workSection', false));
document.getElementById('expandAllResearch').addEventListener('click', () => setAllDescriptions('researchSection', true));
document.getElementById('collapseAllResearch').addEventListener('click', () => setAllDescriptions('researchSection', false));

function sanitizeHtml(html) {
    if (typeof DOMPurify !== 'undefined') {
        return DOMPurify.sanitize(html);
    }
    return html;
}

/* === HTML BUILDERS (DOM APIs to avoid XSS from JSON) === */

function createCollapse(item) {
    const itemEl = document.createElement('div');
    itemEl.classList.add('mb-3');

    const headerRow = document.createElement('div');
    headerRow.className = 'd-flex justify-content-between align-items-center';

    const titleBlock = document.createElement('div');
    const h4 = document.createElement('h4');
    h4.className = 'mb-0';
    h4.textContent = item.title;
    const dateP = document.createElement('p');
    dateP.className = 'mb-0';
    dateP.textContent = item.date;
    titleBlock.appendChild(h4);
    titleBlock.appendChild(dateP);

    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'btn btn-link toggleDescription';
    toggleBtn.textContent = 'Show More';

    headerRow.appendChild(titleBlock);
    headerRow.appendChild(toggleBtn);

    const desc = document.createElement('div');
    desc.className = 'description mt-2';
    desc.style.display = 'none';

    const supervisorP = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = item.supervisor;
    supervisorP.appendChild(strong);

    const ul = document.createElement('ul');
    (item.description || []).forEach(function (point) {
        const li = document.createElement('li');
        li.textContent = point;
        ul.appendChild(li);
    });

    desc.appendChild(supervisorP);
    desc.appendChild(ul);

    itemEl.appendChild(headerRow);
    itemEl.appendChild(desc);

    toggleBtn.addEventListener('click', function () {
        const isHidden = desc.style.display === 'none';
        desc.style.display = isHidden ? 'block' : 'none';
        toggleBtn.textContent = isHidden ? 'Show Less' : 'Show More';
    });

    return itemEl;
}

function createProjectCard(item) {
    const itemEl = document.createElement('div');
    itemEl.classList.add('project-card', 'card', 'mb-4');

    const row = document.createElement('div');
    row.className = 'row no-gutters';

    if (item.image) {
        const imgCol = document.createElement('div');
        imgCol.className = 'col-md-4';
        const img = document.createElement('img');
        img.src = item.image;
        img.className = 'card-img';
        img.alt = (item.title || 'Project') + ' preview';
        imgCol.appendChild(img);
        row.appendChild(imgCol);
    }

    const bodyCol = document.createElement('div');
    bodyCol.className = item.image ? 'col-md-8' : 'col-md-12';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const titleEl = document.createElement('h3');
    titleEl.className = 'card-title';
    titleEl.textContent = item.title;

    const dateEl = document.createElement('h6');
    dateEl.className = 'card-subtitle mb-2 text-muted';
    dateEl.textContent = item.date;

    const techWrap = document.createElement('div');
    techWrap.className = 'mb-3';
    (item.technologies || []).forEach(function (tech) {
        const badge = document.createElement('span');
        badge.className = 'badge badge-info mr-1';
        badge.textContent = tech;
        techWrap.appendChild(badge);
    });

    const baseId = String(item.file || '')
        .replace(/\.md$/i, '')
        .replace(/[^a-zA-Z0-9_-]/g, '_');
    const contentDivId = 'project-content-' + baseId;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'card-text';
    contentDiv.id = contentDivId;
    const loadingP = document.createElement('p');
    const em = document.createElement('em');
    em.textContent = 'Loading...';
    loadingP.appendChild(em);
    contentDiv.appendChild(loadingP);

    cardBody.appendChild(titleEl);
    cardBody.appendChild(dateEl);
    cardBody.appendChild(techWrap);
    cardBody.appendChild(contentDiv);

    if (item.link && /^https?:\/\//i.test(String(item.link).trim())) {
        const link = document.createElement('a');
        link.href = String(item.link).trim();
        link.className = 'btn btn-primary mt-2';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'View on GitHub';
        cardBody.appendChild(link);
    }

    bodyCol.appendChild(cardBody);
    row.appendChild(bodyCol);
    itemEl.appendChild(row);

    fetchMarkdown('public/portfolio/' + item.file, contentDivId);
    return itemEl;
}

function blogSlugFromFile(file) {
    return String(file).replace(/\.md$/i, '');
}

function createBlogPost(item) {
    const itemEl = document.createElement('div');
    itemEl.classList.add('col-md-6', 'mb-4');

    const card = document.createElement('div');
    card.className = 'card blog-list-card';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const slug = blogSlugFromFile(item.file);

    const titleEl = document.createElement('h4');
    titleEl.className = 'card-title';
    const titleLink = document.createElement('a');
    titleLink.href = '#/blog/' + encodeURIComponent(slug);
    titleLink.textContent = item.title;
    titleEl.appendChild(titleLink);

    const sub = document.createElement('p');
    sub.className = 'card-subtitle mb-2 text-muted';
    const em = document.createElement('em');
    em.textContent = 'Posted on: ' + item.date;
    sub.appendChild(em);

    const readBtn = document.createElement('button');
    readBtn.type = 'button';
    readBtn.className = 'btn btn-primary';
    readBtn.setAttribute('data-toggle', 'modal');
    readBtn.setAttribute('data-target', '#blogModal');
    readBtn.setAttribute('data-file', 'public/blog/' + item.file);
    readBtn.setAttribute('data-title', item.title);
    readBtn.setAttribute('data-slug', slug);
    readBtn.setAttribute('data-date', item.date || '');
    readBtn.textContent = 'Read Article';

    cardBody.appendChild(titleEl);
    cardBody.appendChild(sub);
    cardBody.appendChild(readBtn);
    card.appendChild(cardBody);
    itemEl.appendChild(card);

    return itemEl;
}

/* === ASYNC CONTENT LOADER FUNCTIONS === */

function fetchMarkdown(filePath, targetElementId) {
    const converter = new showdown.Converter({ tables: true });

    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Could not load ${filePath}`);
            }
            return response.text();
        })
        .then(markdownText => {
            const htmlContent = sanitizeHtml(converter.makeHtml(markdownText));
            const el = document.getElementById(targetElementId);
            if (el) {
                el.innerHTML = htmlContent;
            }
        })
        .catch(error => {
            const el = document.getElementById(targetElementId);
            if (el) {
                const p = document.createElement('p');
                p.className = 'text-danger';
                p.textContent = 'Error loading content.';
                el.innerHTML = '';
                el.appendChild(p);
            }
            console.error(error);
        });
}

function loadContent(sectionID, jsonFileName) {
    fetch(jsonFileName)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const section = document.getElementById(sectionID);

            if (sectionID === 'blogSection') {
                section.classList.add('row');
            }

            section.innerHTML = '';

            data.forEach(item => {
                let element;
                if (sectionID === 'workSection' || sectionID === 'researchSection') {
                    element = createCollapse(item);
                } else if (sectionID === 'portfolioSection') {
                    element = createProjectCard(item);
                } else if (sectionID === 'blogSection') {
                    element = createBlogPost(item);
                }

                if (element) {
                    section.appendChild(element);
                }
            });
        })
        .catch(error => {
            console.error('Error loading content list:', error);
            const section = document.getElementById(sectionID);
            if (section) {
                const p = document.createElement('p');
                p.className = 'text-danger';
                p.textContent = 'Error loading content list.';
                section.innerHTML = '';
                section.appendChild(p);
            }
        });
}

/* === INITIALIZE ALL CONTENT LOADING === */
loadContent('workSection', 'public/data/work.json');
loadContent('researchSection', 'public/data/research.json');
loadContent('portfolioSection', 'public/data/portfolio.json');
loadContent('blogSection', 'public/data/blog.json');
