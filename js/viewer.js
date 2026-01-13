document.addEventListener('DOMContentLoaded', async () => {
    // 1. Header/Footer betöltése (ugyanaz a logika, mint main.js-ben)
    await loadComponents();

    // 2. URL paraméter kiolvasása (?id=...)
    const urlParams = new URLSearchParams(window.location.search);
    const caseId = urlParams.get('id');

    if (!caseId) {
        document.getElementById('main-content').innerHTML = '<div class="container"><h2>Error: No case ID specified.</h2></div>';
        return;
    }

    // 3. Adat betöltése és renderelés
    loadCaseData(caseId);
});

async function loadComponents() {
    try {
        // Mivel a walkthroughs mappában vagyunk, egy szinttel feljebb kell menni (../)
        const headerRes = await fetch('../components/header.html');
        let headerHtml = await headerRes.text();
        headerHtml = headerHtml.replaceAll('{{prefix}}', '../'); 
        document.querySelector('header').innerHTML = headerHtml;

        const footerRes = await fetch('../components/footer.html');
        document.querySelector('footer').innerHTML = await footerRes.text();
    } catch (e) {
        console.error("Component load error", e);
    }
}

async function loadCaseData(id) {
    try {
        // A JSON betöltése
        const response = await fetch('../data/cases.json');
        const cases = await response.json();

        // Megkeressük a megfelelő ID-t
        const currentCase = cases.find(c => c.id === id);

        if (!currentCase) {
            document.getElementById('main-content').innerHTML = '<div class="container"><h2>Error: Case not found.</h2></div>';
            return;
        }

        // --- Adatok beillesztése a HTML-be ---
        
        // Cím és Meta
        document.title = `${currentCase.title} | JD Security`;
        document.getElementById('case-tag').innerText = currentCase.tag;
        document.getElementById('case-title').innerText = currentCase.title;
        document.getElementById('case-meta').innerText = `DATE: ${currentCase.date} | ID: ${currentCase.id}`;
        document.getElementById('case-intro').innerText = currentCase.intro;

        // Lépések generálása (Accordions)
        const stepsContainer = document.getElementById('steps-container');
        stepsContainer.innerHTML = ''; // Törlés biztos ami biztos

        currentCase.steps.forEach((step, index) => {
            const stepHtml = `
                <div class="analysis-step" style="border: 1px solid var(--border-color); margin-bottom: 20px; border-radius: 8px; overflow: hidden; background: white;">
                    <div class="step-header mono" onclick="toggleStep(this)" style="padding: 15px 20px; background: #f8fafc; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-weight: 600;">
                        <span>${step.title}</span>
                        <span class="toggle-icon text-blue">+</span>
                    </div>
                    <div class="step-content" style="display: none; padding: 25px; border-top: 1px solid var(--border-color);">
                        <p>${step.content}</p>
                        ${step.code ? `<pre style="background: var(--code-bg); color: var(--code-text); padding: 15px; border-radius: 6px; overflow-x: auto; margin-top: 15px; font-size: 0.9rem;"><code>${step.code}</code></pre>` : ''}
                    </div>
                </div>
            `;
            stepsContainer.insertAdjacentHTML('beforeend', stepHtml);
        });

    } catch (e) {
        console.error(e);
        document.getElementById('main-content').innerHTML = '<div class="container"><h2>Error loading data.</h2></div>';
    }
}

// Egyszerű toggle funkció az accordionhoz (globálisra tesszük, hogy a HTML-ből hívható legyen)
window.toggleStep = function(headerElement) {
    const content = headerElement.nextElementSibling;
    const icon = headerElement.querySelector('.toggle-icon');
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.innerText = '-';
        headerElement.style.background = '#e2e8f0';
    } else {
        content.style.display = 'none';
        icon.innerText = '+';
        headerElement.style.background = '#f8fafc';
    }
};