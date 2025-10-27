/**
 * @param {*} sectionID 
 * @param {*} show 
 * set all descriptions to display or hide
 */
function setAllDescriptions(sectionID, show) {
    const section = document.getElementById(sectionID);
    const descriptions = section.querySelectorAll('.description');
    const buttons = section.querySelectorAll('.toggleDescription');

    descriptions.forEach(desc => (desc.style.display = show ? 'block' : 'none'));
    buttons.forEach(btn => (btn.textContent = show ? 'Show Less' : 'Show More'));
}

// Event listeners for Expand/Collapse All buttons
document.getElementById('expandAllWork').addEventListener('click', () => {
    setAllDescriptions('workSection', true);
});

document.getElementById('collapseAllWork').addEventListener('click', () => {
    setAllDescriptions('workSection', false);
});

document.getElementById('expandAllResearch').addEventListener('click', () => {
    setAllDescriptions('researchSection', true);
});

document.getElementById('collapseAllResearch').addEventListener('click', () => {
    setAllDescriptions('researchSection', false);
});

/**
 * Creates a collapsible item.
 * @param {string} title 
 * @param {string} date 
 * @param {string} supervisor 
 * @param {string[]} descriptionPoints - An array of strings for the description
 * @returns {HTMLElement}
 */
function createCollapse(title, date, supervisor, descriptionPoints) {

    const item = document.createElement('div');
    item.classList.add("mb-3");

    // Create the bullet points from the description array
    const descriptionList = descriptionPoints.map(point => `<li>${point}</li>`).join('');

    item.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <h4 class="mb-0">${title}</h4>
                <p class="mb-0">${date}</p>
            </div>
            <button class="btn btn-link toggleDescription">Show More</button>
        </div>
        <div class="description mt-2" style="display: none;">
            <p><strong>${supervisor}</strong></p>
            <ul>
                ${descriptionList}
            </ul>
        </div>
    `;

    item.querySelector('.toggleDescription').addEventListener('click', function () {
        const desc = item.querySelector('.description');
        const isHidden = desc.style.display == 'none';
        desc.style.display = isHidden ? 'block' : 'none';
        this.textContent = isHidden ? 'Show Less' : 'Show More';
    });
    return item;
}

/**
 * load the content upon bootstrap
 * @param {*} sectionID 
 * @param {*} jsonFileName 
 */
function loadContent(sectionID, jsonFileName) {
    fetch(jsonFileName)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Parse the response as JSON
        })
        .then(data => {
            const section = document.getElementById(sectionID);
            
            // Loop through the array of items from the JSON file
            data.forEach(item => {
                const collapseItem = createCollapse(item.title, item.date, item.supervisor, item.description);
                section.appendChild(collapseItem);
            });
        })
        .catch(error => console.error("Error loading content:", error));
}

// Load content from the new JSON files
loadContent('workSection', 'public/data/work.json');
loadContent('researchSection', 'public/data/research.json');