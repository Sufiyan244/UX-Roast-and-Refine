tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: { sans: ['Inter', 'sans-serif'], display: ['Space Grotesk', 'sans-serif'] },
            colors: { brand: { 50: '#f0fdfa', 100: '#ccfbf1', 500: '#14b8a6', 600: '#0d9488', 900: '#134e4a' } }
        }
    }
}

const IntegrateAI = "AIzaSyAKZam2bvxHmGcoPJf_tSlXmqLB6hTjCNc";
let currentImage = "";
let auditData = null;

document.getElementById('theme-toggle').onclick = () => document.documentElement.classList.toggle('dark');
document.getElementById('drop-zone').onclick = () => document.getElementById('file-input').click();
document.getElementById('file-input').onchange = (e) => processFile(e.target.files[0]);
document.getElementById('demo-btn').onclick = (e) => { e.stopPropagation(); runDemo(); };

document.getElementById('chat-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChatMessage();
});

function resetApp() {
    currentImage = "";
    auditData = null;
    document.getElementById('file-input').value = "";
    document.getElementById('results-dashboard').classList.add('hidden');
    document.getElementById('processing-state').classList.add('hidden');
    document.getElementById('upload-section').classList.remove('hidden');
    document.getElementById('new-scan-btn').classList.add('hidden');
    document.getElementById('simulation-output').classList.add('hidden');
    document.getElementById('chat-box').innerHTML = `
                <div class="text-left">
                    <span class="inline-block bg-white dark:bg-slate-800 px-3 py-2 rounded-xl text-sm shadow-sm border border-slate-100 dark:border-slate-700">
                        Hi! I'm your UX expert. Ask me for color palette ideas, font pairings, or specific accessibility rules.
                    </span>
                </div>`;
}

function processFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        currentImage = e.target.result;
        performAudit(currentImage);
    };
    reader.readAsDataURL(file);
}

async function geminiFetch(prompt, imageBase64 = null) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${IntegrateAI}`;
    const parts = [{ text: prompt }];
    if (imageBase64) {
        const base64Content = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
        parts.push({ inlineData: { mimeType: "image/png", data: base64Content } });
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts }] })
        });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (err) {
        return "Error connecting to AI.";
    }
}

async function performAudit(img) {
    document.getElementById('upload-section').classList.add('hidden');
    document.getElementById('processing-state').classList.remove('hidden');

    const prompt = `Analyze this UI screenshot. Return a JSON object (strictly raw JSON, no markdown) with:
            {
                "score": number,
                "roast": "string",
                "fixes": [{
                    "issue": "string", 
                    "solution": "string", 
                    "html_fix": "Provide a small, standalone HTML/Tailwind snippet that correctly implements the fix. Use semantic HTML and modern design."
                }]
            }`;

    const result = await geminiFetch(prompt, img);
    try {
        const cleanJson = result.replace(/```json|```/g, "").trim();
        auditData = JSON.parse(cleanJson);
        showResults(img, auditData);
    } catch (err) {
        runDemo();
    }
}

function showResults(img, data) {
    document.getElementById('processing-state').classList.add('hidden');
    document.getElementById('results-dashboard').classList.remove('hidden');
    document.getElementById('new-scan-btn').classList.remove('hidden');
    document.getElementById('preview-img').src = img;
    document.getElementById('score-val').innerText = data.score;
    document.getElementById('roast-val').innerText = data.roast;

    const container = document.getElementById('fixes-container');
    container.innerHTML = "";
    data.fixes.forEach((fix, i) => {
        const div = document.createElement('div');
        div.className = "glass p-6 rounded-2xl space-y-4 border border-slate-100 dark:border-slate-800";
        div.innerHTML = `
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] font-black text-brand-500 uppercase tracking-widest bg-brand-50 dark:bg-brand-900/20 px-2 py-0.5 rounded">Issue #${i + 1}</span>
                        <h4 class="font-bold text-lg">${fix.issue}</h4>
                    </div>
                    <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">${fix.solution}</p>
                    <div class="mt-4">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1">
                                <i data-lucide="code-2" class="w-3 h-3"></i> Suggested HTML Improvement
                            </span>
                        </div>
                        <div class="prose prose-sm dark:prose-invert max-w-full">
                            ${marked.parse('```html\n' + fix.html_fix + '\n```')}
                        </div>
                    </div>
                `;
        container.appendChild(div);
    });
    lucide.createIcons();
}

async function simulatePersona(persona) {
    const output = document.getElementById('simulation-output');
    output.classList.remove('hidden');
    output.innerHTML = `<div class="flex items-center gap-2 animate-pulse"><i data-lucide="loader" class="w-3 h-3 animate-spin"></i> Empathizing...</div>`;
    lucide.createIcons();

    const prompt = `Act as ${persona}. In 2-3 sentences, describe your experience looking at this UI. What is frustrating? What is confusing? Be direct.`;
    const thought = await geminiFetch(prompt, currentImage);
    output.innerText = thought;
}

async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const chatBox = document.getElementById('chat-box');
    const message = input.value.trim();
    if (!message) return;

    input.value = "";
    chatBox.innerHTML += `
                <div class="text-right">
                    <span class="inline-block bg-brand-500 text-white px-3 py-2 rounded-2xl rounded-tr-sm text-sm shadow-md">${message}</span>
                </div>`;

    const botMsgDiv = document.createElement('div');
    botMsgDiv.className = "text-left";
    botMsgDiv.innerHTML = `<span class="inline-block bg-white dark:bg-slate-800 px-3 py-2 rounded-2xl rounded-tl-sm text-sm shadow-sm animate-pulse">Consulting expert...</span>`;
    chatBox.appendChild(botMsgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    const reply = await geminiFetch(`Context: Analyzing a UI image. Question: ${message}`, currentImage);
    botMsgDiv.innerHTML = `<div class="inline-block bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm text-sm shadow-sm border border-slate-100 dark:border-slate-700 prose dark:prose-invert max-w-[90%]">${marked.parse(reply)}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
}

function runDemo() {
    const mockImg = "https://img.freepik.com/free-vector/gradient-ui-ux-landing-page_52683-70955.jpg?semt=ais_user_personalization&w=740&q=80";
    currentImage = mockImg;
    const mockData = {
        score: 58,
        roast: "This design is so safe it's actually dangerous. It's the visual equivalent of lukewarm water.",
        fixes: [
            {
                issue: "Vague Call to Action",
                solution: "The 'Submit' button is boring. Use action-oriented language and increase visual weight.",
                html_fix: '<button class="bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95">\n  Get Started Now →\n</button>'
            },
            {
                issue: "Wall of Text",
                solution: "Break up your content. Use white space and icons to create a scannable rhythm.",
                html_fix: '<div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">\n  <div class="p-4 border rounded-xl hover:shadow-md transition-shadow">\n    <h4 class="font-bold text-brand-600">Feature One</h4>\n    <p class="text-slate-500 text-sm">Concise description that respects the user\'s time.</p>\n  </div>\n</div>'
            }
        ]
    };
    showResults(mockImg, mockData);
}

lucide.createIcons();