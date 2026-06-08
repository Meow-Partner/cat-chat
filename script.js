// ========== script.js · 2026-06-08 17:30:00 ==========
window.CatChat = window.CatChat || {};

// 页面切换函数
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
    // 顶部栏按钮
    const starSpaceBtn = document.getElementById('starSpaceBtn');
    const mySpaceBtn = document.getElementById('mySpaceBtn');
    const leisureBubbleBtn = document.getElementById('leisureBubbleBtn');
    
    if (starSpaceBtn) starSpaceBtn.onclick = window.CatChat.showHisSpace;
    if (mySpaceBtn) mySpaceBtn.onclick = window.CatChat.showMySpace;
    
    // 泡泡：单击聊天，双击休闲
    if (leisureBubbleBtn) {
        let clickTimer = null;
        leisureBubbleBtn.onclick = function() {
            if (clickTimer) {
                clearTimeout(clickTimer);
                clickTimer = null;
                window.CatChat.showLeisurePage();
            } else {
                clickTimer = setTimeout(function() {
                    window.CatChat.showChatPage();
                    clickTimer = null;
                }, 200);
            }
        };
    }
    
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
    
    // 绑定原有功能按钮（他的空间）
    const addGroupBtn = document.getElementById('addGroupBtn');
    const updateCardsBtn = document.getElementById('updateCardsBtn');
    const addMultiLineBtn = document.getElementById('addMultiLineBtn');
    const clearTextareaBtn = document.getElementById('clearTextareaBtn');
    const saveReplySettings = document.getElementById('saveReplySettings');
    
    if (addGroupBtn && window.CatChat.card) addGroupBtn.onclick = () => window.CatChat.card.addGroup();
    if (updateCardsBtn) updateCardsBtn.onclick = () => alert('从 GitHub 更新字卡功能开发中');
    if (addMultiLineBtn) addMultiLineBtn.onclick = () => alert('批量添加功能开发中');
    if (clearTextareaBtn) clearTextareaBtn.onclick = () => {
        const ta = document.getElementById('cardBulkInput');
        if (ta) ta.value = '';
        alert('已清空');
    };
    if (saveReplySettings) saveReplySettings.onclick = () => alert('保存设置功能开发中');
    
    // 绑定原有功能按钮（我的空间）
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const importDataBtn = document.getElementById('importDataBtn');
    const exportDataBtn = document.getElementById('exportFullData');
    const clearChatsBtn = document.getElementById('clearAllChats');
    const resetAllBtn = document.getElementById('resetAllData');
    
    if (saveProfileBtn) saveProfileBtn.onclick = () => alert('保存设置功能开发中');
    if (importDataBtn) importDataBtn.onclick = () => alert('导入数据功能开发中');
    if (exportDataBtn) exportDataBtn.onclick = () => alert('导出数据功能开发中');
    if (clearChatsBtn) clearChatsBtn.onclick = () => {
        if (confirm('清空所有聊天记录？')) {
            if (window.CatChat.chat) window.CatChat.chat.clearMessages();
            alert('聊天记录已清空');
        }
    };
    if (resetAllBtn) resetAllBtn.onclick = () => {
        if (confirm('恢复出厂设置？所有数据将丢失！')) {
            localStorage.clear();
            location.reload();
        }
    };
    
    window.CatChat.showChatPage();
    console.log('✅ script.js 已加载');
});
