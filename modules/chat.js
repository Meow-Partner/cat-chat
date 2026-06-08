// ========== modules/chat.js · 2026-06-09 01:35:00 ==========
(function() {
    if (window.CatChat && window.CatChat.chat) {
        console.log('chat 模块已加载，跳过');
        return;
    }
    
    window.CatChat = window.CatChat || {};
    
    let chatMessages = [];
    let replySettings = { minDelaySec: 1, maxDelaySec: 300, activeDelayMin: 5 };
    
    const chatContainer = document.getElementById('chatArea');
    const msgInput = document.getElementById('msgInput');
    
    function saveChatData() {
        localStorage.setItem('chat_messages', JSON.stringify(chatMessages));
        localStorage.setItem('reply_settings', JSON.stringify(replySettings));
    }
    
    function loadChatData() {
        const stored = localStorage.getItem('chat_messages');
        if (stored) {
            try { chatMessages = JSON.parse(stored); } catch(e) {}
        }
        const storedReply = localStorage.getItem('reply_settings');
        if (storedReply) {
            try { replySettings = JSON.parse(storedReply); } catch(e) {}
        }
        renderChat();
    }
    
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
            
            // 如果是自己发的短消息（≤4字），应用卡片样式
            if (msg.isMe && msg.text && msg.text.length <= 4) {
                bubble.classList.add('emoji-card');
                const len = msg.text.length;
                if (len === 1) bubble.style.fontSize = '32px';
                else if (len === 2) bubble.style.fontSize = '28px';
                else if (len === 3) bubble.style.fontSize = '24px';
                else bubble.style.fontSize = '20px';
            }
            
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
    
    function addMessage(text, isMe, imgSrc) {
        chatMessages.push({ text: text, time: new Date().toLocaleTimeString(), isMe: isMe, imgSrc: imgSrc || null });
        saveChatData();
        renderChat();
    }
    
    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
    
    window.CatChat.chat = {
        messages: chatMessages,
        addMessage: addMessage,
        renderChat: renderChat,
        loadChatData: loadChatData,
        saveChatData: saveChatData
    };
    
    window.addMessage = addMessage;
    window.renderChat = renderChat;
    window.loadAllData = loadChatData;
    
    loadChatData();
    
    console.log('✅ chat 模块已加载');
})();
