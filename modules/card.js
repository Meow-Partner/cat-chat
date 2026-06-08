// ========== modules/card.js · 2026-06-09 最终版 ==========
(function() {
    if (window.CatChat && window.CatChat.card) {
        console.log('card 模块已加载，跳过');
        return;
    }
    
    window.CatChat = window.CatChat || {};
    
    let userGroups = {};
    let groupLocks = {};
    let groupDedup = {};
    let systemGroupName = '系统字卡';
    let systemCardsEnabled = true;
    
    function saveCardData() {
        localStorage.setItem('userGroups', JSON.stringify(userGroups));
        localStorage.setItem('groupLocks', JSON.stringify(groupLocks));
        localStorage.setItem('groupDedup', JSON.stringify(groupDedup));
        localStorage.setItem('systemCardsEnabled', systemCardsEnabled);
        updateReplyCountDisplay();
    }
    
    function loadCardData() {
        const storedGroups = localStorage.getItem('userGroups');
        if (storedGroups) {
            try { userGroups = JSON.parse(storedGroups); } catch(e) {}
        }
        const storedLocks = localStorage.getItem('groupLocks');
        if (storedLocks) {
            try { groupLocks = JSON.parse(storedLocks); } catch(e) {}
        }
        const storedDedup = localStorage.getItem('groupDedup');
        if (storedDedup) {
            try { groupDedup = JSON.parse(storedDedup); } catch(e) {}
        }
        const storedEnabled = localStorage.getItem('systemCardsEnabled');
        if (storedEnabled !== null) systemCardsEnabled = storedEnabled === 'true';
        
        // 初始化系统字卡分组 - 加载全部 DEFAULT_CARDS_LIST
        if (!userGroups[systemGroupName]) {
            userGroups[systemGroupName] = [];
            if (typeof DEFAULT_CARDS_LIST !== 'undefined') {
                // 加载全部，不截取
                for (let c of DEFAULT_CARDS_LIST) {
                    userGroups[systemGroupName].push({ replys: [c] });
                }
            }
        }
        
        renderGroups();
        updateReplyCountDisplay();
    }
    
    function renderGroups() {
        const container = document.getElementById('groupsContainer');
        if (!container) return;
        
        let html = '';
        for (let groupName in userGroups) {
            const cards = userGroups[groupName];
            const isSystem = (groupName === systemGroupName);
            const isLocked = groupLocks[groupName] || false;
            
            html += `
                <div class="card-group" data-group="${groupName}" data-system="${isSystem}">
                    <div class="group-header">
                        <span class="group-title">📁 ${groupName} (${cards.length})</span>
                        <div class="group-actions">
                            ${isSystem ? `
                                <label class="system-toggle">
                                    <input type="checkbox" class="system-card-toggle" data-group="${groupName}" ${systemCardsEnabled ? 'checked' : ''}>
                                    <span class="toggle-label-small">启用</span>
                                </label>
                            ` : `
                                <button class="lock-btn" data-group="${groupName}">${isLocked ? '🔒' : '🔓'}</button>
                                <button class="delete-group-btn" data-group="${groupName}">🗑️</button>
                            `}
                        </div>
                    </div>
                    <div class="group-content" style="display: none;">
                        <div class="cards-list">
                            ${cards.map((card, idx) => `
                                <div class="word-card">
                                    <div class="word-text">${escapeHtml(card.replys ? card.replys[0] : card)}</div>
                                    <button class="delete-card-btn" data-group="${groupName}" data-index="${idx}" ${isSystem && !systemCardsEnabled ? 'disabled' : ''}>删除</button>
                                </div>
                            `).join('')}
                        </div>
                        <div class="add-card-area">
                            <input type="text" class="new-card-input" placeholder="新字卡内容">
                            <button class="add-card-btn" data-group="${groupName}">添加</button>
                        </div>
                    </div>
                </div>
            `;
        }
        container.innerHTML = html;
        
        bindGroupEvents();
        bindCardEvents();
        bindSystemToggleEvents();
    }
    
    function bindGroupEvents() {
        document.querySelectorAll('.group-header').forEach(header => {
            header.onclick = (e) => {
                if (e.target.classList.contains('lock-btn') || 
                    e.target.classList.contains('delete-group-btn') ||
                    e.target.classList.contains('system-card-toggle') ||
                    e.target.classList.contains('toggle-label-small')) return;
                const content = header.parentElement.querySelector('.group-content');
                content.style.display = content.style.display === 'none' ? 'block' : 'none';
            };
            
            let pressTimer = null;
            header.onmousedown = () => {
                pressTimer = setTimeout(() => {
                    const groupName = header.parentElement.getAttribute('data-group');
                    alert(`编辑分组「${groupName}」功能开发中`);
                    pressTimer = null;
                }, 500);
            };
            header.onmouseup = () => { if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; } };
            header.onmouseleave = () => { if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; } };
        });
        
        document.querySelectorAll('.lock-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const groupName = btn.getAttribute('data-group');
                groupLocks[groupName] = !groupLocks[groupName];
                saveCardData();
                renderGroups();
            };
        });
        
        document.querySelectorAll('.delete-group-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const groupName = btn.getAttribute('data-group');
                if (groupName === systemGroupName) {
                    alert('系统字卡不可删除');
                    return;
                }
                if (confirm(`删除分组「${groupName}」？`)) {
                    delete userGroups[groupName];
                    saveCardData();
                    renderGroups();
                }
            };
        });
    }
    
    function bindSystemToggleEvents() {
        document.querySelectorAll('.system-card-toggle').forEach(toggle => {
            toggle.onclick = (e) => {
                e.stopPropagation();
                systemCardsEnabled = toggle.checked;
                saveCardData();
                renderGroups();
            };
        });
    }
    
    function bindCardEvents() {
        document.querySelectorAll('.delete-card-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                if (btn.disabled) return;
                const groupName = btn.getAttribute('data-group');
                const index = parseInt(btn.getAttribute('data-index'));
                userGroups[groupName].splice(index, 1);
                saveCardData();
                renderGroups();
            };
        });
        
        document.querySelectorAll('.add-card-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const groupName = btn.getAttribute('data-group');
                const input = btn.parentElement.querySelector('.new-card-input');
                const text = input.value.trim();
                if (text) {
                    if (!userGroups[groupName]) userGroups[groupName] = [];
                    userGroups[groupName].push({ replys: [text] });
                    saveCardData();
                    renderGroups();
                    input.value = '';
                }
            };
        });
    }
    
    function updateReplyCountDisplay() {
        const span = document.getElementById('totalReplyCount');
        if (span) {
            let total = 0;
            for (let g in userGroups) total += userGroups[g].length;
            span.innerText = total;
        }
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
    
    function getAllReplies() {
        let all = [];
        for (let g in userGroups) {
            if (g === systemGroupName && !systemCardsEnabled) continue;
            for (let card of userGroups[g]) {
                all.push(card.replys ? card.replys[0] : card);
            }
        }
        return all;
    }
    
    window.CatChat.card = {
        userGroups: userGroups,
        saveCardData: saveCardData,
        loadCardData: loadCardData,
        renderGroups: renderGroups,
        getAllReplies: getAllReplies,
        systemCardsEnabled: () => systemCardsEnabled
    };
    
    window.userGroups = userGroups;
    window.saveGroups = saveCardData;
    window.loadGroups = loadCardData;
    window.renderGroups = renderGroups;
    window.getAllReplies = getAllReplies;
    window.updateReplyCountDisplay = updateReplyCountDisplay;
    
    loadCardData();
    
    console.log('✅ card 模块已加载');
})();
