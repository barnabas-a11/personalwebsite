document.addEventListener('DOMContentLoaded', () => {
    loadComponents();
    loadPosts();
    initSkillIssueTicker();
    initCryptoCopier();
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

            const btn = document.getElementById('brainrot-btn');
            if(btn) btn.addEventListener('click', toggleBrainrot);
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
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const posts = await response.json();

        if (recentContainer) {
            recentContainer.innerHTML = ''; 
            const recentPosts = posts.slice(0, 4);
            recentPosts.forEach(post => {
                const linkUrl = `walkthroughs/view.html?id=${post.id}`;
                recentContainer.innerHTML += `
                    <a href="${linkUrl}" class="post-item">
                        <span class="post-meta mono"><span class="post-tag">[${post.tag}]</span> ${post.date}</span>
                        <h3>${post.title}</h3>
                        <p>${post.summary}</p> 
                    </a>`;
            });
        }

        if (allContainer) {
            allContainer.innerHTML = '';
            posts.forEach(post => {
                const linkUrl = `walkthroughs/view.html?id=${post.id}`;
                allContainer.innerHTML += `
                    <a href="${linkUrl}" class="skill-card sec-card">
                        <h3 class="mono text-blue">${post.title}</h3>
                    </a>`;
            });
        }
    } catch (e) {
        console.error(e);
    }
}

function initSkillIssueTicker() {
    const messages = [
        "STATUS: Manually copying code from StackOverflow...",
        "THREAT LEVEL: Zero Days found: 0 (I'm just blind)",
        "ALERT: I have no idea why this code works",
        "CURRENT MOOD: Imposter Syndrome kicking in",
        "SYSADMIN: 'sudo rm -rf /' looking real tasty right now",
        "DEBUG: Console.log('here') is my only debugger",
        "SKILL ISSUE: Detected",
        "NSA STATUS: Probably watching (Hi Agent Smith!)",
        "UPTIME: 4 hours (2 mins coding, 3h 58m debugging CSS)",
        "CERTIFICATIONS: Trust me bro"
    ];

    const observer = new MutationObserver((mutations, obs) => {
        const tickerContainer = document.getElementById('skill-issue-feed');
        if (tickerContainer) {
            const content = [...messages, ...messages, ...messages].map(msg => 
                `<span class="ticker-item">${msg}</span>`
            ).join('');
            tickerContainer.innerHTML = content;
            obs.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function toggleBrainrot() {
    const isActive = document.body.classList.toggle('brainrot-mode');
    const btn = document.getElementById('brainrot-btn');
    
    if (isActive) {
        btn.innerText = "[ NORMIE MODE ]";
        btn.style.color = "#ff0000";
        translateToBrainrot();
    } else {
        btn.innerText = "[ TOGGLE BRAINROT ]";
        btn.style.color = "";
        location.reload(); 
    }
}

function translateToBrainrot() {
    const replacements = {
        "Cybersecurity": "Digital Rizz Protection",
        "Operations": "Side Quests",
        "Analysis": "Vibe Check",
        "Malware": "Opps",
        "Forensics": "Stalking",
        "About": "Lore",
        "Skills": "Build",
        "Contact": "Slide into DMs",
        "Error": "L + Ratio",
        "Loading": "Let him cook...",
        "SOC Operations": "Gatekeeping",
        "Status": "Current Mood",
        "Professional": "Tryhard",
        "Student": "Noob",
        "Intelligence": "Tea",
        "Secure": "Based"
    };

    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while (node = walk.nextNode()) {
        let text = node.nodeValue;
        if (text.trim().length > 2) {
            Object.keys(replacements).forEach(key => {
                const regex = new RegExp(key, "gi");
                text = text.replace(regex, replacements[key]);
            });
            if (!text.includes("💀") && Math.random() > 0.75) text += " 💀";
            else if (!text.includes("fr") && Math.random() > 0.75) text += " fr fr";
            node.nodeValue = text;
        }
    }
    
    const statusBadge = document.querySelector('.status-badge');
    if(statusBadge) statusBadge.innerText = "STATUS: OHIO RIZZ";
}

function initCryptoCopier() {
    const addresses = document.querySelectorAll('.crypto-addr');
    
    addresses.forEach(addr => {
        addr.addEventListener('click', async () => {
            const originalText = addr.innerText;
            const cleanAddress = originalText.replace(/\s/g, '');

            try {
                await navigator.clipboard.writeText(cleanAddress);
                
                // Visual Feedback
                addr.classList.add('copied');
                addr.innerText = "[ ADDRESS COPIED ]";
                
                setTimeout(() => {
                    addr.classList.remove('copied');
                    addr.innerText = originalText;
                }, 1500);
                
            } catch (err) {
                console.error('Copy failed:', err);
                addr.style.borderColor = '#ef4444';
            }
        });
    });
}