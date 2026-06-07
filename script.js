// ========== script.js · 最终完整版（所有按钮正常 + 表情面板 + 点击星星回聊天） ==========
// import { LocalNotifications } from '@capacitor/local-notifications';  // 打包APK时再取消注释

const LocalNotifications = {
    schedule: async () => { console.log('[模拟] 通知已发送'); }
};

document.addEventListener('DOMContentLoaded', function() {

    // ========== 1. 页面切换 ==========
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
    
    showChatPage();
    
    // ========== 2. 顶部栏按钮（星星 + 字卡 + 设置 + 泡泡） ==========
    const backToChatBtn = document.getElementById('backToChatBtn');  // 星星
    const starMenuBtn = document.getElementById('starMenuBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const leisureBubbleBtn = document.getElementById('leisureBubbleBtn');
    
    if (backToChatBtn) backToChatBtn.onclick = showChatPage;
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
    
    // ========== 3. 底部输入栏 ==========
    const msgInput = document.getElementById('msgInput');
    const actionBtn = document.getElementById('actionBtn');
    const fileInput = document.getElementById('fileInput');
    const diceBtn = document.getElementById('diceBtn');
    
    if (msgInput && actionBtn) {
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
        msgInput.addEventListener('input', updateActionButton);
        updateActionButton();
        actionBtn.onclick = () => {
            const hasText = msgInput.value.trim().length > 0;
            if (hasText) {
                if (typeof addMessage === 'function') addMessage(msgInput.value.trim(), true);
                msgInput.value = '';
                updateActionButton();
            } else if (fileInput) fileInput.click();
        };
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
                        if (file.type.startsWith('image/')) addMessage("", true, ev.target.result);
                        else addMessage('[文件] ' + file.name, true);
                    }
                };
                reader.readAsDataURL(file);
            }
            fileInput.value = '';
        };
    }
    
    // ========== 4. 表情面板 ==========
    const emojiBtn = document.getElementById('openEmojiBtn');
    const emojiPanel = document.getElementById('emojiPanel');
    const closeEmojiPanel = document.getElementById('closeEmojiPanel');
    const emojiTabs = document.querySelectorAll('.emoji-tab');
    const commonGrid = document.getElementById('commonGrid');
    const cat1Grid = document.getElementById('cat1Grid');
    const cat2Grid = document.getElementById('cat2Grid');
    
    const commonEmojisList = ['😊', '😂', '😍', '😭', '😡', '🥺', '👍', '❤️', '🎉', '✨', '🌟', '💕', '😘', '😎', '🤔', '🙏', '💪', '🐱', '🌸', '🍃', '🍎', '⚡', '⭐', '☕', '🎵', '💤', '👋', '🤗'];
    const catStickers1List = (typeof catStickers1 !== 'undefined') ? catStickers1 : ['🐱', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'];
    const catStickers2List = (typeof catStickers2 !== 'undefined') ? catStickers2 : ['🐈', '🐾', '🐟', '🎣', '🏠', '🌸', '🌿', '🍣'];
    
    function generateGrid(gridElement, list) {
        if (!gridElement) return;
        gridElement.innerHTML = '';
        list.forEach(emoji => {
            const item = document.createElement('div');
            item.className = 'emoji-item';
            item.textContent = emoji;
            item.onclick = () => {
                if (typeof addMessage === 'function') addMessage(emoji, true);
                if (emojiPanel) emojiPanel.classList.remove('open');
            };
            gridElement.appendChild(item);
        });
    }
    
    generateGrid(commonGrid, commonEmojisList);
    generateGrid(cat1Grid, catStickers1List);
    generateGrid(cat2Grid, catStickers2List);
    
    if (emojiTabs.length) {
        emojiTabs.forEach(tab => {
            tab.onclick = () => {
                const target = tab.getAttribute('data-tab');
                emojiTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                if (commonGrid) commonGrid.classList.remove('active');
                if (cat1Grid) cat1Grid.classList.remove('active');
                if (cat2Grid) cat2Grid.classList.remove('active');
                if (target === 'common' && commonGrid) commonGrid.classList.add('active');
                else if (target === 'cat1' && cat1Grid) cat1Grid.classList.add('active');
                else if (target === 'cat2' && cat2Grid) cat2Grid.classList.add('active');
            };
        });
    }
    
    if (emojiBtn && emojiPanel) {
        emojiBtn.onclick = () => emojiPanel.classList.add('open');
    }
    if (closeEmojiPanel && emojiPanel) {
        closeEmojiPanel.onclick = () => emojiPanel.classList.remove('open');
    }
    document.addEventListener('click', (e) => {
        if (emojiPanel && emojiPanel.classList.contains('open')) {
            if (!emojiPanel.contains(e.target) && e.target !== emojiBtn) {
                emojiPanel.classList.remove('open');
            }
        }
    });
    
    // ========== 5. 半小时随机拍拍 ==========
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
    
    console.log('✅ 最终版：星星回到聊天 + 按钮动画 + 表情面板可滑动');
});
