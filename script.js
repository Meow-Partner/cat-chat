// ========== script.js · 完全修复版 ==========
// import { LocalNotifications } from '@capacitor/local-notifications';

const LocalNotifications = {
    schedule: async () => { console.log('[模拟] 通知已发送'); }
};

document.addEventListener('DOMContentLoaded', function() {

    const chatPage = document.getElementById('chat-page');
    const leisurePage = document.getElementById('leisure-page');
    const managePage = document.getElementById('manage-page');
    
    function showChatPage() {
        if (chatPage) chatPage.classList.add('active');
        if (leisurePage) leisurePage.classList.remove('active');
        if (managePage) managePage.classList.remove('active');
    }
    
    function showLeisurePage() {
        if (chatPage) chatPage.classList.remove('active');
        if (leisurePage) leisurePage.classList.add('active');
        if (managePage) managePage.classList.remove('active');
    }
    
    function showManagePage() {
        if (chatPage) chatPage.classList.remove('active');
        if (leisurePage) leisurePage.classList.remove('active');
        if (managePage) managePage.classList.add('active');
    }
    
    const starMenuBtn = document.getElementById('starMenuBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const leisureBubbleBtn = document.getElementById('leisureBubbleBtn');
    
    if (starMenuBtn) starMenuBtn.onclick = showManagePage;
    if (settingsBtn) settingsBtn.onclick = showManagePage;
    if (leisureBubbleBtn) leisureBubbleBtn.onclick = showLeisurePage;
    
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
    
    showChatPage();
    console.log('✅ 完全修复版已加载');
});
