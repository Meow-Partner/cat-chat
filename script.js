// ========== script.js · 猫猫搭档 · 最终完整版 ==========
// import { LocalNotifications } from '@capacitor/local-notifications';  // 打包APK时再取消注释

// 临时模拟一个 LocalNotifications 对象，避免浏览器报错
const LocalNotifications = {
    schedule: async () => { console.log('[模拟] 通知已发送（打包后生效）'); }
};

document.addEventListener('DOMContentLoaded', function() {

    // ========== 1. 新顶部栏逻辑（左：星回+字卡，中：泡泡，右：设置+我） ==========
    const starMenuBtn = document.getElementById('starMenuBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const leisureBubbleBtn = document.getElementById('leisureBubbleBtn');
    const sideTabs = document.querySelectorAll('.side-tab');
    
    // 字卡入口：切换到设置页并滚动到字卡管理区域
    if (starMenuBtn) {
        starMenuBtn.onclick = () => {
            const manageTab = document.querySelector('.side-tab[data-page="manage-page"]');
            if (manageTab) manageTab.click();
            setTimeout(() => {
                const groupsContainer = document.getElementById('groupsContainer');
                if (groupsContainer) groupsContainer.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        };
    }
    
    // 设置入口：切换到设置页
    if (settingsBtn) {
        settingsBtn.onclick = () => {
            const manageTab = document.querySelector('.side-tab[data-page="manage-page"]');
            if (manageTab) manageTab.click();
        };
    }
    
    // 休闲泡泡入口：切换到休闲页，并保留原有的邀请逻辑
    if (leisureBubbleBtn) {
        leisureBubbleBtn.onclick = () => {
            const leisureTab = document.querySelector('.side-tab[data-page="leisure-page"]');
            if (leisureTab) {
                leisureTab.click();
            } else {
                // 如果没有侧边栏休闲tab，直接显示页面
                const pages = {
                    'chat-page': document.getElementById('chat-page'),
                    'leisure-page': document.getElementById('leisure-page'),
                    'manage-page': document.getElementById('manage-page')
                };
                for (let id in pages) {
                    if (pages[id]) pages[id].classList.remove('active');
                }
                if (pages['leisure-page']) pages['leisure-page'].classList.add('active');
                sideTabs.forEach(tab => {
                    if (tab.getAttribute('data-page') === 'leisure-page') {
                        tab.classList.add('active');
                    } else {
                        tab.classList.remove('active');
                    }
                });
            }
            // 原有休闲页邀请逻辑
            if (typeof triggerInvite === 'function') {
                setTimeout(() => {
                    if (typeof inviteCount !== 'undefined' && inviteCount < 2 && typeof inviteTimer !== 'undefined' && !inviteTimer && typeof isLeisureInterrupted !== 'undefined' && !isLeisureInterrupted) {
                        triggerInvite(true);
                    }
                }, 500);
            }
        };
    }

    // ========== 2. 页面切换（侧边栏只有聊天和设置，休闲由顶部泡泡控制） ==========
    const pages = {
        'chat-page': document.getElementById('chat-page'),
        'leisure-page': document.getElementById('leisure-page'),
        'manage-page': document.getElementById('manage-page')
    };
    function switchPage(pageId) {
        for (let id in pages) {
            if (pages[id]) pages[id].classList.remove('active');
        }
        if (pages[pageId]) pages[pageId].classList.add('active');
        sideTabs.forEach(tab => {
            if (tab.getAttribute('data-page') === pageId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }
    sideTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const pageId = tab.getAttribute('data-page');
            if (pageId && pages[pageId]) switchPage(pageId);
        });
    });

    // 侧边栏隐藏/展开（原功能保留）
    const sidebar = document.getElementById('sidebarTabs');
    const toggleBtn = document.getElementById('toggleSidebarBtn');
    let isSidebarVisible = true;
    function toggleSidebar() {
        isSidebarVisible = !isSidebarVisible;
        if (isSidebarVisible) {
            sidebar.classList.remove('hidden');
            toggleBtn.innerHTML = '◀';
        } else {
            sidebar.classList.add('hidden');
            toggleBtn.innerHTML = '▶';
        }
        localStorage.setItem('sidebar_visible', isSidebarVisible);
    }
    if (toggleBtn) toggleBtn.onclick = toggleSidebar;
    const savedState = localStorage.getItem('sidebar_visible');
    if (savedState === 'false') {
        isSidebarVisible = false;
        sidebar.classList.add('hidden');
        toggleBtn.innerHTML = '▶';
    }

    // ========== 3. 底部输入栏：加号变发送 / 表情直接发送 ==========
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
    // 表情按钮直接发送 😊
    if (emojiBtn && typeof showStickerModal === 'function') {
        emojiBtn.onclick = () => showStickerModal(commonEmojis, '通用表情', true);
    }
    // 骰子
    if (diceBtn && typeof addMessage === 'function') {
        diceBtn.onclick = () => {
            const result = Math.floor(Math.random() * 6) + 1;
            addMessage('🎲 我掷出了 ' + result + ' 点', true);
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

    // ========== 4. 以下是你原有的所有功能（一个字不改，完整保留） ==========
    // 表情包按钮（保留原有三个入口）
    const openEmojiBtn = document.getElementById('openEmojiBtn');
    if (openEmojiBtn && typeof showStickerModal === 'function') {
        openEmojiBtn.onclick = () => showStickerModal(commonEmojis, '通用表情', true);
    }
    const stickerBtn1 = document.getElementById('openStickerBtn1');
    if (stickerBtn1 && typeof showStickerModal === 'function') {
        stickerBtn1.onclick = () => showStickerModal(catStickers1, '猫猫搭档1', false);
    }
    const stickerBtn2 = document.getElementById('openStickerBtn2');
    if (stickerBtn2 && typeof showStickerModal === 'function') {
        stickerBtn2.onclick = () => showStickerModal(catStickers2, '猫猫搭档2', false);
    }

    // 加载默认字卡（原有）
    const loadBtn = document.getElementById('loadDefaultBtn');
    if (loadBtn && typeof DEFAULT_CARDS_LIST !== 'undefined') {
        loadBtn.onclick = () => {
            const ta = document.getElementById('cardBulkInput');
            if (ta) {
                ta.value = DEFAULT_CARDS_LIST.join('\n');
                alert('已加载');
            }
        };
    }
    // 批量添加
    const multiBtn = document.getElementById('addMultiLineBtn');
    if (multiBtn && typeof showGroupSelectModal === 'function') {
        multiBtn.onclick = () => {
            const ta = document.getElementById('cardBulkInput');
            if (!ta) return;
            const value = ta.value;
            if (!value.trim()) return alert("请输入内容");
            const lines = value.split(/\r?\n/).filter(l => l.trim().length > 0);
            if (lines.length === 0) return alert("没有有效内容");
            showGroupSelectModal(lines);
        };
    }
    // 清空文本框
    const clearBtn = document.getElementById('clearTextareaBtn');
    if (clearBtn) {
        clearBtn.onclick = () => {
            if (confirm('确定清空文本框中的所有内容吗？')) {
                const ta = document.getElementById('cardBulkInput');
                if (ta) ta.value = '';
                alert('已清空');
            }
        };
    }
    // 新建分组
    const addGroupBtn = document.getElementById('addGroupBtn');
    if (addGroupBtn && typeof userGroups !== 'undefined') {
        addGroupBtn.onclick = () => {
            const newName = prompt("请输入新分组名称");
            if (newName && newName.trim() && !userGroups[newName.trim()]) {
                userGroups[newName.trim()] = [];
                if (typeof renderGroups === 'function') renderGroups();
                if (typeof saveGroups === 'function') saveGroups();
            } else if (userGroups[newName.trim()]) {
                alert("分组已存在");
            }
        };
    }
    // 保存回复设置
    const saveReply = document.getElementById('saveReplySettings');
    if (saveReply && typeof replySettings !== 'undefined') {
        saveReply.onclick = () => {
            const minV = parseInt(document.getElementById('minDelaySec').value) || 1;
            const maxV = parseInt(document.getElementById('maxDelaySec').value) || 300;
            const actV = parseInt(document.getElementById('activeDelayMin').value) || 5;
            replySettings.minDelaySec = minV;
            replySettings.maxDelaySec = maxV;
            replySettings.activeDelayMin = actV;
            if (typeof saveAllData === 'function') saveAllData();
            if (typeof resetActiveMessageTimer === 'function') resetActiveMessageTimer();
            alert('已保存');
        };
    }
    // 导出数据
    const exportBtn = document.getElementById('exportFullData');
    if (exportBtn) {
        exportBtn.onclick = () => {
            const data = {
                chatMessages: typeof chatMessages !== 'undefined' ? chatMessages : [],
                userGroups: typeof userGroups !== 'undefined' ? userGroups : {},
                groupLocks: typeof groupLocks !== 'undefined' ? groupLocks : {},
                groupDedup: typeof groupDedup !== 'undefined' ? groupDedup : {},
                stickers: typeof stickers !== 'undefined' ? stickers : [],
                replySettings: typeof replySettings !== 'undefined' ? replySettings : {},
                patMessage: typeof patMessage !== 'undefined' ? patMessage : '',
                profile: {
                    myNickname: typeof myNickname !== 'undefined' ? myNickname : 'user',
                    myAvatar: typeof myAvatar !== 'undefined' ? myAvatar : 'user',
                    partnerNickname: typeof partnerNickname !== 'undefined' ? partnerNickname : '沈星回',
                    partnerAvatar: typeof partnerAvatar !== 'undefined' ? partnerAvatar : 'Star'
                },
                leisureData: typeof leisureData !== 'undefined' ? leisureData : {}
            };
            const a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([JSON.stringify(data)]));
            a.download = 'chat_backup.json';
            a.click();
        };
    }
    // 导入数据
    const importBtn = document.getElementById('importDataBtn');
    const importFile = document.getElementById('importFileInput');
    if (importBtn && importFile) {
        importBtn.onclick = () => {
            const f = importFile.files[0];
            if (!f) return alert("请选择文件");
            const r = new FileReader();
            r.onload = (e) => {
                try {
                    const d = JSON.parse(e.target.result);
                    if (d.chatMessages && typeof chatMessages !== 'undefined') {
                        chatMessages.length = 0;
                        chatMessages.push(...d.chatMessages);
                    }
                    if (d.userGroups && typeof userGroups !== 'undefined') {
                        Object.assign(userGroups, d.userGroups);
                    }
                    if (d.groupLocks && typeof groupLocks !== 'undefined') {
                        Object.assign(groupLocks, d.groupLocks);
                    }
                    if (d.groupDedup && typeof groupDedup !== 'undefined') {
                        Object.assign(groupDedup, d.groupDedup);
                    }
                    if (d.stickers && typeof stickers !== 'undefined') {
                        stickers.length = 0;
                        stickers.push(...d.stickers);
                    }
                    if (d.replySettings && typeof replySettings !== 'undefined') replySettings = d.replySettings;
                    if (d.patMessage && typeof patMessage !== 'undefined') patMessage = d.patMessage;
                    if (d.profile) {
                        localStorage.setItem('profile_settings', JSON.stringify(d.profile));
                        if (typeof myNickname !== 'undefined') myNickname = d.profile.myNickname;
                        if (typeof myAvatar !== 'undefined') myAvatar = d.profile.myAvatar;
                        if (typeof partnerNickname !== 'undefined') partnerNickname = d.profile.partnerNickname;
                        if (typeof partnerAvatar !== 'undefined') partnerAvatar = d.profile.partnerAvatar;
                    }
                    if (d.leisureData && typeof leisureData !== 'undefined') {
                        for (let lt in d.leisureData) {
                            if (leisureData[lt]) {
                                leisureData[lt].myItems = d.leisureData[lt].myItems || [];
                                leisureData[lt].hisItems = d.leisureData[lt].hisItems || [];
                            }
                        }
                    }
                    if (typeof saveAllData === 'function') saveAllData();
                    if (typeof renderChat === 'function') renderChat();
                    if (typeof renderGroups === 'function') renderGroups();
                    if (typeof renderLeisurePage === 'function') renderLeisurePage();
                    if (typeof updateReplyCountDisplay === 'function') updateReplyCountDisplay();
                    if (typeof setRandomLeisure === 'function') setRandomLeisure();
                    alert("导入成功");
                } catch(err) {
                    alert("解析失败");
                }
            };
            r.readAsText(f);
        };
    }
    // 清空聊天记录
    const clearChats = document.getElementById('clearAllChats');
    if (clearChats) {
        clearChats.onclick = () => {
            if (confirm("清空聊天记录？")) {
                if (typeof chatMessages !== 'undefined') {
                    chatMessages.length = 0;
                    if (typeof saveAllData === 'function') saveAllData();
                    if (typeof renderChat === 'function') renderChat();
                    if (typeof updateLastChatTime === 'function') updateLastChatTime();
                }
            }
        };
    }
    // 编辑对方名字
    const editName = document.getElementById('editNameBtn');
    if (editName) {
        editName.onclick = () => {
            const newName = prompt("对方名字", typeof partnerNickname !== 'undefined' ? partnerNickname : '沈星回');
            if (newName && newName.trim()) {
                if (typeof partnerNickname !== 'undefined') partnerNickname = newName.trim();
                document.getElementById('partnerName').innerText = partnerNickname;
                if (typeof saveProfile === 'function') saveProfile();
                if (typeof renderChat === 'function') renderChat();
            }
        };
    }
    // 保存个人设置
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    if (saveProfileBtn && typeof saveProfile === 'function') {
        saveProfileBtn.onclick = saveProfile;
    }
    // 初始化云端同步
    if (typeof initSync === 'function') {
        initSync();
    }

    // ========== 5. GitHub 字卡同步（原样保留） ==========
    const DEFAULT_CARDS_URL = 'https://raw.githubusercontent.com/Meow-Partner/cat-chat/main/default_cards.json';
    async function updateCardsFromGitHub(silent = false) {
        try {
            const response = await fetch(DEFAULT_CARDS_URL);
            const remoteCards = await response.json();
            let totalAdded = 0;
            for (let groupName in remoteCards) {
                if (!userGroups[groupName]) userGroups[groupName] = [];
                for (let card of remoteCards[groupName]) {
                    if (!userGroups[groupName].includes(card)) {
                        userGroups[groupName].push(card);
                        totalAdded++;
                    }
                }
            }
            if (totalAdded > 0) {
                renderGroups();
                saveGroups();
                if (!silent) alert(`成功添加 ${totalAdded} 条字卡到 ${Object.keys(remoteCards).join('、')} 分组`);
                else console.log(`静默添加了 ${totalAdded} 条字卡`);
            } else if (!silent) alert('字卡已是最新，无需更新');
        } catch(e) {
            if (!silent) alert('更新失败：网络错误\n' + e.message);
            console.log('自动更新字卡失败');
        }
    }
    const githubUpdateBtn = document.getElementById('updateCardsBtn');
    if (githubUpdateBtn) githubUpdateBtn.onclick = () => updateCardsFromGitHub(false);
    const guideUpdateBtn = document.getElementById('updateGuideBtn');
    if (guideUpdateBtn) {
        guideUpdateBtn.onclick = () => alert('【更新步骤】\n\n1. 打开「一个木函」→ 网页转应用\n2. 网址填：https://meow-partner.github.io/cat-chat/\n3. 应用名称：猫猫搭档\n4. 包名：com.cat.partner\n5. 版本号：每次 +1\n6. 版本名：每次 +0.1\n7. 生成 APK，覆盖安装\n✅ 包名固定不变，数据不丢失');
    }
    setTimeout(() => { updateCardsFromGitHub(true); }, 2000);

    // ========== 6. 半小时随机“拍了拍你”（原样保留） ==========
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
                console.log('[拍拍] ✅ 真实通知已发送（打包APK后生效）');
            } catch (err) {
                console.log('[拍拍] 当前环境不支持通知（浏览器正常）');
            }
            scheduleRandomPat();
        }, delayMs);
    }
    scheduleRandomPat();

    console.log('✅ 页面全功能已加载（新顶部栏｜底部发送｜半小时随机拍）');
});
