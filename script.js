// ========== script.js · 2026-06-09 最终完整版 ==========
window.CatChat = window.CatChat || {};

// 页面切换函数
window.CatChat.showChatPage = function() {
    const pages = ['chat-page', 'leisure-page', 'his-space-page', 'my-space-page'];
    pages.forEach(id => { const el = document.getElementById(id); if(el) el.classList.remove('active'); });
    const chatPage = document.getElementById('chat-page');
    if(chatPage) chatPage.classList.add('active');
};
window.CatChat.showLeisurePage = function() {
    const pages = ['chat-page', 'leisure-page', 'his-space-page', 'my-space-page'];
    pages.forEach(id => { const el = document.getElementById(id); if(el) el.classList.remove('active'); });
    const leisurePage = document.getElementById('leisure-page');
    if(leisurePage) leisurePage.classList.add('active');
};
window.CatChat.showHisSpace = function() {
    const pages = ['chat-page', 'leisure-page', 'his-space-page', 'my-space-page'];
    pages.forEach(id => { const el = document.getElementById(id); if(el) el.classList.remove('active'); });
    const hisSpace = document.getElementById('his-space-page');
    if(hisSpace) hisSpace.classList.add('active');
};
window.CatChat.showMySpace = function() {
    const pages = ['chat-page', 'leisure-page', 'his-space-page', 'my-space-page'];
    pages.forEach(id => { const el = document.getElementById(id); if(el) el.classList.remove('active'); });
    const mySpace = document.getElementById('my-space-page');
    if(mySpace) mySpace.classList.add('active');
};

