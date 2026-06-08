// ========== modules/card.js · 2026-06-09 ==========
(function() {
    if (window.CatChat && window.CatChat.card) return;
    window.CatChat = window.CatChat || {};
    
    let userGroups = {};
    let systemCardsEnabled = true;
    const systemGroupName = '系统字卡';
    
    function save() { localStorage.setItem('userGroups', JSON.stringify(userGroups)); localStorage.setItem('systemCardsEnabled', systemCardsEnabled); updateCount(); }
    function load() {
        let g = localStorage.getItem('userGroups');
        if (g) { try { userGroups = JSON.parse(g); } catch(e) {} }
        let e = localStorage.getItem('systemCardsEnabled');
        if (e !== null) systemCardsEnabled = e === 'true';
        if (!userGroups[systemGroupName]) {
            userGroups[systemGroupName] = [];
            if (typeof DEFAULT_CARDS_LIST !== 'undefined') {
                for (let c of DEFAULT_CARDS_LIST.slice(0, 10)) userGroups[systemGroupName].push({ replys: [c] });
            }
        }
        render();
    }
    function render() {
        let c = document.getElementById('groupsContainer');
        if (!c) return;
        let html = '';
        for (let g in userGroups) {
            let isSystem = (g === systemGroupName);
            html += `<div class="card-group">
                <div class="group-header"><span>📁 ${g} (${userGroups[g].length})</span>
                ${isSystem ? `<label><input type="checkbox" class="sys-toggle" ${systemCardsEnabled ? 'checked' : ''}>启用</label>` : `<button class="del-group">🗑️</button>`}
                </div>
                <div class="group-content" style="display:none">
                    ${userGroups[g].map((card, idx) => `<div class="word-card">${escapeHtml(card.replys ? card.replys[0] : card)}<button class="del-card" data-g="${g}" data-i="${idx}">删除</button></div>`).join('')}
                    <div><input type="text" class="new-card" placeholder="新字卡"><button class="add-card">添加</button></div>
                </div>
            </div>`;
        }
        c.innerHTML = html;
        
        document.querySelectorAll('.group-header').forEach(h => {
            h.onclick = (e) => { if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') { let p = h.parentElement.querySelector('.group-content'); p.style.display = p.style.display === 'none' ? 'block' : 'none'; } };
            let timer;
            h.onmousedown = () => { timer = setTimeout(() => { alert('编辑功能开发中'); }, 500); };
            h.onmouseup = () => { clearTimeout(timer); };
            h.onmouseleave = () => { clearTimeout(timer); };
        });
        document.querySelectorAll('.del-group').forEach(btn => {
            btn.onclick = (e) => { e.stopPropagation(); let g = btn.parentElement.parentElement.querySelector('.group-header span').innerText.replace('📁 ', '').split(' ')[0]; if (g !== systemGroupName) { delete userGroups[g]; save(); render(); } else { alert('系统字卡不可删除'); } };
        });
        document.querySelectorAll('.del-card').forEach(btn => {
            btn.onclick = (e) => { e.stopPropagation(); let g = btn.getAttribute('data-g'); let i = parseInt(btn.getAttribute('data-i')); userGroups[g].splice(i, 1); save(); render(); };
        });
        document.querySelectorAll('.add-card').forEach(btn => {
            btn.onclick = (e) => { e.stopPropagation(); let input = btn.parentElement.querySelector('.new-card'); let txt = input.value.trim(); if (txt) { let g = btn.parentElement.parentElement.parentElement.querySelector('.group-header span').innerText.replace('📁 ', '').split(' ')[0]; userGroups[g].push({ replys: [txt] }); save(); render(); } };
        });
        document.querySelectorAll('.sys-toggle').forEach(t => {
            t.onclick = (e) => { e.stopPropagation(); systemCardsEnabled = t.checked; save(); };
        });
    }
    function updateCount() { let s = document.getElementById('totalReplyCount'); if (s) { let t = 0; for (let g in userGroups) t += userGroups[g].length; s.innerText = t; } }
    function escapeHtml(str) { return str.replace(/[&<>]/g, function(m) { if (m === '&') return '&amp;'; if (m === '<') return '&lt;'; if (m === '>') return '&gt;'; return m; }); }
    function getAllReplies() { let all = []; for (let g in userGroups) { if (g === systemGroupName && !systemCardsEnabled) continue; for (let c of userGroups[g]) all.push(c.replys ? c.replys[0] : c); } return all; }
    
    window.CatChat.card = { save, load, render, getAllReplies };
    window.userGroups = userGroups;
    window.saveGroups = save;
    window.loadGroups = load;
    window.renderGroups = render;
    window.getAllReplies = getAllReplies;
    window.updateReplyCountDisplay = updateCount;
    load();
    console.log('✅ card 模块已加载');
})();
