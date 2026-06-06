// ========== 主脚本入口（干净版）==========

// 等待页面加载完成后再执行
document.addEventListener('DOMContentLoaded', function() {

    // 页面切换
    const sideTabs = document.querySelectorAll('.side-tab');
    const pages = {
        'chat-page': document.getElementById('chat-page'),
        'card-page': document.getElementById('card-page'),
        'leisure-page': document.getElementById('leisure-page'),
        'manage-page': document.getElementById('manage-page'),
        'update-page': document.getElementById('update-page')
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
            if (pageId) switchPage(pageId);
        });
    });

    // 侧边栏隐藏/展开
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

    // 表情包按钮
    const emojiBtn = document.getElementById('openEmojiBtn');
    if (emojiBtn && typeof showStickerModal === 'function') {
        emojiBtn.onclick = () => showStickerModal(commonEmojis, '通用表情', true);
    }

    const stickerBtn1 = document.getElementById('openStickerBtn1');
    if (stickerBtn1 && typeof showStickerModal === 'function') {
        stickerBtn1.onclick = () => showStickerModal(catStickers1, '猫猫搭档1', false);
    }

    const stickerBtn2 = document.getElementById('openStickerBtn2');
    if (stickerBtn2 && typeof showStickerModal === 'function') {
        stickerBtn2.onclick = () => showStickerModal(catStickers2, '猫猫搭档2', false);
    }

    // + 按钮
    const plusBtn = document.getElementById('plusBtn');
    const fileInput = document.getElementById('fileInput');
    if (plusBtn && fileInput) {
        plusBtn.onclick = () => fileInput.click();
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

    // 加载默认字卡
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

    // 发送消息
    const sendMsg = document.getElementById('sendMsgBtn');
    const msgInput = document.getElementById('msgInput');
    if (sendMsg && msgInput && typeof addMessage === 'function') {
        sendMsg.onclick = () => {
            const text = msgInput.value.trim();
            if (text) {
                addMessage(text, true);
                msgInput.value = '';
            }
        };
    }

    // 骰子
    const dice = document.getElementById('diceBtn');
    if (dice && typeof addMessage === 'function') {
        dice.onclick = () => {
            addMessage('🎲 我掷出了 ' + (Math.floor(Math.random() * 6) + 1) + ' 点', true);
        };
    }

    // 保存个人设置
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    if (saveProfileBtn && typeof saveProfile === 'function') {
        saveProfileBtn.onclick = saveProfile;
    }

    // 休闲页面触发邀请
    const leisureTab = document.querySelector('.side-tab[data-page="leisure-page"]');
    if (leisureTab && typeof triggerInvite === 'function') {
        leisureTab.addEventListener('click', () => {
            setTimeout(() => {
                if (typeof inviteCount !== 'undefined' && inviteCount < 2 && typeof inviteTimer !== 'undefined' && !inviteTimer && typeof isLeisureInterrupted !== 'undefined' && !isLeisureInterrupted) {
                    triggerInvite(true);
                }
            }, 500);
        });
    }

    // 初始化云端同步
    if (typeof initSync === 'function') {
        initSync();
    }

      console.log('✅ 页面初始化完成');

    // ========== GitHub 字卡同步 ==========
    const DEFAULT_CARDS_URL = 'https://raw.githubusercontent.com/Meow-Partner/cat-chat/main/default_cards.json';

    async function loadDefaultCardsFromGitHub() {
        try {
            const response = await fetch(DEFAULT_CARDS_URL);
            const remoteCards = await response.json();
            
            for (let groupName in remoteCards) {
                if (!userGroups[groupName]) {
                    userGroups[groupName] = [];
                }
                for (let card of remoteCards[groupName]) {
                    if (!userGroups[groupName].includes(card)) {
                        userGroups[groupName].push(card);
                    }
                }
            }
            renderGroups();
            saveGroups();
            console.log('默认字卡加载完成');
        } catch(e) {
            console.log('加载默认字卡失败，使用本地字卡');
        }
    }

    async function updateCardsFromGitHub() {
        try {
            const response = await fetch(DEFAULT_CARDS_URL);
            const remoteCards = await response.json();
            let addedCount = 0;
            
            for (let groupName in remoteCards) {
                if (!userGroups[groupName]) {
                    userGroups[groupName] = [];
                }
                for (let card of remoteCards[groupName]) {
                    if (!userGroups[groupName].includes(card)) {
                        userGroups[groupName].push(card);
                        addedCount++;
                    }
                }
            }
            
            if (addedCount > 0) {
                renderGroups();
                saveGroups();
                alert(`已添加 ${addedCount} 条新字卡`);
            } else {
                alert('字卡已是最新');
            }
        } catch(e) {
            alert('更新失败：网络错误');
        }
    }

    const updateBtn = document.getElementById('updateCardsBtn');
    if (updateBtn) {
        updateBtn.onclick = updateCardsFromGitHub;
    }

});
