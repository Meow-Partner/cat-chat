// ========== 聊天模块 · 修复版 ==========

// 保存所有数据到本地存储
function saveAllData() {
    if (typeof chatMessages !== 'undefined') {
        localStorage.setItem('chat_messages', JSON.stringify(chatMessages));
    }
    if (typeof saveGroups === 'function') saveGroups();
    if (typeof replySettings !== 'undefined') {
        localStorage.setItem('reply_settings', JSON.stringify(replySettings));
    }
    if (typeof patMessage !== 'undefined') {
        localStorage.setItem('pat_message', patMessage);
    }
    if (typeof saveLeisureData === 'function') saveLeisureData();
}

// 聊天数据
let chatMessages = [];
let stickers = [];
let replySettings = { minDelaySec: 1, maxDelaySec: 300, activeDelayMin: 5 };
let patMessage = "拍了拍 {name}";
let pendingReplyTimer = null;
let activeMsgTimer = null;
let editingRecalledMsg = null;
let currentMenu = null;
let typingTimeout = null;
let inputReplyTimer = null;
let lastChatTime = Date.now();

// DOM 元素
const chatContainer = document.getElementById('chatArea');
const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendMsgBtn');
const diceBtn = document.getElementById('diceBtn');
const typingStatusSpan = document.getElementById('typingStatus');

// 更新最后聊天时间
function updateLastChatTime() {
    lastChatTime = Date.now();
    resetActiveMessageTimer();
}

// 重置主动消息定时器
function resetActiveMessageTimer() {
    if (activeMsgTimer) clearTimeout(activeMsgTimer);
    activeMsgTimer = setTimeout(function() { sendActiveMessage(); }, (replySettings.activeDelayMin || 5) * 60 * 1000);
}

// 发送主动消息
function sendActiveMessage() {
    if (Date.now() - lastChatTime >= (replySettings.activeDelayMin || 5) * 60 * 1000) {
        var replyText = getWeightedRandomReply();
        if (replyText && replyText !== "没有字卡可以用。") addMessage(replyText, false);
    }
    resetActiveMessageTimer();
}

// 加权随机回复
function getWeightedRandomReply() {
    var rand = Math.random() * 100;
    var allCatStickers = catStickers1.concat(catStickers2);
    if (rand < 50) {
        var allReplies = getAllReplies();
        if (allReplies.length > 0) return allReplies[Math.floor(Math.random() * allReplies.length)];
    } else if (rand < 80) {
        if (allCatStickers.length > 0) return allCatStickers[Math.floor(Math.random() * allCatStickers.length)];
    } else {
        return Math.random() < 0.3 ? '🎲 掷出了 ' + (Math.floor(Math.random()*6)+1) + ' 点' : commonEmojis[Math.floor(Math.random() * commonEmojis.length)];
    }
    return "没有字卡可以用。";
}

// 输入时触发（修复版 - 增加容错）
function onUserTyping() {
    if (typingStatusSpan) {
        typingStatusSpan.innerText = "对方正在输入中...";
    }
    if (typingTimeout) clearTimeout(typingTimeout);
    typingTimeout = setTimeout(function() { 
        if (typingStatusSpan) typingStatusSpan.innerText = ""; 
    }, 1500);
    if (inputReplyTimer) clearTimeout(inputReplyTimer);
    inputReplyTimer = setTimeout(function() {
        if (!pendingReplyTimer) {
            var replyText = getWeightedRandomReply();
            if (replyText && replyText !== "没有字卡可以用。") addMessage(replyText, false);
        }
        inputReplyTimer = null;
    }, 1000);
    // 输入时触发邀请
    if (typeof triggerInvite === 'function' && typeof inviteCount !== 'undefined' && inviteCount < 2 && typeof inviteTimer !== 'undefined' && !inviteTimer && typeof isLeisureInterrupted !== 'undefined' && !isLeisureInterrupted) {
        triggerInvite(false);
    }
}
if (msgInput) {
    msgInput.addEventListener('input', onUserTyping);
}

