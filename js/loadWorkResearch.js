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
  *  the primary function, used to create a collapsible item
  * @param {*} title 
  * @param {*} date 
  * @param {*} supervisor 
  * @param {*} description 
  * @returns 
  */
function createCollapse(title, date, supervisor, description){
    
    const item = document.createElement('div');

    item.classList.add("mb-3");

    item.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <h4 class="mb-0">${title}</h4>
                <p class="mb-0">${date}</p>
            </div>
            <button class="btn btn-link toggleDescription">Show More</button>
        </div>
        <p class="description mt-2" style="display: none;">${supervisor}<br>${description}</p>
    `;

    item.querySelector('.toggleDescription').addEventListener('click', function(){
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
 * @param {*} fullFileName 
 */
function loadContent(sectionID, fullFileName){
    fetch(fullFileName)
    .then(response => response.text())
    .then(data => {
        const section = document.getElementById(sectionID);
        const items = data.trim().split('\n');

        items.forEach(item => {
            const [title, date, supervisor, description] = item.split('|');
            const collapseItem = createCollapse(title, date, supervisor, description);
            section.appendChild(collapseItem);
        })
    }) 
    .catch(error => console.error("Error loading content:", error));
}
loadContent('workSection', 'public/text-files/work.txt');
loadContent('researchSection', 'public/text-files/research.txt');