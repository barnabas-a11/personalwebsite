document.addEventListener('DOMContentLoaded', () => {
    loadComponents();
    loadPosts();
});

async function loadComponents() {
    try {
        const headerRes = await fetch('components/header.html');
        if (!headerRes.ok) throw new Error(`HTTP Error! Status: ${headerRes.status}`);
        
        let headerHtml = await headerRes.text();
        headerHtml = headerHtml.replaceAll('{{prefix}}', ''); 
        
        const headerElement = document.querySelector('header');
        if(headerElement) {
            headerElement.innerHTML = headerHtml;
        }

        const footerRes = await fetch('components/footer.html');
        if (!footerRes.ok) throw new Error(`HTTP Error! Status: ${footerRes.status}`);
        
        const footerElement = document.querySelector('footer');
        if(footerElement) {
            footerElement.innerHTML = await footerRes.text();
        }

    } catch (e) {
        console.error(e);
    }
}

async function loadPosts() {
    const recentContainer = document.getElementById('post-container');
    const allContainer = document.getElementById('all-cases-container');

    if (!recentContainer && !allContainer) return;

    try {
        const response = await fetch('data/cases.json');
        
        if (!response.ok) {
            throw new Error(`data/cases.json not found. Status: ${response.status}`);
        }
        
        const posts = await response.json();

        if (recentContainer) {
            recentContainer.innerHTML = ''; 
            const recentPosts = posts.slice(0, 4);

            recentPosts.forEach(post => {
                const linkUrl = `walkthroughs/view.html?id=${post.id}`;
                const html = `
                    <a href="${linkUrl}" class="post-item">
                        <span class="post-meta mono">
                            <span class="post-tag">[${post.tag}]</span> ${post.date}
                        </span>
                        <h3>${post.title}</h3>
                        <p>${post.summary}</p> 
                    </a>
                `;
                recentContainer.innerHTML += html;
            });
        }

        if (allContainer) {
            allContainer.innerHTML = '';
            posts.forEach(post => {
                const linkUrl = `walkthroughs/view.html?id=${post.id}`;
                const html = `
                    <a href="${linkUrl}" class="skill-card sec-card">
                        <h3 class="mono text-blue">${post.title}</h3>
                    </a>
                `;
                allContainer.innerHTML += html;
            });
        }

    } catch (e) {
        console.error(e);
        const errorHtml = `<p class="mono" style="color: red;">ERROR: ${e.message}</p>`;
        if(recentContainer) recentContainer.innerHTML = errorHtml;
        if(allContainer) allContainer.innerHTML = errorHtml;
    }
}