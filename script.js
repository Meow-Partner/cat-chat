// ========== script.js · 最终手机优化版（输入框变发送） ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('手机优化版已加载');

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
    
    // ========== 底部输入栏（手机关键修复） ==========
    const msgInput = document.getElementById('msgInput');
    const actionBtn = document.getElementById('actionBtn');
    const fileInput = document.getElementById('fileInput');
    const diceBtn = document.getElementById('diceBtn');
    const emojiBtn = document.getElementById('openEmojiBtn');
    
    // 更新按钮文字和样式
    function updateActionButton() {
        if (!msgInput || !actionBtn) return;
        const hasText = msgInput.value.trim().length > 0;
        if (hasText) {
            actionBtn.textContent = '发送';
            actionBtn.classList.add('send-mode');
            actionBtn.classList.remove('plus-mode');
            console.log('按钮变为：发送');
        } else {
            actionBtn.textContent = '➕';
            actionBtn.classList.remove('send-mode');
            actionBtn.classList.add('plus-mode');
            console.log('按钮变为：加号');
        }
    }
    
    if (msgInput && actionBtn) {
        // 监听 input 事件（打字时）
        msgInput.addEventListener('input', updateActionButton);
        // 监听 change 事件（输入完成）
        msgInput.addEventListener('change', updateActionButton);
        // 监听 blur 事件（失去焦点）
        msgInput.addEventListener('blur', updateActionButton);
        // 监听 keyup 事件（按键抬起）
        msgInput.addEventListener('keyup', updateActionButton);
        
        // 按钮点击逻辑
        actionBtn.onclick = () => {
            updateActionButton(); // 确保状态最新
            const hasText = msgInput.value.trim().length > 0;
            if (hasText) {
                const text = msgInput.value.trim();
                if (typeof addMessage === 'function') {
                    addMessage(text, true);
                } else {
                    alert('发送: ' + text);
                }
                msgInput.value = '';
                updateActionButton();
            } else if (fileInput) {
                fileInput.click();
            }
        };
        
        // 初始化
        updateActionButton();
    }
    
    // 骰子
    if (diceBtn) {
        diceBtn.onclick = () => {
            const result = Math.floor(Math.random() * 6) + 1;
            if (typeof addMessage === 'function') {
                addMessage('🎲 我掷出了 ' + result + ' 点', true);
            } else {
                alert('骰子点数: ' + result);
            }
        };
    }
    
    // 表情按钮
    if (emojiBtn) {
        emojiBtn.onclick = () => {
            if (typeof showStickerModal === 'function') {
                showStickerModal(commonEmojis, '通用表情', true);
            } else {
                alert('😊 表情');
            }
        };
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
    
    // 加载字卡
    if (typeof loadAllData === 'function') {
        loadAllData();
    }
    
    showChat();
    console.log('✅ 手机优化版已启动，输入文字后加号应变为发送');
});
