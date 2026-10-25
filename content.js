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

        // ২. শুধু নিচের টাকার বাটনগুলো খোঁজা (Quantity এর নিচে)
        setTimeout(() => {
            // "Balance" লেখাটা খুঁজে বের করবো, যাতে তার নিচের বাটনগুলো ফিল্টার করা যায়
            const allElements = Array.from(document.querySelectorAll('div, span, button'));
            let balanceIndex = -1;
            
            // Balance এর পজিশন বের করা
            for (let i = 0; i < allElements.length; i++) {
                if (allElements[i].innerText && allElements[i].innerText.trim() === 'Balance') {
                    balanceIndex = i;
                    break;
                }
            }

            let amtBtn = null;
            if (balanceIndex !== -1) {
                // Balance এর পরে যেসব এলিমেন্ট আছে, সেগুলোর মধ্যে activeAmount খুঁজবো
                for (let i = balanceIndex; i < allElements.length; i++) {
                    let el = allElements[i];
                    if (el.innerText && el.innerText.trim() === activeAmount && el.offsetParent !== null) {
                        // চেক করবো এটা সত্যিই নিচের বাটন কিনা
                        amtBtn = el;
                        break; // প্রথম যেটা পাবে সেটাই নিবে (যেটা Quantity এর নিচে)
                    }
                }
            }

            if(amtBtn) {
                amtBtn.click();
                status.innerText = `Amount: ${activeAmount} Selected`;
                
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
