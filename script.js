// Wait for the entire DOM to be loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- GitHub API Configuration ---
    // IMPORTANT: Make sure these match your GitHub details.
    const GITHUB_USER = 'mobotronst';
    const GITHUB_REPO = 'mobotronst.github.io';
    const SITES_FOLDER = 'sites';

    // --- DOM Element References ---
    const workbench = document.getElementById('workbench');
    const yearSpan = document.getElementById('year');
    
    // Set the current year in the footer
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // A collection of icons to randomly assign to projects
    const ICONS = ["🧪", "⚡️", "⚛️", "⚙️", "💡", "⚗️", "📡", "🤖"];

    // --- Data Fetching and Rendering ---

    /**
     * Fetches project data directly from the GitHub repository and initiates the rendering process.
     */
    async function loadExperiments() {
        const apiUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${SITES_FOLDER}`;
        
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`GitHub API error! Status: ${response.status}`);
            }
            const files = await response.json();

            // Filter for files that end with .html
            const htmlFiles = files.filter(file => file.type === 'file' && file.name.endsWith('.html'));

            // Clear the loader once data is fetched
            workbench.innerHTML = ''; 

            if (htmlFiles.length === 0) {
                throw new Error('No HTML files found in the "sites" directory.');
            }

            // Create a card for each HTML file found
            htmlFiles.forEach((file, index) => {
                const project = processFileIntoProject(file, index);
                const card = createExperimentCard(project);
                workbench.appendChild(card);
            });

        } catch (error) {
            console.error("Could not load experiments:", error);
            // Display a more informative error message on the workbench
            workbench.innerHTML = `
                <div class="error-message" style="color: #ff6b6b; background-color: rgba(255, 0, 0, 0.1); border: 1px solid #ff6b6b; padding: 20px; text-align: center; grid-column: 1 / -1;">
                    <h2>Experiment Failed!</h2>
                    <p>${error.message}</p>
                    <p>Please ensure the 'sites' folder exists in the '${GITHUB_REPO}' repository and contains HTML files.</p>
                </div>
            `;
        }
    }

    /**
     * Processes a file object from GitHub API into a project object.
     * @param {object} file - The file object from GitHub.
     * @param {number} index - The index of the file in the array, for icon selection.
     * @returns {object} A project object ready for card creation.
     */
    function processFileIntoProject(file, index) {
        // Create a clean title from the filename
        const title = file.name
            .replace(/\.html$/, '') // Remove .html extension
            .replace(/[-_]/g, ' ')   // Replace hyphens and underscores with spaces
            .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word

        return {
            title: title,
            description: `A dynamically discovered experiment. The contents of this project are a mystery waiting to be explored.`,
            icon: ICONS[index % ICONS.length], // Cycle through the available icons
            url: file.path, // Use the direct path from the API response
            tags: ["Live Project", "HTML"]
        };
    }

    /**
     * Creates an HTML element for a single project card.
     * @param {object} project - The project data object.
     * @returns {HTMLElement} - The created anchor element representing the card.
     */
    function createExperimentCard(project) {
        const cardLink = document.createElement('a');
        cardLink.href = project.url;
        cardLink.className = 'experiment-card';
        cardLink.target = '_blank';
        cardLink.rel = 'noopener noreferrer';

        const randomRotation = (Math.random() - 0.5) * 4;
        cardLink.style.transform = `rotate(${randomRotation}deg)`;

        const cardHTML = `
            <div class="card-header">
                <div class="card-icon">${project.icon}</div>
                <h2 class="card-title">${project.title}</h2>
            </div>
            <p class="card-description">${project.description}</p>
            <div class="card-tags">
                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        `;

        cardLink.innerHTML = cardHTML;
        return cardLink;
    }

    // --- Initial Load ---
    loadExperiments();

});

