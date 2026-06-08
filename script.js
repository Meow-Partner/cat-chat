// ========== script.js · 2026-06-08 21:00:00 ==========
window.CatChat = window.CatChat || {};

// 页面切换
window.CatChat.showChatPage = function() {
    const pages = ['chat-page', 'leisure-page', 'his-space-page', 'my-space-page'];
    pages.forEach(id => { const el = document.getElementById(id); if (el) el.classList.remove('active'); });
    const chatPage = document.getElementById('chat-page');
    if (chatPage) chatPage.classList.add('active');
};

window.CatChat.showLeisurePage = function() {
    const pages = ['chat-page', 'leisure-page', 'his-space-page', 'my-space-page'];
    pages.forEach(id => { const el = document.getElementById(id); if (el) el.classList.remove('active'); });
    const leisurePage = document.getElementById('leisure-page');
    if (leisurePage) leisurePage.classList.add('active');
};

window.CatChat.showHisSpace = function() {
    const pages = ['chat-page', 'leisure-page', 'his-space-page', 'my-space-page'];
    pages.forEach(id => { const el = document.getElementById(id); if (el) el.classList.remove('active'); });
    const hisSpace = document.getElementById('his-space-page');
    if (hisSpace) hisSpace.classList.add('active');
};

window.CatChat.showMySpace = function() {
    const pages = ['chat-page', 'leisure-page', 'his-space-page', 'my-space-page'];
    pages.forEach(id => { const el = document.getElementById(id); if (el) el.classList.remove('active'); });
    const mySpace = document.getElementById('my-space-page');
    if (mySpace) mySpace.classList.add('active');
};