// 添加消息
function addMessage(text, isMe, imgSrc, isSystem) {
    imgSrc = imgSrc || null;
    var now = new Date();
    var timeStr = (now.getMonth()+1) + '/' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
    chatMessages.push({ text: text, time: timeStr, timestamp: Date.now(), isMe: isMe, imgSrc: imgSrc, isRecalled: false });
    saveAllData(); 
    renderChat(); 
    updateLastChatTime();
    if (isMe && !isSystem) {
        if (inputReplyTimer) { clearTimeout(inputReplyTimer); inputReplyTimer = null; }
        if (pendingReplyTimer) clearTimeout(pendingReplyTimer);
        var minMs = replySettings.minDelaySec * 1000;
        var maxMs = replySettings.maxDelaySec * 1000;
        var delay = Math.random() * (maxMs - minMs) + minMs;
        pendingReplyTimer = setTimeout(function() { 
            addMessage(getWeightedRandomReply(), false); 
            pendingReplyTimer = null; 
        }, delay);
    }
}

// 添加系统消息
function addSystemMessage(text) {
    addMessage(text, false, null, true);
}

// 渲染聊天
function renderChat() {
    if (!chatContainer) return;
    chatContainer.innerHTML = '';
    for (var idx = 0; idx < chatMessages.length; idx++) {
        var msg = chatMessages[idx];
        var row = document.createElement('div');
        row.className = 'message-row ' + (msg.isMe ? 'me' : 'other') + (msg.isRecalled ? ' recalled' : '');
        var avatar = document.createElement('div'); 
        avatar.className = 'msg-avatar';
        avatar.innerText = msg.isMe ? (typeof myAvatar !== 'undefined' ? myAvatar : 'user') : (typeof partnerAvatar !== 'undefined' ? partnerAvatar : 'Star');
        avatar.ondblclick = (function(isMe) { return function() { sendPat(isMe, isMe); }; })(msg.isMe);
        avatar.oncontextmenu = function(e) { e.preventDefault(); var rect = avatar.getBoundingClientRect(); showAvatarMenu(e.clientX, rect.top-10); };
        var contentDiv = document.createElement('div'); 
        contentDiv.className = 'msg-content';
        var bubble = document.createElement('div'); 
        bubble.className = 'bubble';
        if (msg.isRecalled) {
            bubble.innerHTML = '<div>⚠️ 该消息已撤回</div>';
            if (msg.isMe) {
                var editBtn = document.createElement('button'); 
                editBtn.innerText = '✏️ 重新编辑';
                editBtn.style.cssText = 'background:none;border:none;font-size:10px;color:#c16f9e;margin-top:4px';
                editBtn.onclick = (function(idx) { return function() { 
                    editingRecalledMsg = {idx: idx, oldText: msg.recalledContent}; 
                    msgInput.value = msg.recalledContent; 
                    msgInput.focus(); 
                    alert("编辑后点击发送"); 
                }; })(idx);
                bubble.appendChild(editBtn);
            }
        } else {
            var bubbleHtml = '<div>' + escapeHtml(msg.text) + '</div>';
            if (msg.imgSrc) bubbleHtml += '<img class="msg-img" src="' + msg.imgSrc + '">';
            bubbleHtml += '<div class="time">' + (msg.time || '') + '</div>';
            bubble.innerHTML = bubbleHtml;
            bubble.oncontextmenu = (function(idx, msg) { return function(e) { 
                e.preventDefault(); 
                var rect = bubble.getBoundingClientRect(); 
                showMessageMenu(e.clientX, rect.top-10, idx, msg.text, msg.isMe, msg.isRecalled, msg.timestamp); 
            }; })(idx, msg);
        }
        contentDiv.appendChild(bubble);
        if (msg.isMe) { row.appendChild(contentDiv); row.appendChild(avatar); }
        else { row.appendChild(avatar); row.appendChild(contentDiv); }
        chatContainer.appendChild(row);
    }
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// 拍一拍
function sendPat(isFromMe, targetIsSelf) {
    var partnerNickname = typeof window.partnerNickname !== 'undefined' ? window.partnerNickname : "沈星回";
    var patText = isFromMe && targetIsSelf ? '👋 我拍了拍我自己' : (isFromMe && !targetIsSelf ? '👋 我拍了拍 ' + partnerNickname : '👋 ' + partnerNickname + ' 拍了拍我');
    addMessage(patText, isFromMe);
}

// 设置拍一拍文案
function setPatMessage() {
    var newMsg = prompt("设置拍一拍文案（{name}代表对方名字）", patMessage);
    if (newMsg && newMsg.trim()) { 
        patMessage = newMsg.trim(); 
        alert("已设置"); 
        saveAllData(); 
    }
}

// 显示头像菜单
function showAvatarMenu(x, y) {
    closeAllMenus();
    var menu = document.createElement('div'); 
    menu.className = 'context-menu';
    menu.style.left = x + 'px'; 
    menu.style.top = y + 'px';
    var setPatItem = document.createElement('div'); 
    setPatItem.className = 'context-menu-item';
    setPatItem.innerHTML = '👋 设置拍一拍文案';
    setPatItem.onclick = function(e) { e.stopPropagation(); setPatMessage(); closeAllMenus(); };
    menu.appendChild(setPatItem);
    document.body.appendChild(menu); 
    currentMenu = menu;
    setTimeout(function() {
        var closeHandler = function(e) { 
            if (!menu.contains(e.target)) { 
                closeAllMenus(); 
                document.removeEventListener('click', closeHandler); 
            } 
        };
        document.addEventListener('click', closeHandler);
    }, 10);
}

// 显示消息菜单
function showMessageMenu(x, y, idx, text, isMe, isRecalled, ts) {
    closeAllMenus();
    var menu = document.createElement('div'); 
    menu.className = 'context-menu';
    menu.style.left = x + 'px'; 
    menu.style.top = y + 'px';
    var items = [
        { html: '📋 复制', action: function() { navigator.clipboard.writeText(text); } },
        { html: '💬 引用', action: function() { msgInput.value = '引用: ' + text + '\n'; } }
    ];
    if (isMe && !isRecalled && Date.now() - ts <= 120000) {
        items.push({ html: '⏰ 撤回', action: function() { recallMessage(idx); } });
    }
    if (isMe) {
        items.push({ html: '🗑️ 删除', action: function() { 
            if (confirm('删除？')) { 
                chatMessages.splice(idx, 1); 
                saveAllData(); 
                renderChat(); 
                updateLastChatTime(); 
            } 
        }, danger: true });
    }
    if (!isRecalled && text && text.indexOf('拍了拍') === -1 && text.indexOf('掷出了') === -1) {
        items.push({ html: '📚 添加至字卡', action: function() { 
            if (typeof addToCardHandler === 'function') addToCardHandler(text); 
        } });
    }
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var div = document.createElement('div'); 
        div.className = 'context-menu-item';
        if (item.danger) div.classList.add('danger');
        div.innerHTML = item.html;
        div.onclick = (function(action) { return function(e) { 
            e.stopPropagation(); 
            action(); 
            closeAllMenus(); 
        }; })(item.action);
        menu.appendChild(div);
    }
    document.body.appendChild(menu); 
    currentMenu = menu;
    setTimeout(function() {
        var closeHandler = function(e) { 
            if (!menu.contains(e.target)) { 
                closeAllMenus(); 
                document.removeEventListener('click', closeHandler); 
            } 
        };
        document.addEventListener('click', closeHandler);
    }, 10);
}