document.addEventListener('DOMContentLoaded', function() {
    // 获取元素
    const starSpaceBtn = document.getElementById('starSpaceBtn');
    const mySpaceBtn = document.getElementById('mySpaceBtn');
    const leisureBubbleBtn = document.getElementById('leisureBubbleBtn');
    const msgInput = document.getElementById('msgInput');
    const actionBtn = document.getElementById('actionBtn');
    const fileInput = document.getElementById('fileInput');
    const diceBtn = document.getElementById('diceBtn');
    const emojiBtn = document.getElementById('openEmojiBtn');
    const stickerBtn = document.getElementById('openStickerBtn1');
    const stickerBtn2 = document.getElementById('openStickerBtn2');
    const bottomBar = document.querySelector('.bottom-bar');
    const chatArea = document.querySelector('.chat-area');
    
    // ========== 头像单击切换（原功能） ==========
    if(starSpaceBtn) starSpaceBtn.onclick = window.CatChat.showHisSpace;
    if(mySpaceBtn) mySpaceBtn.onclick = window.CatChat.showMySpace;
    
    // ========== 泡泡：单击回聊天，双击进休闲 ==========
    if(leisureBubbleBtn) {
        let clickTimer = null;
        leisureBubbleBtn.onclick = function() {
            if(clickTimer) {
                clearTimeout(clickTimer);
                clickTimer = null;
                window.CatChat.showLeisurePage();
            } else {
                clickTimer = setTimeout(function() {
                    window.CatChat.showChatPage();
                    clickTimer = null;
                }, 200);
            }
        };
    }
    
    // ========== 底部输入栏 ==========
    function updateActionButton() {
        if(!msgInput || !actionBtn) return;
        const hasText = msgInput.value.trim().length > 0;
        if(hasText) {
            actionBtn.textContent = '发送';
            actionBtn.classList.add('send-mode');
            actionBtn.classList.remove('plus-mode');
        } else {
            actionBtn.textContent = '➕';
            actionBtn.classList.remove('send-mode');
            actionBtn.classList.add('plus-mode');
        }
    }
    
    if(msgInput && actionBtn) {
        msgInput.addEventListener('input', updateActionButton);
        updateActionButton();
        actionBtn.onclick = () => {
            const hasText = msgInput.value.trim().length > 0;
            if(hasText) {
                const text = msgInput.value.trim();
                if(window.CatChat.chat && window.CatChat.chat.addMessage) {
                    window.CatChat.chat.addMessage(text, true);
                }
                msgInput.value = '';
                updateActionButton();
            } else if(fileInput) {
                fileInput.click();
            }
        };
    }
    
    if(diceBtn) {
        diceBtn.onclick = () => {
            const result = Math.floor(Math.random() * 6) + 1;
            if(window.CatChat.chat && window.CatChat.chat.addMessage) {
                window.CatChat.chat.addMessage('🎲 我掷出了 ' + result + ' 点', true);
            }
        };
    }
    
    if(fileInput) {
        fileInput.onchange = (e) => {
            const files = e.target.files;
            for(let file of files) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    if(window.CatChat.chat && window.CatChat.chat.addMessage) {
                        if(file.type.startsWith('image/')) {
                            window.CatChat.chat.addMessage("", true, ev.target.result);
                        } else {
                            window.CatChat.chat.addMessage('[文件] ' + file.name, true);
                        }
                    }
                };
                reader.readAsDataURL(file);
            }
            fileInput.value = '';
        };
    }
    
    // ========== 通用表情面板 ==========
    if(emojiBtn && bottomBar && chatArea) {
        emojiBtn.onclick = () => {
            let panel = document.getElementById('emojiPushPanel');
            if(!panel) {
                panel = document.createElement('div');
                panel.id = 'emojiPushPanel';
                panel.style.cssText = 'background:#f8f8f8; border-top:1px solid #ddd; overflow:hidden; transition:height 0.2s ease; height:0;';
                panel.innerHTML = `
                    <div id="emojiPushGrid" style="display:grid; grid-template-columns:repeat(7,1fr); gap:6px; padding:8px; justify-items:center;"></div>
                    <div style="text-align:center; padding:4px; color:#999; font-size:12px; cursor:pointer;" id="emojiPushClose">关闭</div>
                `;
                bottomBar.parentNode.insertBefore(panel, bottomBar.nextSibling);
                document.getElementById('emojiPushClose').onclick = () => {
                    panel.style.height = '0';
                    setTimeout(() => { if(chatArea) chatArea.scrollTop = chatArea.scrollHeight; }, 50);
                };
                const emojis = ['😊','😂','😍','😭','😡','🥺','👍','❤️','🎉','✨','🌟','💕','😘','😎'];
                const grid = document.getElementById('emojiPushGrid');
                emojis.forEach(e => {
                    const item = document.createElement('div');
                    item.textContent = e;
                    item.style.cssText = 'font-size:28px; cursor:pointer; padding:4px; background:#fff; border-radius:12px; width:40px; text-align:center;';
                    item.onclick = () => {
                        if(window.CatChat.chat && window.CatChat.chat.addMessage) {
                            window.CatChat.chat.addMessage(e, true);
                        }
                        panel.style.height = '0';
                        setTimeout(() => { if(chatArea) chatArea.scrollTop = chatArea.scrollHeight; }, 80);
                    };
                    grid.appendChild(item);
                });
            }
            panel.style.height = '110px';
            setTimeout(() => { if(chatArea) chatArea.scrollTop = chatArea.scrollHeight; }, 50);
        };
    }
    
    // ========== 聊天语录面板 ==========
    if(stickerBtn && bottomBar && chatArea) {
        stickerBtn.innerText = '💬 聊天语录';
        if(stickerBtn2) stickerBtn2.style.display = 'none';
        
        stickerBtn.onclick = () => {
            let panel = document.getElementById('stickerPanel');
            if(!panel) {
                panel = document.createElement('div');
                panel.id = 'stickerPanel';
                panel.style.cssText = 'background:#f8f8f8; border-top:1px solid #ddd; overflow:hidden; transition:height 0.25s ease; height:0;';
                panel.innerHTML = `
                    <div id="stickerGrid" style="display:grid; grid-template-columns:repeat(4,1fr); gap:12px; padding:12px; justify-items:center;"></div>
                    <div style="text-align:center; padding:6px; color:#999; font-size:12px; cursor:pointer;" id="stickerClose">关闭</div>
                `;
                bottomBar.parentNode.insertBefore(panel, bottomBar.nextSibling);
                document.getElementById('stickerClose').onclick = () => {
                    panel.style.height = '0';
                    setTimeout(() => { if(chatArea) chatArea.scrollTop = chatArea.scrollHeight; }, 50);
                };
                const stickerList = ['么么哒', '爱你', '好', '嗯', '抱抱', '亲亲', '晚安', '想你'];
                const grid = document.getElementById('stickerGrid');
                stickerList.forEach(text => {
                    const item = document.createElement('div');
                    item.textContent = text;
                    item.style.cssText = 'background:#fff; border:2px solid #333; width:70px; height:70px; display:flex; align-items:center; justify-content:center; font-weight:bold; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,0.1);';
                    const len = text.length;
                    if(len === 1) item.style.fontSize = '32px';
                    else if(len === 2) item.style.fontSize = '28px';
                    else if(len === 3) item.style.fontSize = '24px';
                    else item.style.fontSize = '18px';
                    item.onclick = () => {
                        if(window.CatChat.chat && window.CatChat.chat.addMessage) {
                            window.CatChat.chat.addMessage(text, true, null, { isSticker: true });
                        }
                        panel.style.height = '0';
                        setTimeout(() => { if(chatArea) chatArea.scrollTop = chatArea.scrollHeight; }, 80);
                    };
                    grid.appendChild(item);
                });
            }
            panel.style.height = '180px';
            setTimeout(() => { if(chatArea) chatArea.scrollTop = chatArea.scrollHeight; }, 50);
        };
    }
    
    // ========== 双击头像详细页面 ==========
    function showDetailPage(title, items) {
        let overlay = document.getElementById('detailOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'detailOverlay';
            overlay.style.cssText = 'position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.8); z-index:10000; display:flex; align-items:center; justify-content:center;';
            document.body.appendChild(overlay);
        }
        overlay.innerHTML = `
            <div style="background:white; border-radius:20px; width:300px; max-height:80%; overflow-y:auto; padding:20px; text-align:center;">
                <h3 style="margin-bottom:15px;">${title}</h3>
                <div style="margin-top:10px;">
                    ${items.map(item => `<div style="padding:12px; margin:8px 0; background:#f0d5e5; border-radius:12px; cursor:pointer;" onclick="alert('「${item}」功能开发中')">${item}</div>`).join('')}
                </div>
                <button onclick="document.getElementById('detailOverlay').style.display='none'" style="margin-top:15px; padding:8px 20px; background:#e29bc2; border:none; border-radius:20px; color:white;">返回</button>
            </div>
        `;
        overlay.style.display = 'flex';
    }
    
    if (starSpaceBtn) {
        let starTimer = null;
        starSpaceBtn.onclick = function(e) {
            if (starTimer) {
                clearTimeout(starTimer);
                starTimer = null;
                showDetailPage('⭐ 沈星回的详细空间', ['📔 他的日记', '🌐 他的朋友圈', '❤️ 他的收藏', '📚 他的字卡', '⚙️ 他的设置']);
                e.stopPropagation();
            } else {
                starTimer = setTimeout(() => {
                    window.CatChat.showHisSpace();
                    starTimer = null;
                }, 200);
            }
        };
    }
    
    if (mySpaceBtn) {
        let myTimer = null;
        mySpaceBtn.onclick = function(e) {
            if (myTimer) {
                clearTimeout(myTimer);
                myTimer = null;
                showDetailPage('🐱 我的详细空间', ['📔 我的日记', '🌐 我的朋友圈', '❤️ 我的收藏', '📦 我的数据', '⚙️ 我的设置']);
                e.stopPropagation();
            } else {
                myTimer = setTimeout(() => {
                    window.CatChat.showMySpace();
                    myTimer = null;
                }, 200);
            }
        };
    }
    
    // ========== 顶部栏长按/双击切换模式（仅空白区域生效） ==========
    const topBar = document.querySelector('.new-top-bar');
    if (topBar) {
        const originalHTML = topBar.innerHTML;
        let isSimpleMode = localStorage.getItem('topBarSimpleMode') !== 'false';
        let inactivityTimer = null;
        
        function resetInactivityTimer() {
            if (inactivityTimer) clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                if (!isSimpleMode) {
                    isSimpleMode = true;
                    localStorage.setItem('topBarSimpleMode', 'true');
                    updateTopBarMode();
                }
            }, 5000);
        }
        
        function updateTopBarMode() {
            if (isSimpleMode) {
                const note = localStorage.getItem('partnerNote') || '星回';
                topBar.innerHTML = `
                    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%;">
                        <div style="display:flex; align-items:center; gap:4px;">
                            <span style="font-size:17px; font-weight:500; color:#2c3e50;">${note}</span>
                            <span style="font-size:10px; color:#07c160;">● 在线</span>
                        </div>
                        <span id="simpleModeStatus" style="font-size:10px; color:#e29bc2; margin-top:2px; opacity:0;">对方正在输入中...</span>
                    </div>
                `;
                topBar.style.justifyContent = 'center';
                topBar.style.padding = '6px 16px';
            } else {
                topBar.innerHTML = originalHTML;
            }
            resetInactivityTimer();
        }
        
        // 监听用户操作重置计时器
        function onUserAction() { resetInactivityTimer(); }
        document.addEventListener('click', onUserAction);
        document.addEventListener('keydown', onUserAction);
        if (msgInput) msgInput.addEventListener('input', onUserAction);
        
        // 长按（仅空白区域）
        let pressTimer = null;
        topBar.addEventListener('mousedown', (e) => {
            if (e.target.closest('.bubble-btn, .icon-btn, .avatar-small, .name')) return;
            pressTimer = setTimeout(() => {
                isSimpleMode = true;
                localStorage.setItem('topBarSimpleMode', 'true');
                updateTopBarMode();
                pressTimer = null;
            }, 500);
        });
        topBar.addEventListener('mouseup', () => clearTimeout(pressTimer));
        topBar.addEventListener('mouseleave', () => clearTimeout(pressTimer));
        
        // 双击（仅空白区域）
        let clickTimer = null;
        topBar.addEventListener('click', (e) => {
            if (e.target.closest('.bubble-btn, .icon-btn, .avatar-small, .name')) return;
            if (clickTimer) {
                clearTimeout(clickTimer);
                clickTimer = null;
                isSimpleMode = false;
                localStorage.setItem('topBarSimpleMode', 'false');
                updateTopBarMode();
            } else {
                clickTimer = setTimeout(() => {
                    clickTimer = null;
                }, 200);
            }
        });
        
        updateTopBarMode();
    }
    
    // ========== 对方自动回复（永久集成） ==========
    if (window.CatChat.chat) {
        const originalAdd = window.CatChat.chat.addMessage;
        window.CatChat.chat.addMessage = function(text, isMe, imgSrc, options) {
            originalAdd.call(this, text, isMe, imgSrc, options);
            
            if (isMe && text && text.trim()) {
                // 显示正在输入中
                const chatAreaEl = document.querySelector('.chat-area');
                if (chatAreaEl) {
                    const typingDiv = document.createElement('div');
                    typingDiv.className = 'typing-indicator';
                    typingDiv.innerText = '对方正在输入中...';
                    typingDiv.style.cssText = 'color:#999; font-size:12px; padding:4px 12px; margin-bottom:4px;';
                    chatAreaEl.appendChild(typingDiv);
                    chatAreaEl.scrollTop = chatAreaEl.scrollHeight;
                    
                    setTimeout(() => {
                        typingDiv.remove();
                        const replies = ['嗯', '好的', '哈哈', '然后呢？', '真的吗？', '继续', '😊', '我也觉得'];
                        const randomReply = replies[Math.floor(Math.random() * replies.length)];
                        originalAdd.call(this, randomReply, false);
                    }, 1000 + Math.random() * 1000);
                }
            }
        };
    }
    
    if(typeof loadAllData === 'function') loadAllData();
    window.CatChat.showChatPage();
    console.log('✅ 完整版 script.js 已加载');
});
