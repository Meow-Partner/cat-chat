// ========== script.js · 最终版（无侧边栏，简化切换） ==========
// import { LocalNotifications } from '@capacitor/local-notifications';  // 打包APK时再取消注释

const LocalNotifications = {
    schedule: async () => { console.log('[模拟] 通知已发送'); }
};

document.addEventListener('DOMContentLoaded', function() {

    // 页面元素
    const chatPage = document.getElementById('chat-page');
    const leisurePage = document.getElementById('leisure-page');
    const managePage = document.getElementById('manage-page');
    
    const starMenuBtn = document.getElementById('starMenuBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const leisureBubbleBtn = document.getElementById('leisureBubbleBtn');
    
    // 显示聊天页面
    function showChatPage() {
        chatPage.classList.add('active');
        leisurePage.classList.remove('active');
        managePage.classList.remove('active');
    }
    
    // 显示休闲页面
    function showLeisurePage() {
        chatPage.classList.remove('active');
        leisurePage.classList.add('active');
        managePage.classList.remove('active');
        // 触发休闲页邀请逻辑（如果存在）
        if (typeof triggerInvite === 'function') {
            setTimeout(() => {
                if (typeof inviteCount !== 'undefined' && inviteCount < 2 && typeof inviteTimer !== 'undefined' && !inviteTimer && typeof isLeisureInterrupted !== 'undefined' && !isLeisureInterrupted) {
                    triggerInvite(true);
                }
            }, 500);
        }
    }
    
    // 显示设置页面
    function showManagePage() {
        chatPage.classList.remove('active');
        leisurePage.classList.remove('active');
        managePage.classList.add('active');
    }
    
    // 绑定顶部栏按钮
    if (starMenuBtn) {
        starMenuBtn.onclick = () => {
            showManagePage();
            setTimeout(() => {
                const groupsContainer = document.getElementById('groupsContainer');
                if (groupsContainer) groupsContainer.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        };
    }
    
    if (settingsBtn) {
        settingsBtn.onclick = showManagePage;
    }
    
    if (leisureBubbleBtn) {
        leisureBubbleBtn.onclick = showLeisurePage;
    }
    
    // 底部输入栏逻辑
    const msgInput = document.getElementById('msgInput');
    const actionBtn = document.getElementById('actionBtn');
    const emojiBtn = document.getElementById('openEmojiBtn');
    const fileInput = document.getElementById('fileInput');
    const diceBtn = document.getElementById('diceBtn');
    
    function updateActionButton() {
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
            } else {
                if (fileInput) fileInput.click();
            }
        };
    }
    
    if (emojiBtn && typeof showStickerModal === 'function') {
        emojiBtn.onclick = () => showStickerModal(commonEmojis, '通用表情', true);
    }
    
    if (diceBtn && typeof addMessage === 'function') {
        diceBtn.onclick = () => {
            const result = Math.floor(Math.random() * 6) + 1;
            addMessage('🎲 我掷出了 ' + result + ' 点', true);
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
    
    // 半小时随机拍拍
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
    
    console.log('✅ 页面已加载（最终版：无侧边栏，样式内嵌）');
});
