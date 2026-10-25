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

        // ২. শুধু নিচের টাকার বাটনগুলো খোঁজা (Total amount এর ঠিক উপরে)
        setTimeout(() => {
            let amtBtn = null;
            const totalAmtText = document.querySelector('div, span, button');
            
            // ওয়েবসাইটের নিচের বাটনগুলো যেখানে 'Total amount' লেখা আছে তার আশেপাশে খুঁজবো
            const allElements = Array.from(document.querySelectorAll('div, span, button'));
            
            // যেসব এলিমেন্টে Total amount লেখা আছে, সেগুলোর আগের এলিমেন্টগুলো চেক করবো
            for (let i = 0; i < allElements.length; i++) {
                let el = allElements[i];
                let txt = el.innerText ? el.innerText.trim() : '';
                if (txt.includes('Total amount')) {
                    // এর আশেপাশের ২০টা এলিমেন্টের মধ্যে activeAmount খুঁজবো
                    for (let j = Math.max(0, i - 20); j < i; j++) {
                        let targetEl = allElements[j];
                        if (targetEl.innerText && targetEl.innerText.trim() === activeAmount && targetEl.offsetParent !== null) {
                            amtBtn = targetEl;
                            break;
                        }
                    }
                    if (amtBtn) break;
                }
            }

            if(amtBtn) {
                amtBtn.click();
                status.innerText = `Amount: ${activeAmount}`;
                
                // ৩. Total amount বাটনে ক্লিক করা
                setTimeout(() => {
                    for (let el of allElements) {
                        if (el.innerText && el.innerText.toUpperCase().includes('TOTAL AMOUNT') && el.offsetParent !== null) {
                            el.click();
                            status.innerText = "✅ TRADE SUCCESSFUL!";
                            status.style.color = "#00ff88";
                            break;
                        }
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
