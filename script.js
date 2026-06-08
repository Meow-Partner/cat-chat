// ========== script.js · 2026-06-09 04:00:00 ==========
window.CatChat = window.CatChat || {};

// 页面切换函数
window.CatChat.showChatPage = function() {
    document.getElementById('chat-page').classList.add('active');
    document.getElementById('leisure-page').classList.remove('active');
    document.getElementById('his-space-page').classList.remove('active');
    document.getElementById('my-space-page').classList.remove('active');
};
window.CatChat.showLeisurePage = function() {
    document.getElementById('chat-page').classList.remove('active');
    document.getElementById('leisure-page').classList.add('active');
    document.getElementById('his-space-page').classList.remove('active');
    document.getElementById('my-space-page').classList.remove('active');
};
window.CatChat.showHisSpace = function() {
    document.getElementById('chat-page').classList.remove('active');
    document.getElementById('leisure-page').classList.remove('active');
    document.getElementById('his-space-page').classList.add('active');
    document.getElementById('my-space-page').classList.remove('active');
};
window.CatChat.showMySpace = function() {
    document.getElementById('chat-page').classList.remove('active');
    document.getElementById('leisure-page').classList.remove('active');
    document.getElementById('his-space-page').classList.remove('active');
    document.getElementById('my-space-page').classList.add('active');
};

document.addEventListener('DOMContentLoaded', function() {
    // 绑定头像切换
    const starSpaceBtn = document.getElementById('starSpaceBtn');
    const mySpaceBtn = document.getElementById('mySpaceBtn');
    if(starSpaceBtn) starSpaceBtn.onclick = window.CatChat.showHisSpace;
    if(mySpaceBtn) mySpaceBtn.onclick = window.CatChat.showMySpace;
    
    // 底部输入栏
    const msgInput = document.getElementById('msgInput');
    const actionBtn = document.getElementById('actionBtn');
    const fileInput = document.getElementById('fileInput');
    const diceBtn = document.getElementById('diceBtn');
    
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
    
    // 泡泡：单击回聊天，双击进休闲
    const leisureBubbleBtn = document.getElementById('leisureBubbleBtn');
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
    
    // 通用表情面板
    const emojiBtn = document.getElementById('openEmojiBtn');
    const bottomBar = document.querySelector('.bottom-bar');
    const chatArea = document.querySelector('.chat-area');
    
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
    
    // 聊天语录面板
    const stickerBtn = document.getElementById('openStickerBtn1');
    if(stickerBtn && bottomBar && chatArea) {
        stickerBtn.innerText = '💬 聊天语录';
        const stickerBtn2 = document.getElementById('openStickerBtn2');
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
                            window.CatChat.chat.addMessage(text, true);
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
    
    if(typeof loadAllData === 'function') loadAllData();
    window.CatChat.showChatPage();
    console.log('✅ script.js 已加载');
});
