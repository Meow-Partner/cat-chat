// ========== script.js · 第一阶段修复版 ==========
// import { LocalNotifications } from '@capacitor/local-notifications';  // 打包APK时再取消注释

const LocalNotifications = {
    schedule: async () => { console.log('[模拟] 通知已发送'); }
};

document.addEventListener('DOMContentLoaded', function() {

    // ========== 页面切换 ==========
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
        if (typeof triggerInvite === 'function') {
            setTimeout(() => {
                if (typeof inviteCount !== 'undefined' && inviteCount < 2 && typeof inviteTimer !== 'undefined' && !inviteTimer && typeof isLeisureInterrupted !== 'undefined' && !isLeisureInterrupted) {
                    triggerInvite(true);
                }
            }, 500);
        }
    }
    
    function showManagePage() {
        if (chatPage) chatPage.classList.remove('active');
        if (leisurePage) leisurePage.classList.remove('active');
        if (managePage) managePage.classList.add('active');
    }
    
    // ========== 顶部栏按钮 ==========
    const starMenuBtn = document.getElementById('starMenuBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const leisureBubbleBtn = document.getElementById('leisureBubbleBtn');
    const backToChatBtn = document.getElementById('backToChatBtn');
    
    if (starMenuBtn) {
        starMenuBtn.onclick = () => {
            showManagePage();
            setTimeout(() => {
                const groups = document.getElementById('groupsContainer');
                if (groups) groups.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        };
    }
    if (settingsBtn) settingsBtn.onclick = showManagePage;
    if (leisureBubbleBtn) leisureBubbleBtn.onclick = showLeisurePage;
    if (backToChatBtn) backToChatBtn.onclick = showChatPage;
    
    // ========== 底部输入栏 ==========
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
        msgInput.addEventListener('change', updateActionButton);
        msgInput.addEventListener('blur', updateActionButton);
        
        actionBtn.onclick = () => {
            updateActionButton();
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
    
    // 加载数据
    if (typeof loadAllData === 'function') {
        loadAllData();
    }
    
    // 默认显示聊天页
    showChatPage();
    
    // 半小时随机拍拍（模拟）
    function getRandomTimeInNextHalfHour() {
        const now = new Date();
        const minutes = now.getMinutes();
        let nextSlotStart = new Date(now);
        if (minutes < 30) nextSlotStart.setMinutes(30, 0, 0);
        else nextSlotStart.setHours(now.getHours() + 1, 0, 0, 0);
        const nextSlotEnd = new Date(nextSlotStart);
        nextSlotEnd.setMinutes(nextSlotStart.getMinutes() + 30);
        return new Date(nextSlotStart.getTime() + Math.random() * (nextSlotEnd.getTime() - nextSlotStart.getTime()));
    }
    
    async function scheduleRandomPat() {
        const triggerTime = getRandomTimeInNextHalfHour();
        const delayMs = triggerTime.getTime() - Date.now();
        if (delayMs < 0) return;
        console.log(`[拍拍] 下次将在 ${triggerTime.toLocaleTimeString()} 发送`);
        setTimeout(async () => {
            try {
                await LocalNotifications.schedule({
                    notifications: [{ title: '⭐️ 拍了拍你', body: '', id: Date.now(), schedule: { at: new Date() }, sound: null }]
                });
                console.log('[拍拍] ✅ 真实通知已发送');
            } catch (err) {
                console.log('[拍拍] 当前环境不支持通知');
            }
            scheduleRandomPat();
        }, delayMs);
    }
    
    scheduleRandomPat();
    
    console.log('✅ 第一阶段修复版已加载');
});    const backToChatBtn = document.getElementById('backToChatBtn');
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
        msgInput.addEventListener('input', updateActionButton);
        msgInput.addEventListener('change', updateActionButton);
        msgInput.addEventListener('blur', updateActionButton);
        msgInput.addEventListener('keyup', updateActionButton);
        
        actionBtn.onclick = () => {
            updateActionButton();
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
        updateActionButton();
    }
    
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
    console.log('✅ 手机优化版已启动，输入文字后加号应变为发送');
});
