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

        // ২. টাকার পরিমাণ সিলেক্ট করা (শুধু নিচের গুলোর মধ্যে)
        setTimeout(() => {
            // নিচের বাটনগুলো খোঁজা (X1, X5 এর লাইনে)
            const bottomButtons = Array.from(document.querySelectorAll('div, span')).filter(el => {
                // শুধু নিচের বাটনগুলো ফিল্টার করা (যেগুলোতে 1, 10, 20, 50, 100 লেখা আছে)
                const txt = el.innerText ? el.innerText.trim() : '';
                return txt === activeAmount && el.offsetParent !== null;
            });

            // যদি একাধিক পাওয়া যায়, তবে শেষেরটা নিবে (যেটা নিচে থাকে)
            let amtBtn = bottomButtons.length > 0 ? bottomButtons[bottomButtons.length - 1] : null;

            if(amtBtn) {
                amtBtn.click();
                status.innerText = `Amount: ${activeAmount}`;
                
                // ৩. কনফার্ম বাটনে ক্লিক করা (Total amount)
                setTimeout(() => {
                    // নিচের "Total amount" লেখা বাটন খোঁজা
                    const confirmBtns = Array.from(document.querySelectorAll('div, button, span')).filter(el => {
                        const txt = el.innerText ? el.innerText.toUpperCase() : '';
                        return txt.includes('TOTAL AMOUNT') && el.offsetParent !== null;
                    });

                    if(confirmBtns.length > 0) {
                        // শেষের বাটনে ক্লিক করবে (যেটা নিচে থাকে)
                        confirmBtns[confirmBtns.length - 1].click();
                        status.innerText = "✅ TRADE SUCCESSFUL!";
                        status.style.color = "#00ff88";
                    } else {
                        status.innerText = "❌ Confirm btn not found";
                    }
                }, 1000);
            } else {
                status.innerText = "❌ Amount btn not found";
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
