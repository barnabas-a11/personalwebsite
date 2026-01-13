// js/main.js - DEBUG VERSION

document.addEventListener('DOMContentLoaded', () => {
    console.log(">> MAIN.JS ELINDULT");
    
    // Két dolgot indítunk el egyszerre
    loadComponents();
    loadPosts();
});

// 1. Fejléc és Lábléc betöltése
async function loadComponents() {
    try {
        console.log(">> Header betöltése folyamatban...");
        
        // Header
        const headerRes = await fetch('components/header.html');
        if (!headerRes.ok) throw new Error(`HTTP hiba! Status: ${headerRes.status}`);
        
        let headerHtml = await headerRes.text();
        // A prefix törlése
        headerHtml = headerHtml.replaceAll('{{prefix}}', ''); 
        
        const headerElement = document.querySelector('header');
        if(headerElement) {
            headerElement.innerHTML = headerHtml;
            console.log(">> Header sikeresen beillesztve.");
        } else {
            console.error(">> HIBA: Nem találom a <header> taget a HTML-ben!");
        }

        // Footer
        console.log(">> Footer betöltése folyamatban...");
        const footerRes = await fetch('components/footer.html');
        if (!footerRes.ok) throw new Error(`HTTP hiba! Status: ${footerRes.status}`);
        
        const footerElement = document.querySelector('footer');
        if(footerElement) {
            footerElement.innerHTML = await footerRes.text();
            console.log(">> Footer sikeresen beillesztve.");
        }

    } catch (e) {
        console.error(">> KRITIKUS HIBA A KOMPONENSEK BETÖLTÉSEKOR:", e);
    }
}

// 2. Posztok betöltése
async function loadPosts() {
    const container = document.getElementById('post-container');
    if(!container) {
        console.error(">> HIBA: Nem találom a 'post-container' ID-t a HTML-ben!");
        return;
    }

    try {
        console.log(">> JSON adatbázis keresése...");
        const response = await fetch('data/cases.json');
        
        if (!response.ok) {
            throw new Error(`Nem találom a data/cases.json fájlt. Status: ${response.status}`);
        }
        
        const posts = await response.json();
        console.log(">> JSON sikeresen betöltve. Elemek száma:", posts.length);

        container.innerHTML = ''; // Töröljük a loading szöveget

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
        console.log(">> Posztok renderelése kész.");

    } catch (e) {
        console.error(">> HIBA A POSZTOK BETÖLTÉSEKOR:", e);
        container.innerHTML = `<p class="mono" style="color: red;">HIBA: ${e.message}.<br>Nyisd meg a konzolt (F12) a részletekért.</p>`;
    }
}