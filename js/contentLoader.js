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

/* === HTML "TEMPLATE" FUNCTIONS === */

// Template for Work & Research
function createCollapse(item) {
    const itemEl = document.createElement('div');
    itemEl.classList.add("mb-3");
    const descriptionList = item.description.map(point => `<li>${point}</li>`).join('');
    itemEl.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <h4 class="mb-0">${item.title}</h4>
                <p class="mb-0">${item.date}</p>
            </div>
            <button class="btn btn-link toggleDescription">Show More</button>
        </div>
        <div class="description mt-2" style="display: none;">
            <p><strong>${item.supervisor}</strong></p>
            <ul>${descriptionList}</ul>
        </div>
    `;
    itemEl.querySelector('.toggleDescription').addEventListener('click', function () {
        const desc = itemEl.querySelector('.description');
        const isHidden = desc.style.display == 'none';
        desc.style.display = isHidden ? 'block' : 'none';
        this.textContent = isHidden ? 'Show Less' : 'Show More';
    });
    return itemEl;
}

// Template for Portfolio Projects
function createProjectCard(item) {
    const itemEl = document.createElement('div');
    itemEl.classList.add("project-card", "card", "mb-4");

    const techList = item.technologies.map(tech => 
        `<span class="badge badge-info mr-1">${tech}</span>`
    ).join('');

    const contentDivId = `project-content-${item.file.replace('.md', '')}`;

    itemEl.innerHTML = `
        <div class="row no-gutters">
            ${item.image ? `
            <div class="col-md-4">
                <img src="${item.image}" class="card-img" alt="${item.title} preview">
            </div>
            ` : ''}
            <div class="${item.image ? 'col-md-8' : 'col-md-12'}">
                <div class="card-body">
                    <h3 class="card-title">${item.title}</h3>
                    <h6 class="card-subtitle mb-2 text-muted">${item.date}</h6>
                    <div class="mb-3">${techList}</div>
                    <div class="card-text" id="${contentDivId}"><p><em>Loading...</em></p></div>
                    ${item.link ? `
                    <a href="${item.link}" class="btn btn-primary mt-2" target="_blank" rel="noopener noreferrer">
                        View on GitHub
                    </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    // Fetch Markdown content for the description
    fetchMarkdown(`public/portfolio/${item.file}`, contentDivId);
    return itemEl;
}

// Template for Blog Posts (UPDATED)
function createBlogPost(item) {
    const itemEl = document.createElement('div');
    // We use .col-md-6 to put two cards side-by-side on medium screens
    itemEl.classList.add("col-md-6", "mb-4");

    itemEl.innerHTML = `
        <div class="card blog-list-card">
            <div class="card-body">
                <h4 class="card-title">${item.title}</h4>
                <p class="card-subtitle mb-2 text-muted"><em>Posted on: ${item.date}</em></p>
                <button class="btn btn-primary" 
                        data-toggle="modal" 
                        data-target="#blogModal" 
                        data-file="public/blog/${item.file}" 
                        data-title="${item.title}">
                    Read Article
                </button>
            </div>
        </div>
    `;
    return itemEl;
}

/* === ASYNC CONTENT LOADER FUNCTIONS === */

// New function to fetch Markdown and convert it
function fetchMarkdown(filePath, targetElementId) {
    // Init Showdown converter
    const converter = new showdown.Converter();

    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Could not load ${filePath}`);
            }
            return response.text();
        })
        .then(markdownText => {
            // Convert and display
            const htmlContent = converter.makeHtml(markdownText);
            document.getElementById(targetElementId).innerHTML = htmlContent;
        })
        .catch(error => {
            document.getElementById(targetElementId).innerHTML = "<p class='text-danger'>Error loading content.</p>";
            console.error(error);
        });
}

// Main function to load JSON and "route" to the correct template
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
            
            section.innerHTML = ''; // Clear "loading" text

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
            console.error("Error loading content list:", error);
            document.getElementById(sectionID).innerHTML = "<p class='text-danger'>Error loading content list.</p>";
        });
}

/* === INITIALIZE ALL CONTENT LOADING === */
loadContent('workSection', 'public/data/work.json');
loadContent('researchSection', 'public/data/research.json');
loadContent('portfolioSection', 'public/data/portfolio.json');
loadContent('blogSection', 'public/data/blog.json');