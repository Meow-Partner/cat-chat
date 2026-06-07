// ========== script.js · 手机优化完整版 ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('脚本已加载');

    // 页面切换
    const chatPage = document.getElementById('chat-page');
    const leisurePage = document.getElementById('leisure-page');
    const managePage = document.getElementById('manage-page');
    
    function showChat() {
        if (chatPage) chatPage.classList.add('active');
        if (leisurePage) leisurePage.classList.remove('active');
        if (managePage) managePage.classList.remove('active');
    }
    function showLeisure() {
        if (chatPage) chatPage.classList.remove('active');
        if (leisurePage) leisurePage.classList.add('active');
        if (managePage) managePage.classList.remove('active');
        if (typeof triggerInvite === 'function') {
            setTimeout(() => {
                if (typeof inviteCount !== 'undefined' && inviteCount < 2 && typeof inviteTimer !== 'undefined' && !inviteTimer && typeof isLeisureInterrupted !== 'undefined' && !isLeisureInterrupted) {
                    triggerInvite(true);
                }
            }, 500);
        }
    }
    function showManage() {
        if (chatPage) chatPage.classList.remove('active');
        if (leisurePage) leisurePage.classList.remove('active');
        if (managePage) managePage.classList.add('active');
    }
    
    // 顶部栏按钮
    const starMenuBtn = document.getElementById('starMenuBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const leisureBubbleBtn = document.getElementById('leisureBubbleBtn');
    const backToChatBtn = document.getElementById('backToChatBtn');
    if (starMenuBtn) starMenuBtn.onclick = showManage;
    if (settingsBtn) settingsBtn.onclick = showManage;
    if (leisureBubbleBtn) leisureBubbleBtn.onclick = showLeisure;
    if (backToChatBtn) backToChatBtn.onclick = showChat;
    
    // ========== 底部输入栏（手机优化版） ==========
    const msgInput = document.getElementById('msgInput');
    const actionBtn = document.getElementById('actionBtn');
    const fileInput = document.getElementById('fileInput');
    const diceBtn = document.getElementById('diceBtn');
    const emojiBtn = document.getElementById('openEmojiBtn');
    const stickerBtn1 = document.getElementById('openStickerBtn1');
    const stickerBtn2 = document.getElementById('openStickerBtn2');
    
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
        // 监听各种输入事件（兼容手机）
        msgInput.addEventListener('input', updateActionButton);
        msgInput.addEventListener('change', updateActionButton);
        msgInput.addEventListener('blur', updateActionButton);
        
        // 按钮点击逻辑
        actionBtn.onclick = () => {
            updateActionButton(); // 点击时再检查一次
            const hasText = msgInput.value.trim().length > 0;
            if (hasText) {
                if (typeof addMessage === 'function') {
                    addMessage(msgInput.value.trim(), true);
                    msgInput.value = '';
                    updateActionButton();
                } else {
                    alert('发送: ' + msgInput.value);
                    msgInput.value = '';
                    updateActionButton();
                }
            } else if (fileInput) {
                fileInput.click();
            }
        };
        updateActionButton(); // 初始化
    }
    
    // 骰子
    if (diceBtn) {
        diceBtn.onclick = () => {
            const result = Math.floor(Math.random() * 6) + 1;
            if (typeof addMessage === 'function') {
                addMessage('🎲 我掷出了 ' + result + ' 点', true);
            } else {
                alert('🎲 骰子点数: ' + result);
            }
        };
    }
    
    // 表情按钮（兼容原有函数）
    if (emojiBtn) {
        emojiBtn.onclick = () => {
            if (typeof showStickerModal === 'function') {
                showStickerModal(commonEmojis, '通用表情', true);
            } else {
                alert('😊 表情功能待完善');
            }
        };
    }
    if (stickerBtn1 && typeof showStickerModal === 'function') {
        stickerBtn1.onclick = () => showStickerModal(catStickers1, '猫猫搭档1', false);
    }
    if (stickerBtn2 && typeof showStickerModal === 'function') {
        stickerBtn2.onclick = () => showStickerModal(catStickers2, '猫猫搭档2', false);
    }
    
    // 文件上传
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
    
    // 加载字卡和聊天记录
    if (typeof loadAllData === 'function') {
        loadAllData();
        console.log('✅ 字卡和聊天记录已加载');
    } else {
        console.log('⚠️ loadAllData 未定义');
    }
    
    // 默认显示聊天页
    showChat();
    
    console.log('✅ 手机优化版加载完成');
});        if (leisurePage) leisurePage.classList.remove('active');
        if (managePage) managePage.classList.add('active');
        console.log('切换到设置页');
    }
    
    // 绑定顶部栏按钮
    if (starBtn) { starBtn.onclick = () => showManage(); console.log('字卡按钮已绑定'); }
    if (settingsBtn) { settingsBtn.onclick = () => showManage(); console.log('设置按钮已绑定'); }
    if (leisureBtn) { leisureBtn.onclick = () => showLeisure(); console.log('泡泡按钮已绑定'); }
    if (backBtn) { backBtn.onclick = () => showChat(); console.log('星星按钮已绑定'); }
    
    // 绑定底部按钮（暂时只弹 alert）
    if (diceBtn) { diceBtn.onclick = () => alert('骰子被点击'); console.log('骰子按钮已绑定'); }
    if (emojiBtn) { emojiBtn.onclick = () => alert('表情被点击'); console.log('表情按钮已绑定'); }
    if (actionBtn) { 
        actionBtn.onclick = () => {
            if (msgInput && msgInput.value.trim()) {
                alert('发送: ' + msgInput.value.trim());
                msgInput.value = '';
            } else {
                alert('加号被点击');
            }
        };
        console.log('加号/发送按钮已绑定');
    }
    
    // 确保聊天页默认显示
    showChat();
    
    console.log('✅ 所有按钮绑定完成，请测试');
});
