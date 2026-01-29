document.addEventListener('DOMContentLoaded', () => {
    loadComponents();
    loadRecentPosts();
    initSkillIssueTicker();
    initCryptoCopier();

    if (document.getElementById('sec-grid')) {
        initSearchableGrid('sec', 'sec-grid', 'sec-search');
    }
    if (document.getElementById('magic-grid')) {
        initSearchableGrid('magic', 'magic-grid', 'magic-search');
    }
});

async function loadRecentPosts() {
    const container = document.getElementById('post-container');
    if (!container) return;

    try {
        const response = await fetch(`data/cases.json?v=${new Date().getTime()}`);
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const posts = await response.json();

        container.innerHTML = '';

        const recentItems = posts.slice(0, 6);

        recentItems.forEach(post => {
            const linkUrl = `walkthroughs/view.html?id=${post.id}`;

            const tagStyle = post.category === 'magic'
                ? 'color: #a855f7; background: rgba(168, 85, 247, 0.1);'
                : '';
                
            container.innerHTML += `
                <a href="${linkUrl}" class="post-item">
                    <span class="post-meta mono">
                        <span class="post-tag" style="${tagStyle}">[${post.tag}]</span> 
                        ${post.date}
                    </span>
                    <h3>${post.title}</h3>
                    <p>${post.summary}</p> 
                </a>`;
        });
    } catch (e) {
        console.error("Failed to sync intelligence data:", e);
        container.innerHTML = '<p class="mono">Failed to load local intelligence.</p>';
    }
}

async function initSearchableGrid(category, gridId, searchId) {
    const grid = document.getElementById(gridId);
    const searchInput = document.getElementById(searchId);
    if (!grid) return;

    try {
        const response = await fetch('data/cases.json');
        const allPosts = await response.json();
        const categoryPosts = allPosts.filter(p => p.category === category);

        const render = (items) => {
            grid.innerHTML = '';
            if (items.length === 0) {
                grid.innerHTML = '<p class="mono" style="color: var(--text-muted);">No results found.</p>';
                return;
            }

            items.forEach(post => {
                let imageHtml = '';
                let cardClass = 'sec-card';

                if (category === 'magic' && post.thumbnail) {
                    imageHtml = `<div class="card-img" style="background-image: url('${post.thumbnail}');"></div>`;
                    cardClass += ' has-image';
                }

                grid.innerHTML += `
                    <a href="walkthroughs/view.html?id=${post.id}" class="skill-card ${cardClass}">
                        ${imageHtml}
                        <div class="card-content">
                            <h3 class="mono text-blue">${post.title}</h3>
                            <span class="mono" style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 5px;">
                                [${post.tag}] ${post.date}
                            </span>
                        </div>
                    </a>`;
            });
        };

        render(categoryPosts);

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const filtered = categoryPosts.filter(post =>
                    post.title.toLowerCase().includes(term) ||
                    post.tag.toLowerCase().includes(term) ||
                    post.summary.toLowerCase().includes(term)
                );
                render(filtered);
            });
        }

    } catch (e) {
        console.error("Grid error:", e);
        grid.innerHTML = '<p class="mono">Failed to load data.</p>';
    }
}

async function loadComponents() {
    try {
        const headerRes = await fetch('components/header.html');
        if (!headerRes.ok) throw new Error(`HTTP Error! Status: ${headerRes.status}`);

        let headerHtml = await headerRes.text();
        headerHtml = headerHtml.replaceAll('{{prefix}}', '');

        const headerElement = document.querySelector('header');
        if (headerElement) {
            headerElement.innerHTML = headerHtml;
        }

        const footerRes = await fetch('components/footer.html');
        if (!footerRes.ok) throw new Error(`HTTP Error! Status: ${footerRes.status}`);

        const footerElement = document.querySelector('footer');
        if (footerElement) {
            footerElement.innerHTML = await footerRes.text();

            const btn = document.getElementById('brainrot-btn');
            if (btn) btn.addEventListener('click', toggleBrainrot);
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
    if (statusBadge) statusBadge.innerText = "STATUS: OHIO RIZZ";
}

function initCryptoCopier() {
    const addresses = document.querySelectorAll('.crypto-addr');

    addresses.forEach(addr => {
        addr.addEventListener('click', async () => {
            const originalText = addr.innerText;
            const cleanAddress = originalText.replace(/\s/g, '');

            try {
                await navigator.clipboard.writeText(cleanAddress);

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