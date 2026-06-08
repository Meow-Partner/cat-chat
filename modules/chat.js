// ========== modules/chat.js · 2026-06-08 16:10:00 ==========
(function() {
    if (window.CatChat && window.CatChat.chat) {
        console.log('chat 模块已加载，跳过');
        return;
    }
    
    window.CatChat = window.CatChat || {};
    
    // 聊天数据
    let chatMessages = [];
    let pendingReplyTimer = null;
    let activeMsgTimer = null;
    let editingRecalledMsg = null;
    let typingTimeout = null;
    let inputReplyTimer = null;
    let lastChatTime = Date.now();
    
    // 回复设置
    let replySettings = { minDelaySec: 1, maxDelaySec: 300, activeDelayMin: 5 };
    
    // DOM 元素
    const chatContainer = document.getElementById('chatArea');
    const msgInput = document.getElementById('msgInput');
    const typingStatusSpan = document.getElementById('typingStatus');
    
    // 保存数据
    function saveChatData() {
        localStorage.setItem('chat_messages', JSON.stringify(chatMessages));
        localStorage.setItem('reply_settings', JSON.stringify(replySettings));
    }
    
    // 加载数据
    function loadChatData() {
        const stored = localStorage.getItem('chat_messages');
        if (stored) {
            try {
                chatMessages = JSON.parse(stored);
            } catch(e) {}
        }
        const storedReply = localStorage.getItem('reply_settings');
        if (storedReply) {
            try {
                replySettings = JSON.parse(storedReply);
            } catch(e) {}
        }
        renderChat();
    }
    
    // 渲染聊天
    function renderChat() {
        if (!chatContainer) return;
        chatContainer.innerHTML = '';
        for (let i = 0; i < chatMessages.length; i++) {
            const msg = chatMessages[i];
            const row = document.createElement('div');
            row.className = 'message-row ' + (msg.isMe ? 'me' : 'other');
            const avatar = document.createElement('div');
            avatar.className = 'msg-avatar';
            avatar.innerText = msg.isMe ? '🐱' : '⭐';
            const contentDiv = document.createElement('div');
            contentDiv.className = 'msg-content';
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.innerHTML = '<div>' + escapeHtml(msg.text) + '</div>';
            if (msg.imgSrc) bubble.innerHTML += '<img src="' + msg.imgSrc + '" style="max-width:150px;border-radius:12px;margin-top:6px;">';
            contentDiv.appendChild(bubble);
            if (msg.isMe) {
                row.appendChild(contentDiv);
                row.appendChild(avatar);
            } else {
                row.appendChild(avatar);
                row.appendChild(contentDiv);
            }
            chatContainer.appendChild(row);
        }
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // 添加消息
    function addMessage(text, isMe, imgSrc) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString();
        chatMessages.push({ text: text, time: timeStr, isMe: isMe, imgSrc: imgSrc || null });
        saveChatData();
        renderChat();
        updateLastChatTime();
        
        // 如果不是用户消息且不是自己发的，可以触发主动回复逻辑（可选）
        if (!isMe) {
            // 这里可以调用回复逻辑
        }
    }
    
    function updateLastChatTime() {
        lastChatTime = Date.now();
        resetActiveMessageTimer();
    }
    
    function resetActiveMessageTimer() {
        if (activeMsgTimer) clearTimeout(activeMsgTimer);
        activeMsgTimer = setTimeout(function() {
            // 主动消息逻辑（可选）
        }, (replySettings.activeDelayMin || 5) * 60 * 1000);
    }
    
    // 输入中提示
    function onUserTyping() {
        if (typingStatusSpan) {
            typingStatusSpan.innerText = "对方正在输入中...";
        }
        if (typingTimeout) clearTimeout(typingTimeout);
        typingTimeout = setTimeout(function() {
            if (typingStatusSpan) typingStatusSpan.innerText = "";
        }, 1500);
    }
    
    if (msgInput) {
        msgInput.addEventListener('input', onUserTyping);
    }
    
    // 导出到命名空间
    window.CatChat.chat = {
        messages: chatMessages,
        addMessage: addMessage,
        renderChat: renderChat,
        loadChatData: loadChatData,
        saveChatData: saveChatData,
        getReplySettings: function() { return replySettings; },
        updateLastChatTime: updateLastChatTime
    };
    
    // 兼容旧全局调用
    window.addMessage = addMessage;
    window.renderChat = renderChat;
    window.loadAllData = function() {
        if (window.CatChat.card) window.CatChat.card.loadCardData();
        if (window.CatChat.leisure) window.CatChat.leisure.loadLeisureData();
        loadChatData();
    };
    
    // 自动加载数据
    loadChatData();
    
    console.log('✅ chat 模块已加载');
})();
