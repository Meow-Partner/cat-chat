// ========== script.js · 2026-06-08 19:00:00 ==========
window.CatChat = window.CatChat || {};

// 页面切换函数
window.CatChat.showChatPage = function() {
    const pages = ['chat-page', 'leisure-page', 'his-space-page', 'my-space-page'];
    pages.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
    });
    const chatPage = document.getElementById('chat-page');
    if (chatPage) chatPage.classList.add('active');
    console.log('切换到聊天页');
};

window.CatChat.showLeisurePage = function() {
    const pages = ['chat-page', 'leisure-page', 'his-space-page', 'my-space-page'];
    pages.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
    });
    const leisurePage = document.getElementById('leisure-page');
    if (leisurePage) leisurePage.classList.add('active');
    console.log('切换到休闲页');
};

window.CatChat.showHisSpace = function() {
    const pages = ['chat-page', 'leisure-page', 'his-space-page', 'my-space-page'];
    pages.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
    });
    const hisSpace = document.getElementById('his-space-page');
    if (hisSpace) hisSpace.classList.add('active');
    console.log('切换到他的空间');
};

window.CatChat.showMySpace = function() {
    const pages = ['chat-page', 'leisure-page', 'his-space-page', 'my-space-page'];
    pages.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
    });
    const mySpace = document.getElementById('my-space-page');
    if (mySpace) mySpace.classList.add('active');
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
    
    // 底部输入栏
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
                if (window.CatChat.chat && window.CatChat.chat.addMessage) {
                    window.CatChat.chat.addMessage(text, true);
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
            if (window.CatChat.chat && window.CatChat.chat.addMessage) {
                window.CatChat.chat.addMessage(msg, true);
            }
        };
    }
    
    if (emojiBtn) {
        emojiBtn.onclick = () => {
            if (window.CatChat.chat && window.CatChat.chat.addMessage) {
                window.CatChat.chat.addMessage('😊', true);
            }
        };
    }
    
    if (fileInput) {
        fileInput.onchange = (e) => {
            const files = e.target.files;
            for (let file of files) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    if (window.CatChat.chat && window.CatChat.chat.addMessage) {
                        if (file.type.startsWith('image/')) {
                            window.CatChat.chat.addMessage("", true, ev.target.result);
                        } else {
                            window.CatChat.chat.addMessage('[文件] ' + file.name, true);
                        }
                    }
                };
                reader.readAsDataURL(file);
            }
            fileInput.value = '';
        };
    }
    
    // 他的空间 - 保存个人设置
    const saveHisSettingsBtn = document.getElementById('saveHisSettingsBtn');
    if (saveHisSettingsBtn) {
        saveHisSettingsBtn.onclick = () => {
            const partnerNote = document.getElementById('partnerNoteInput')?.value || '沈星回';
            const partnerSignature = document.getElementById('partnerSignatureInput')?.value || '';
            localStorage.setItem('partnerNote', partnerNote);
            localStorage.setItem('partnerSignature', partnerSignature);
            const partnerNameSpan = document.getElementById('partnerName');
            if (partnerNameSpan) partnerNameSpan.innerText = partnerNote;
            alert('保存成功');
        };
        const savedNote = localStorage.getItem('partnerNote') || '沈星回';
        const savedSignature = localStorage.getItem('partnerSignature') || '';
        if (document.getElementById('partnerNoteInput')) document.getElementById('partnerNoteInput').value = savedNote;
        if (document.getElementById('partnerSignatureInput')) document.getElementById('partnerSignatureInput').value = savedSignature;
    }
    
    // 我的空间 - 保存个人设置
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    if (saveProfileBtn) {
        saveProfileBtn.onclick = () => {
            const myName = document.getElementById('myNameInput')?.value || '我';
            const myNickname = document.getElementById('myNicknameInput')?.value || '';
            const mySignature = document.getElementById('mySignatureInput')?.value || '';
            localStorage.setItem('myName', myName);
            localStorage.setItem('myNickname', myNickname);
            localStorage.setItem('mySignature', mySignature);
            const myNameSpan = document.getElementById('myNickname');
            if (myNameSpan) myNameSpan.innerText = myName;
            alert('保存成功');
        };
        const savedName = localStorage.getItem('myName') || '我';
        const savedNickname = localStorage.getItem('myNickname') || '';
        const savedSignature = localStorage.getItem('mySignature') || '';
        if (document.getElementById('myNameInput')) document.getElementById('myNameInput').value = savedName;
        if (document.getElementById('myNicknameInput')) document.getElementById('myNicknameInput').value = savedNickname;
        if (document.getElementById('mySignatureInput')) document.getElementById('mySignatureInput').value = savedSignature;
        const myNameSpan = document.getElementById('myNickname');
        if (myNameSpan) myNameSpan.innerText = savedName;
    }
    
    // 字卡相关按钮（占位）
    const addGroupBtn = document.getElementById('addGroupBtn');
    const updateCardsBtn = document.getElementById('updateCardsBtn');
    const addMultiLineBtn = document.getElementById('addMultiLineBtn');
    const clearTextareaBtn = document.getElementById('clearTextareaBtn');
    const saveReplySettings = document.getElementById('saveReplySettings');
    
    if (addGroupBtn) addGroupBtn.onclick = () => alert('新建分组功能开发中');
    if (updateCardsBtn) updateCardsBtn.onclick = () => alert('从 GitHub 更新字卡功能开发中');
    if (addMultiLineBtn) addMultiLineBtn.onclick = () => alert('批量添加功能开发中');
    if (clearTextareaBtn) clearTextareaBtn.onclick = () => {
        const ta = document.getElementById('cardBulkInput');
        if (ta) ta.value = '';
        alert('已清空');
    };
    if (saveReplySettings) saveReplySettings.onclick = () => alert('保存设置功能开发中');
    
    // 数据管理按钮
    const importDataBtn = document.getElementById('importDataBtn');
    const exportDataBtn = document.getElementById('exportFullData');
    const clearAllChats = document.getElementById('clearAllChats');
    const resetAllData = document.getElementById('resetAllData');
    
    if (importDataBtn) importDataBtn.onclick = () => alert('导入数据功能开发中');
    if (exportDataBtn) exportDataBtn.onclick = () => alert('导出数据功能开发中');
    if (clearAllChats) clearAllChats.onclick = () => {
        if (confirm('清空所有聊天记录？')) {
            if (window.CatChat.chat) window.CatChat.chat.messages = [];
            alert('聊天记录已清空');
        }
    };
    if (resetAllData) resetAllData.onclick = () => {
        if (confirm('恢复出厂设置？所有数据将丢失！')) {
            localStorage.clear();
            location.reload();
        }
    };
    
    window.CatChat.showChatPage();
    console.log('✅ script.js 已加载');
});
