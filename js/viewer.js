document.addEventListener('DOMContentLoaded', async () => {
    await loadComponents();

    const urlParams = new URLSearchParams(window.location.search);
    const caseId = urlParams.get('id');

    if (!caseId) {
        document.getElementById('main-content').innerHTML = '<div class="container"><h2>Error: No case ID specified.</h2></div>';
        return;
    }

    loadCaseData(caseId);
});

async function loadComponents() {
    try {
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
        const response = await fetch(`../data/cases.json?v=${new Date().getTime()}`);
        const cases = await response.json();
        const currentCase = cases.find(c => c.id === id);

        if (!currentCase) {
            document.getElementById('main-content').innerHTML = '<div class="container"><h2>Error: Case not found.</h2></div>';
            return;
        }

        const backLink = document.getElementById('back-link');
        if (backLink) {
            if (currentCase.category === 'magic') {
                backLink.href = '../magic.html';
                backLink.innerHTML = '&larr; BACK TO MAGIC';
            } else {
                backLink.href = '../sec.html';
                backLink.innerHTML = '&larr; BACK TO OPERATIONS';
            }
        }

        const titleElement = document.getElementById('case-title');
        titleElement.innerText = currentCase.title;

        if (currentCase.category === 'magic') {
            titleElement.classList.add('expert-title');
            titleElement.classList.remove('text-gradient');
        }

        document.title = `${currentCase.title} | t3jfel SEC`;
        document.getElementById('case-tag').innerText = currentCase.tag;
        document.getElementById('case-meta').innerText = `DATE: ${currentCase.date} | ID: ${currentCase.id}`;
        document.getElementById('case-intro').innerText = currentCase.intro;

        const container = document.getElementById('steps-container');
        container.innerHTML = '';

        if (currentCase.category === 'magic' && currentCase.sections) {
            container.className = 'expert-container';

            currentCase.sections.forEach(section => {
                let sectionHtml = `<div class="expert-section">
                    <h2 class="expert-h2">${section.heading}</h2>`;

                section.content.forEach(block => {
                    if (block.type === 'text') {
                        sectionHtml += `<p class="expert-p">${block.value}</p>`;
                    } else if (block.type === 'code') {
                        const codeVal = Array.isArray(block.value) ? block.value.join('\n') : block.value;
                        sectionHtml += `<pre class="expert-code-block"><code>${codeVal}</code></pre>`;
                    } else if (block.type === 'image') {
                        const imgPath = block.value.startsWith('http') ? block.value : '../' + block.value;
                        sectionHtml += `<div class="expert-image-wrapper">
                            <img src="${imgPath}" alt="Technical Documentation Image">
                        </div>`;
                    }
                });

                sectionHtml += `</div>`;
                container.insertAdjacentHTML('beforeend', sectionHtml);
            });
        } else {
            container.className = 'analysis-steps-container';
            currentCase.steps.forEach((step) => {
                let innerHtml = '';
                if (step.body) {
                    step.body.forEach(block => {
                        if (block.type === 'text') innerHtml += `<p style="margin-top: 15px;">${block.value}</p>`;
                        else if (block.type === 'code') {
                            const codeVal = Array.isArray(block.value) ? block.value.join('\n') : block.value;
                            innerHtml += `<pre style="background: var(--code-bg); color: #4ade80; padding: 15px; border-radius: 6px; overflow-x: auto; margin-top: 15px;"><code>${codeVal}</code></pre>`;
                        }
                        else if (block.type === 'image') {
                            const imgPath = block.value.startsWith('http') ? block.value : '../' + block.value;
                            innerHtml += `<img src="${imgPath}" style="margin-top: 20px; border-radius: 6px; border: 1px solid var(--border-color); width: 100%; object-fit: contain; background: #000;">`;
                        }
                    });
                }
                const stepHtml = `
                    <div class="analysis-step" style="border: 1px solid var(--border-color); margin-bottom: 20px; border-radius: 8px; overflow: hidden;">
                        <div class="step-header mono" onclick="toggleStep(this)" style="padding: 15px 20px; background: #f8fafc; cursor: pointer; display: flex; justify-content: space-between; align-items: center; color: #000;">
                            <span>${step.title}</span>
                            <span class="toggle-icon">+</span>
                        </div>
                        <div class="step-content" style="display: none; padding: 25px; background: var(--card-bg); color: var(--text-main);">
                            ${innerHtml}
                        </div>
                    </div>`;
                container.insertAdjacentHTML('beforeend', stepHtml);
            });
        }
    } catch (e) {
        console.error(e);
    }
}

window.toggleStep = function (headerElement) {
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