document.addEventListener('DOMContentLoaded', function() {
    // 顶部栏按钮
    const starSpaceBtn = document.getElementById('starSpaceBtn');
    const mySpaceBtn = document.getElementById('mySpaceBtn');
    const leisureBubbleBtn = document.getElementById('leisureBubbleBtn');
    
    if (starSpaceBtn) starSpaceBtn.onclick = window.CatChat.showHisSpace;
    if (mySpaceBtn) mySpaceBtn.onclick = window.CatChat.showMySpace;
    
    // 泡泡：单击聊天，双击休闲
    if (leisureBubbleBtn) {
        let clickTimer = null;
        leisureBubbleBtn.onclick = function() {
            if (clickTimer) {
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
    
    // 底部输入栏
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
        updateActionButton();
        actionBtn.onclick = () => {
            const hasText = msgInput.value.trim().length > 0;
            if (hasText) {
                const text = msgInput.value.trim();
                if (window.CatChat.chat && window.CatChat.chat.addMessage) {
                    window.CatChat.chat.addMessage(text, true);
                }
                msgInput.value = '';
                updateActionButton();
            } else if (fileInput) {
                fileInput.click();
            }
        };
    }
    
    if (diceBtn) {
        diceBtn.onclick = () => {
            const result = Math.floor(Math.random() * 6) + 1;
            const msg = '🎲 我掷出了 ' + result + ' 点';
            if (window.CatChat.chat && window.CatChat.chat.addMessage) {
                window.CatChat.chat.addMessage(msg, true);
            }
        };
    }
    
    if (emojiBtn) {
        emojiBtn.onclick = () => {
            if (window.CatChat.chat && window.CatChat.chat.addMessage) {
                window.CatChat.chat.addMessage('😊', true);
            }
        };
    }
    
    if (fileInput) {
        fileInput.onchange = (e) => {
            const files = e.target.files;
            for (let file of files) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    if (window.CatChat.chat && window.CatChat.chat.addMessage) {
                        if (file.type.startsWith('image/')) {
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
    
    // 他的空间 - 个人设置
    const saveHisSettingsBtn = document.getElementById('saveHisSettingsBtn');
    if (saveHisSettingsBtn) {
        saveHisSettingsBtn.onclick = () => {
            const partnerNote = document.getElementById('partnerNoteInput')?.value || '沈星回';
            const partnerSignature = document.getElementById('partnerSignatureInput')?.value || '';
            localStorage.setItem('partnerNote', partnerNote);
            localStorage.setItem('partnerSignature', partnerSignature);
            document.getElementById('partnerName').innerText = partnerNote;
            alert('保存成功');
        };
        document.getElementById('partnerNoteInput').value = localStorage.getItem('partnerNote') || '沈星回';
        document.getElementById('partnerSignatureInput').value = localStorage.getItem('partnerSignature') || '';
    }
    
    // 我的空间 - 个人设置
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    if (saveProfileBtn) {
        saveProfileBtn.onclick = () => {
            const myName = document.getElementById('myNameInput')?.value || '我';
            const myNickname = document.getElementById('myNicknameInput')?.value || '';
            const mySignature = document.getElementById('mySignatureInput')?.value || '';
            localStorage.setItem('myName', myName);
            localStorage.setItem('myNickname', myNickname);
            localStorage.setItem('mySignature', mySignature);
            document.getElementById('myNickname').innerText = myName;
            alert('保存成功');
        };
        document.getElementById('myNameInput').value = localStorage.getItem('myName') || '我';
        document.getElementById('myNicknameInput').value = localStorage.getItem('myNickname') || '';
        document.getElementById('mySignatureInput').value = localStorage.getItem('mySignature') || '';
        document.getElementById('myNickname').innerText = localStorage.getItem('myName') || '我';
    }
    
    // 字卡管理按钮
    const addGroupBtn = document.getElementById('addGroupBtn');
    const updateCardsBtn = document.getElementById('updateCardsBtn');
    const addMultiLineBtn = document.getElementById('addMultiLineBtn');
    const clearTextareaBtn = document.getElementById('clearTextareaBtn');
    const saveReplySettings = document.getElementById('saveReplySettings');
    
    if (addGroupBtn) {
        addGroupBtn.onclick = () => {
            const newName = prompt('请输入新分组名称');
            if (newName && newName.trim() && window.userGroups && !window.userGroups[newName.trim()]) {
                window.userGroups[newName.trim()] = [];
                if (window.CatChat.card) window.CatChat.card.saveCardData();
                if (window.renderGroups) window.renderGroups();
            }
        };
    }
    
    if (updateCardsBtn) {
        updateCardsBtn.onclick = async () => {
            const DEFAULT_CARDS_URL = 'https://raw.githubusercontent.com/Meow-Partner/cat-chat/main/default_cards.json';
            try {
                const response = await fetch(DEFAULT_CARDS_URL);
                const remoteCards = await response.json();
                let totalAdded = 0;
                for (let groupName in remoteCards) {
                    if (!window.userGroups[groupName]) window.userGroups[groupName] = [];
                    for (let card of remoteCards[groupName]) {
                        if (!window.userGroups[groupName].some(c => (c.replys ? c.replys[0] : c) === card)) {
                            window.userGroups[groupName].push({ replys: [card] });
                            totalAdded++;
                        }
                    }
                }
                if (totalAdded > 0) {
                    if (window.CatChat.card) window.CatChat.card.saveCardData();
                    if (window.renderGroups) window.renderGroups();
                    alert(`成功添加 ${totalAdded} 条字卡`);
                } else {
                    alert('字卡已是最新，无需更新');
                }
            } catch(e) {
                alert('更新失败：网络错误\n' + e.message);
            }
        };
    }
    
    if (addMultiLineBtn) {
        addMultiLineBtn.onclick = () => {
            const ta = document.getElementById('cardBulkInput');
            if (!ta) return;
            const lines = ta.value.split(/\r?\n/).filter(l => l.trim().length > 0);
            if (lines.length === 0) return alert('没有有效内容');
            const groupName = prompt('选择分组', '默认字卡');
            if (groupName && window.userGroups) {
                if (!window.userGroups[groupName]) window.userGroups[groupName] = [];
                for (let line of lines) {
                    window.userGroups[groupName].push({ replys: [line] });
                }
                if (window.CatChat.card) window.CatChat.card.saveCardData();
                if (window.renderGroups) window.renderGroups();
                alert(`添加成功`);
            }
        };
    }
    
    if (clearTextareaBtn) {
        clearTextareaBtn.onclick = () => {
            const ta = document.getElementById('cardBulkInput');
            if (ta) ta.value = '';
            alert('已清空');
        };
    }
    
    if (saveReplySettings) {
        saveReplySettings.onclick = () => {
            const minDelaySec = document.getElementById('minDelaySec')?.value || 1;
            const maxDelaySec = document.getElementById('maxDelaySec')?.value || 300;
            const activeDelayMin = document.getElementById('activeDelayMin')?.value || 5;
            if (window.CatChat.chat && window.CatChat.chat.setReplySettings) {
                window.CatChat.chat.setReplySettings({ minDelaySec, maxDelaySec, activeDelayMin });
            }
            alert('保存成功');
        };
    }
    
    // 数据管理按钮
    const importDataBtn = document.getElementById('importDataBtn');
    const exportDataBtn = document.getElementById('exportFullData');
    const clearAllChats = document.getElementById('clearAllChats');
    const resetAllData = document.getElementById('resetAllData');
    
    if (importDataBtn) importDataBtn.onclick = () => alert('导入数据功能开发中');
    if (exportDataBtn) exportDataBtn.onclick = () => alert('导出数据功能开发中');
    if (clearAllChats) clearAllChats.onclick = () => {
        if (confirm('清空所有聊天记录？')) {
            if (window.CatChat.chat) window.CatChat.chat.messages = [];
            alert('聊天记录已清空');
        }
    };
    if (resetAllData) resetAllData.onclick = () => {
        if (confirm('恢复出厂设置？所有数据将丢失！')) {
            localStorage.clear();
            location.reload();
        }
    };
    
    window.CatChat.showChatPage();

        // ========== 表情面板 ==========
    const emojiBtn = document.getElementById('openEmojiBtn');
    if (emojiBtn) {
        emojiBtn.onclick = () => {
            showEmojiPanel();
        };
    }
    
    function showEmojiPanel() {
        const emojis = ['😊', '😂', '😍', '😭', '😡', '🥺', '👍', '❤️', '🎉', '✨', '🌟', '💕', '😘', '😎', '🤔', '🙏', '💪', '🐱', '🌸', '🍃', '🍎', '⚡', '⭐', '☕', '🎵', '💤', '👋', '🤗'];
        
        let panel = document.getElementById('emojiPanel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'emojiPanel';
            panel.className = 'emoji-panel';
            panel.innerHTML = `
                <div class="emoji-header">选择表情</div>
                <div class="emoji-grid" id="emojiGrid"></div>
                <div class="emoji-close">关闭</div>
            `;
            document.body.appendChild(panel);
            
            panel.querySelector('.emoji-close').onclick = () => {
                panel.classList.remove('show');
            };
            
            document.addEventListener('click', (e) => {
                if (panel.classList.contains('show') && !panel.contains(e.target) && e.target !== emojiBtn) {
                    panel.classList.remove('show');
                }
            });
        }
        
        const grid = panel.querySelector('#emojiGrid');
        grid.innerHTML = '';
        emojis.forEach(emoji => {
            const item = document.createElement('div');
            item.className = 'emoji-item';
            item.textContent = emoji;
            item.onclick = () => {
                if (window.CatChat.chat && window.CatChat.chat.addMessage) {
                    window.CatChat.chat.addMessage(emoji, true);
                }
                panel.classList.remove('show');
            };
            grid.appendChild(item);
        });
        
        panel.classList.add('show');
    }
    
    // ========== 本地字卡初始化（不联网） ==========
    function initLocalDefaultCards() {
        if (typeof DEFAULT_CARDS_LIST !== 'undefined' && window.userGroups) {
            const groupName = '系统字卡';
            if (!window.userGroups[groupName]) {
                window.userGroups[groupName] = [];
            }
            let totalAdded = 0;
            for (let card of DEFAULT_CARDS_LIST) {
                if (!window.userGroups[groupName].some(c => (c.replys ? c.replys[0] : c) === card)) {
                    window.userGroups[groupName].push({ replys: [card] });
                    totalAdded++;
                }
            }
            if (totalAdded > 0) {
                if (window.CatChat.card) window.CatChat.card.saveCardData();
                if (window.renderGroups) window.renderGroups();
                console.log(`本地初始化：添加了 ${totalAdded} 条系统字卡`);
            }
        }
    }
    
    // 延迟执行，确保其他模块加载完成
    setTimeout(() => {
        initLocalDefaultCards();
    }, 500);

    // 表情面板（使用已有的 emojiBtn，不重复声明）
    if (typeof emojiBtn !== 'undefined' && emojiBtn) {
        emojiBtn.onclick = () => {
            const emojis = ['😊', '😂', '😍', '😭', '😡', '🥺', '👍', '❤️', '🎉', '✨', '🌟', '💕', '😘', '😎', '🤔', '🙏', '💪', '🐱', '🌸', '🍃'];
            let panel = document.getElementById('emojiPanel');
            if (!panel) {
                panel = document.createElement('div');
                panel.id = 'emojiPanel';
                panel.innerHTML = `<div style="background:white;position:fixed;bottom:0;left:0;right:0;border-radius:20px 20px 0 0;padding:12px;z-index:1000;transform:translateY(100%);transition:transform 0.3s">
                    <div style="text-align:center;padding:10px;font-weight:bold">选择表情</div>
                    <div id="emojiGrid" style="display:grid;grid-template-columns:repeat(7,1fr);gap:10px;padding:12px;max-height:300px;overflow-y:auto"></div>
                    <div style="text-align:center;padding:10px;color:#999;cursor:pointer" id="closeEmojiPanel">关闭</div>
                </div>`;
                document.body.appendChild(panel);
                document.getElementById('closeEmojiPanel').onclick = () => { panel.style.transform = 'translateY(100%)'; };
            }
            const grid = document.getElementById('emojiGrid');
            grid.innerHTML = '';
            emojis.forEach(emoji => {
                const item = document.createElement('div');
                item.textContent = emoji;
                item.style.cssText = 'font-size:32px;text-align:center;cursor:pointer;padding:8px';
                item.onclick = () => {
                    if (window.CatChat.chat && window.CatChat.chat.addMessage) window.CatChat.chat.addMessage(emoji, true);
                    panel.style.transform = 'translateY(100%)';
                };
                grid.appendChild(item);
            });
            panel.style.transform = 'translateY(0)';
        };
    }

// ========== script.js 追加部分 · 2026-06-09 02:00:00 ==========

    // ========== 通用表情面板 ==========
    // 注意：emojiBtn 已经在前面声明过了，这里直接用，不要重新 const
    const bottomBar = document.querySelector('.bottom-bar');
    const chatArea = document.querySelector('.chat-area');
    
    if (typeof emojiBtn !== 'undefined' && emojiBtn && bottomBar && chatArea) {
        emojiBtn.onclick = () => {
            let panel = document.getElementById('emojiPushPanel');
            if (!panel) {
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
                        if (window.CatChat.chat && window.CatChat.chat.addMessage) {
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

    // 后面的泡泡和聊天语录代码保持不变...

    // ========== 泡泡：单击回聊天，双击进休闲 ==========
    const leisureBubbleBtn = document.getElementById('leisureBubbleBtn');
    if (leisureBubbleBtn) {
        let clickTimer = null;
        leisureBubbleBtn.onclick = function() {
            if (clickTimer) {
                clearTimeout(clickTimer);
                clickTimer = null;
                if (window.CatChat.showLeisurePage) window.CatChat.showLeisurePage();
            } else {
                clickTimer = setTimeout(function() {
                    if (window.CatChat.showChatPage) window.CatChat.showChatPage();
                    clickTimer = null;
                }, 200);
            }
        };
    }

    // ========== 聊天语录面板（合并猫猫搭档） ==========
    const stickerBtn = document.getElementById('openStickerBtn1');
    if (stickerBtn && bottomBar && chatArea) {
        stickerBtn.innerText = '💬 聊天语录';
        const stickerBtn2 = document.getElementById('openStickerBtn2');
        if (stickerBtn2) stickerBtn2.style.display = 'none';
        
        stickerBtn.onclick = () => {
            let panel = document.getElementById('stickerPanel');
            if (!panel) {
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
                    if (len === 1) item.style.fontSize = '32px';
                    else if (len === 2) item.style.fontSize = '28px';
                    else if (len === 3) item.style.fontSize = '24px';
                    else item.style.fontSize = '18px';
                    
                    item.onclick = () => {
                        if (window.CatChat.chat && window.CatChat.chat.addMessage) {
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
    
    console.log('✅ script.js 已加载');
});
