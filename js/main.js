document.addEventListener('DOMContentLoaded', () => {
    console.log(">> MAIN.JS STARTED");
    
    loadComponents();
    loadPosts();
});

async function loadComponents() {
    try {
        console.log(">> Loading header...");
        
        const headerRes = await fetch('components/header.html');
        if (!headerRes.ok) throw new Error(`HTTP Error! Status: ${headerRes.status}`);
        
        let headerHtml = await headerRes.text();
        headerHtml = headerHtml.replaceAll('{{prefix}}', ''); 
        
        const headerElement = document.querySelector('header');
        if(headerElement) {
            headerElement.innerHTML = headerHtml;
            console.log(">> Header successfully inserted.");
        } else {
            console.error(">> ERROR: <header> tag not found in HTML!");
        }

        console.log(">> Loading footer...");
        const footerRes = await fetch('components/footer.html');
        if (!footerRes.ok) throw new Error(`HTTP Error! Status: ${footerRes.status}`);
        
        const footerElement = document.querySelector('footer');
        if(footerElement) {
            footerElement.innerHTML = await footerRes.text();
            console.log(">> Footer successfully inserted.");
        }

    } catch (e) {
        console.error(">> CRITICAL ERROR LOADING COMPONENTS:", e);
    }
}

async function loadPosts() {
    const container = document.getElementById('post-container');
    if(!container) {
        console.error(">> ERROR: 'post-container' ID not found in HTML!");
        return;
    }

    try {
        console.log(">> Fetching JSON database...");
        const response = await fetch('data/cases.json');
        
        if (!response.ok) {
            throw new Error(`data/cases.json not found. Status: ${response.status}`);
        }
        
        const posts = await response.json();
        console.log(">> JSON successfully loaded. Item count:", posts.length);

        container.innerHTML = ''; 

        posts.forEach(post => {
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
            container.innerHTML += html;
        });
        console.log(">> Posts rendering complete.");

    } catch (e) {
        console.error(">> ERROR LOADING POSTS:", e);
        container.innerHTML = `<p class="mono" style="color: red;">ERROR: ${e.message}.<br>Open console (F12) for details.</p>`;
    }
}