// ========== script.js · 2026-06-08 14:50:00 ==========
// import { LocalNotifications } from '@capacitor/local-notifications';

const LocalNotifications = {
    schedule: async () => { console.log('[模拟] 通知已发送'); }
};

document.addEventListener('DOMContentLoaded', function() {

    const chatPage = document.getElementById('chat-page');
    const leisurePage = document.getElementById('leisure-page');
    const hisSpacePage = document.getElementById('his-space-page');
    const mySpacePage = document.getElementById('my-space-page');
    
    function showChat() {
        chatPage.classList.add('active');
        leisurePage.classList.remove('active');
        hisSpacePage.classList.remove('active');
        mySpacePage.classList.remove('active');
    }
    
    function showLeisure() {
        chatPage.classList.remove('active');
        leisurePage.classList.add('active');
        hisSpacePage.classList.remove('active');
        mySpacePage.classList.remove('active');
    }
    
    function showHisSpace() {
        chatPage.classList.remove('active');
        leisurePage.classList.remove('active');
        hisSpacePage.classList.add('active');
        mySpacePage.classList.remove('active');
    }
    
    function showMySpace() {
        chatPage.classList.remove('active');
        leisurePage.classList.remove('active');
        hisSpacePage.classList.remove('active');
        mySpacePage.classList.add('active');
    }
    
    document.getElementById('starSpaceBtn').onclick = showHisSpace;
    document.getElementById('mySpaceBtn').onclick = showMySpace;
    document.getElementById('leisureBubbleBtn').onclick = showLeisure;
    
    const demoBtns = document.querySelectorAll('.demo-btn');
    demoBtns.forEach(btn => {
        btn.onclick = () => {
            alert(`功能开发中：${btn.textContent}`);
        };
    });
    
    const msgInput = document.getElementById('msgInput');
    const actionBtn = document.getElementById('actionBtn');
    const fileInput = document.getElementById('fileInput');
    const diceBtn = document.getElementById('diceBtn');
    const emojiBtn = document.getElementById('openEmojiBtn');
    
    function updateActionButton() {
        if (!msgInput || !actionBtn) return;
        const hasText = msgInput.value.trim().length > 0;
        if (hasText) {
            actionBtn.textContent = '发送';
            actionBtn.classList.add('send-mode');
            actionBtn.classList.remove('plus-mode');
        } else {
            actionBtn.textContent = '➕';
            actionBtn.classList.remove('send-mode');
            actionBtn.classList.add('plus-mode');
        }
    }
    
    if (msgInput && actionBtn) {
        msgInput.addEventListener('input', updateActionButton);
        updateActionButton();
        actionBtn.onclick = () => {
            const hasText = msgInput.value.trim().length > 0;
            if (hasText) {
                const text = msgInput.value.trim();
                if (typeof addMessage === 'function') addMessage(text, true);
                msgInput.value = '';
                updateActionButton();
            } else if (fileInput) {
                fileInput.click();
            }
        };
    }
    
    if (diceBtn) {
        diceBtn.onclick = () => {
            const result = Math.floor(Math.random() * 6) + 1;
            if (typeof addMessage === 'function') {
                addMessage('🎲 我掷出了 ' + result + ' 点', true);
            }
        };
    }
    
    if (emojiBtn) {
        emojiBtn.onclick = () => {
            if (typeof showStickerModal === 'function') {
                showStickerModal(commonEmojis, '通用表情', true);
            } else {
                alert('😊 表情');
            }
        };
    }
    
    if (fileInput) {
        fileInput.onchange = (e) => {
            const files = e.target.files;
            for (let file of files) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    if (typeof addMessage === 'function') {
                        if (file.type.startsWith('image/')) {
                            addMessage("", true, ev.target.result);
                        } else {
                            addMessage('[文件] ' + file.name, true);
                        }
                    }
                };
                reader.readAsDataURL(file);
            }
            fileInput.value = '';
        };
    }
    
    if (typeof loadAllData === 'function') {
        loadAllData();
    }
    
    showChat();
    console.log('✅ 2026-06-08 14:50:00 已加载');
});