// 撤回消息
function recallMessage(idx) {
    var msg = chatMessages[idx];
    if (Date.now() - msg.timestamp > 120000) { 
        alert("超过2分钟无法撤回"); 
        return; 
    }
    if (msg.isRecalled) { 
        alert("已撤回"); 
        return; 
    }
    msg.isRecalled = true; 
    msg.recalledContent = msg.text;
    saveAllData(); 
    renderChat(); 
    updateLastChatTime();
}

// 关闭所有菜单
function closeAllMenus() { 
    if (currentMenu) { 
        currentMenu.remove(); 
        currentMenu = null; 
    } 
}

// 添加消息到字卡（供菜单调用）
function addToCardHandler(text) {
    if (typeof userGroups !== 'undefined') {
        var groupName = "我的字卡";
        if (!userGroups[groupName]) userGroups[groupName] = [];
        if (userGroups[groupName].some(c => c.replys && c.replys[0] === text)) {
            alert("已在字卡库中");
            return;
        }
        userGroups[groupName].push({ word: 'r_' + Date.now(), replys: [text] });
        if (typeof renderGroups === 'function') renderGroups();
        if (typeof saveGroups === 'function') saveGroups();
        if (typeof updateReplyCountDisplay === 'function') updateReplyCountDisplay();
        alert('已添加「' + text + '」到字卡库');
    }
}

