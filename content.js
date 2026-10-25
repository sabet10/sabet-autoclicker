// ==========================================
// SABET AUTO TRADER - CONTENT SCRIPT (UPDATED)
// ==========================================

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

    const amountBtns = document.querySelectorAll('#sabet-amounts button');
    amountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            amountBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    document.getElementById('sabet-start-btn').addEventListener('click', startAutoTrade);
}

let isScanning = false;

function startAutoTrade() {
    if (isScanning) return;
    isScanning = true;

    const btn = document.getElementById('sabet-start-btn');
    const status = document.getElementById('sabet-status');
    
    btn.classList.add('scanning');
    status.innerText = "Scanning 5s...";
    status.style.color = "#ffd700";

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

// টেক্সট দিয়ে বাটন খোঁজার ফাংশন
function findButtonByText(text) {
    const elements = document.querySelectorAll('div, button, span');
    for (let el of elements) {
        if (el.innerText && el.innerText.trim().toUpperCase() === text.toUpperCase()) {
            // চেক করবো এটা ক্লিকেবল কিনা
            if (el.offsetParent !== null) return el;
        }
    }
    return null;
}

function executeTrade() {
    const status = document.getElementById('sabet-status');
    const activeAmount = document.querySelector('#sabet-amounts button.active').getAttribute('data-amount');
    
    const isBig = Math.random() > 0.5; 
    
    // ১. Big বা Small বাটনে ক্লিক
    const targetBtn = findButtonByText(isBig ? 'BIG' : 'SMALL');
    
    if (targetBtn) {
        targetBtn.click();
        status.innerText = `Clicked: ${isBig ? 'BIG' : 'SMALL'}`;
        status.style.color = "#00ffcc";

        // ২. টাকার পরিমাণ সিলেক্ট করা
        setTimeout(() => {
            const amtBtn = findButtonByText(activeAmount);
            if(amtBtn) {
                amtBtn.click();
                status.innerText = `Amount: ${activeAmount}`;
                
                // ৩. কনফার্ম বাটনে ক্লিক করা (Total Amount)
                setTimeout(() => {
                    const confirmBtn = findButtonByText('Total amount') || findButtonByText(`Total amount ৳${activeAmount}.00`);
                    if(confirmBtn) {
                        confirmBtn.click();
                        status.innerText = "✅ TRADE SUCCESSFUL!";
                        status.style.color = "#00ff88";
                    } else {
                        // যদি Total Amount না পায়, তবে Agree বক্সে ক্লিক করবে
                        const agreeBtn = document.querySelector('.agree-checkbox, input[type="checkbox"]');
                        if(agreeBtn) {
                            agreeBtn.click();
                            setTimeout(() => {
                                const finalConfirm = findButtonByText('Total amount');
                                if(finalConfirm) finalConfirm.click();
                            }, 500);
                        }
                        status.innerText = "Trying Confirm...";
                    }
                }, 1000);
            } else {
                status.innerText = "Amount button not found";
            }
        }, 1000);

    } else {
        status.innerText = "❌ Big/Small button not found!";
        status.style.color = "#ff4466";
    }

    const btn = document.getElementById('sabet-start-btn');
    btn.classList.remove('scanning');
    setTimeout(() => {
        isScanning = false;
        status.innerText = "Ready";
        status.style.color = "#aaa";
    }, 4000);
}

window.addEventListener('load', () => {
    setTimeout(createUI, 2000);
});
