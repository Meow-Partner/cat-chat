// ========== script.js · 2026-06-08 15:45:00 ==========
// 初始化命名空间
window.CatChat = window.CatChat || {};

// 挂载页面切换函数到命名空间（供其他模块使用）
window.CatChat.showChatPage = function() {
    const chatPage = document.getElementById('chat-page');
    const leisurePage = document.getElementById('leisure-page');
    const hisSpacePage = document.getElementById('his-space-page');
    const mySpacePage = document.getElementById('my-space-page');
    
    if (chatPage) chatPage.classList.add('active');
    if (leisurePage) leisurePage.classList.remove('active');
    if (hisSpacePage) hisSpacePage.classList.remove('active');
    if (mySpacePage) mySpacePage.classList.remove('active');
    console.log('切换到聊天页');
};

window.CatChat.showLeisurePage = function() {
    const chatPage = document.getElementById('chat-page');
    const leisurePage = document.getElementById('leisure-page');
    const hisSpacePage = document.getElementById('his-space-page');
    const mySpacePage = document.getElementById('my-space-page');
    
    if (chatPage) chatPage.classList.remove('active');
    if (leisurePage) leisurePage.classList.add('active');
    if (hisSpacePage) hisSpacePage.classList.remove('active');
    if (mySpacePage) mySpacePage.classList.remove('active');
    console.log('切换到休闲页');
};

window.CatChat.showHisSpace = function() {
    const chatPage = document.getElementById('chat-page');
    const leisurePage = document.getElementById('leisure-page');
    const hisSpacePage = document.getElementById('his-space-page');
    const mySpacePage = document.getElementById('my-space-page');
    
    if (chatPage) chatPage.classList.remove('active');
    if (leisurePage) leisurePage.classList.remove('active');
    if (hisSpacePage) hisSpacePage.classList.add('active');
    if (mySpacePage) mySpacePage.classList.remove('active');
    console.log('切换到他的空间');
};

window.CatChat.showMySpace = function() {
    const chatPage = document.getElementById('chat-page');
    const leisurePage = document.getElementById('leisure-page');
    const hisSpacePage = document.getElementById('his-space-page');
    const mySpacePage = document.getElementById('my-space-page');
    
    if (chatPage) chatPage.classList.remove('active');
    if (leisurePage) leisurePage.classList.remove('active');
    if (hisSpacePage) hisSpacePage.classList.remove('active');
    if (mySpacePage) mySpacePage.classList.add('active');
    console.log('切换到我的空间');
};

document.addEventListener('DOMContentLoaded', function() {

    // 顶部栏按钮绑定（使用命名空间中的函数）
    const starSpaceBtn = document.getElementById('starSpaceBtn');
    const mySpaceBtn = document.getElementById('mySpaceBtn');
    const leisureBubbleBtn = document.getElementById('leisureBubbleBtn');
    
    if (starSpaceBtn) starSpaceBtn.onclick = window.CatChat.showHisSpace;
    if (mySpaceBtn) mySpaceBtn.onclick = window.CatChat.showMySpace;
    if (leisureBubbleBtn) leisureBubbleBtn.onclick = window.CatChat.showLeisurePage;
    
    // 底部输入栏逻辑
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
                if (typeof window.CatChat.addMessage === 'function') {
                    window.CatChat.addMessage(text, true);
                } else if (typeof addMessage === 'function') {
                    addMessage(text, true);
                }
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
            const msg = '🎲 我掷出了 ' + result + ' 点';
            if (typeof window.CatChat.addMessage === 'function') {
                window.CatChat.addMessage(msg, true);
            } else if (typeof addMessage === 'function') {
                addMessage(msg, true);
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
                    if (typeof window.CatChat.addMessage === 'function') {
                        if (file.type.startsWith('image/')) {
                            window.CatChat.addMessage("", true, ev.target.result);
                        } else {
                            window.CatChat.addMessage('[文件] ' + file.name, true);
                        }
                    }
                };
                reader.readAsDataURL(file);
            }
            fileInput.value = '';
        };
    }
    
    // 示例按钮（全部 alert）
    const demoBtns = document.querySelectorAll('.demo-btn');
    demoBtns.forEach(btn => {
        btn.onclick = () => {
            alert(`功能开发中：${btn.textContent}`);
        };
    });
    
    // 默认显示聊天页
    window.CatChat.showChatPage();
    
    console.log('✅ script.js 已加载，所有功能已绑定');
});
