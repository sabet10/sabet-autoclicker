// ==========================================
// SABET AUTO TRADER - CONTENT SCRIPT
// ==========================================

// --- 1. Create Floating UI ---
function createUI() {
    if (document.getElementById('sabet-auto-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'sabet-auto-panel';
    panel.innerHTML = `
        <h3>⚡ SABET AUTO ⚡</h3>
        <div class="sabet-amount-btns" id="sabet-amounts">
            <button data-amount="1">1</button>
            <button data-amount="10" class="active">10</button>
            <button data-amount="20">20</button>
            <button data-amount="50">50</button>
            <button data-amount="100">100</button>
        </div>
        <button id="sabet-start-btn">AUTO TRADE</button>
        <div class="sabet-status" id="sabet-status">Ready</div>
    `;
    document.body.appendChild(panel);

    // Event Listeners
    const amountBtns = document.querySelectorAll('#sabet-amounts button');
    amountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            amountBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    document.getElementById('sabet-start-btn').addEventListener('click', startAutoTrade);
}

// --- 2. Auto Trade Logic ---
let isScanning = false;

function startAutoTrade() {
    if (isScanning) return;
    isScanning = true;

    const btn = document.getElementById('sabet-start-btn');
    const status = document.getElementById('sabet-status');
    
    btn.classList.add('scanning');
    btn.innerText = "AUTO TRADE";
    status.innerText = "Scanning 5s...";
    status.style.color = "#ffd700";

    // 5 Second Scanning Animation
    let timeLeft = 5;
    const timer = setInterval(() => {
        timeLeft--;
        status.innerText = `Scanning: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            executeTrade();
        }
    }, 1000);
}

// --- 3. DOM Interaction (Clicking) ---
function executeTrade() {
    const status = document.getElementById('sabet-status');
    const activeAmount = document.querySelector('#sabet-amounts button.active').getAttribute('data-amount');
    
    // আপনার স্ট্র্যাটেজি এখানে (আপাতত র‍্যান্ডম BIG/SMALL)
    // আপনি চাইলে এখানে প্যাটার্ন লজিক বসাতে পারেন
    const isBig = Math.random() > 0.5; 
    
    // WinGo পেজের বাটন খোঁজা (Text বা Class দিয়ে)
    const buttons = Array.from(document.querySelectorAll('button, div'));
    
    // BIG/SMALL বাটন খোঁজার লজিক (আপনার সাইটের HTML অনুযায়ী পরিবর্তন হতে পারে)
    const targetBtn = buttons.find(b => {
        const txt = b.innerText.trim().toUpperCase();
        return isBig ? txt === 'BIG' : txt === 'SMALL';
    });

    if (targetBtn) {
        targetBtn.click();
        status.innerText = `Clicked: ${isBig ? 'BIG' : 'SMALL'}`;
        status.style.color = "#00ffcc";

        // টাকা সিলেক্ট করা
        setTimeout(() => {
            const amountBtns = Array.from(document.querySelectorAll('button, div'));
            const amtBtn = amountBtns.find(b => b.innerText.trim() === activeAmount);
            if(amtBtn) {
                amtBtn.click();
                status.innerText += ` | ${activeAmount} Selected`;
                
                // টোটাল এমাউন্ট কনফার্ম করা
                setTimeout(() => {
                    const confirmBtns = Array.from(document.querySelectorAll('button, div'));
                    const confBtn = confirmBtns.find(b => b.innerText.trim().toLowerCase().includes('total amount'));
                    if(confBtn) {
                        confBtn.click();
                        status.innerText = "✅ TRADE SUCCESSFUL!";
                        status.style.color = "#00ff88";
                    }
                }, 1000);
            }
        }, 1000);

    } else {
        status.innerText = "❌ Button not found!";
        status.style.color = "#ff4466";
    }

    // Reset Button
    const btn = document.getElementById('sabet-start-btn');
    btn.classList.remove('scanning');
    setTimeout(() => {
        isScanning = false;
        status.innerText = "Ready";
        status.style.color = "#aaa";
    }, 3000);
}

// --- 4. Initialize ---
window.addEventListener('load', () => {
    setTimeout(createUI, 2000); // পেজ লোড হওয়ার ২ সেকেন্ড পর UI দেখাবে
});