// + 按钮打开文件夹（兼容 plusBtn 和 actionBtn）
var plusButton = document.getElementById('plusBtn') || document.getElementById('actionBtn');
if (plusButton) {
    plusButton.onclick = function() {
        var fileInput = document.getElementById('fileInput');
        if (fileInput) fileInput.click();
    };
}

var fileInputElement = document.getElementById('fileInput');
if (fileInputElement) {
    fileInputElement.onchange = function(e) {
        var files = e.target.files;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();
            reader.onload = (function(f) {
                return function(ev) {
                    if (typeof addMessage === 'function') {
                        if (f.type.startsWith('image/')) {
                            addMessage("", true, ev.target.result);
                        } else {
                            addMessage('[文件] ' + f.name, true);
                        }
                    }
                };
            })(file);
            reader.readAsDataURL(file);
        }
        this.value = '';
    };
}

// 获取所有回复
function getAllReplies() {
    var allReplies = [];
    if (typeof userGroups !== 'undefined') {
        for (var g in userGroups) {
            for (var j = 0; j < userGroups[g].length; j++) {
                allReplies.push(userGroups[g][j]);
            }
        }
    }
    return allReplies;
}

// 更新回复数量显示
function updateReplyCountDisplay() { 
    var span = document.getElementById('totalReplyCount');
    if (span) span.innerText = getAllReplies().length; 
}

// 骰子按钮点击事件（防止重复绑定）
if (diceBtn && !diceBtn._hasClick) {
    diceBtn._hasClick = true;
    diceBtn.onclick = function() {
        if (typeof addMessage === 'function') {
            addMessage('🎲 我掷出了 ' + (Math.floor(Math.random() * 6) + 1) + ' 点', true);
        }
    };
}

// 加载保存的数据
function loadAllData() {
    var storedChat = localStorage.getItem('chat_messages');
    if (storedChat) {
        try {
            var msgs = JSON.parse(storedChat);
            chatMessages.length = 0;
            for (var i = 0; i < msgs.length; i++) chatMessages.push(msgs[i]);
        } catch(e) {}
    }
    var storedReply = localStorage.getItem('reply_settings');
    if (storedReply) {
        try {
            var rs = JSON.parse(storedReply);
            replySettings.minDelaySec = rs.minDelaySec || 1;
            replySettings.maxDelaySec = rs.maxDelaySec || 300;
            replySettings.activeDelayMin = rs.activeDelayMin || 5;
        } catch(e) {}
    }
    var storedPat = localStorage.getItem('pat_message');
    if (storedPat) patMessage = storedPat;
    if (typeof loadGroups === 'function') loadGroups();
    if (typeof loadLeisureData === 'function') loadLeisureData();
    renderChat();
    updateReplyCountDisplay();
}

// 调用加载
loadAllData();
