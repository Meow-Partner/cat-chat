// ========== modules/leisure.js · 2026-06-09 ==========
(function() {
    if (window.CatChat && window.CatChat.leisure) return;
    window.CatChat = window.CatChat || {};
    
    let leisureData = {};
    const leisureTypes = ['movie', 'book', 'food', 'music'];
    
    const defaultLeisureData = {
        movie: { myItems: [], hisItems: ['流浪地球', '你的名字。'] },
        book: { myItems: [], hisItems: ['不存在的骑士', '小王子'] },
        food: { myItems: [], hisItems: ['火锅', '番茄炒蛋'] },
        music: { myItems: [], hisItems: ['周杰伦', '告五人'] }
    };
    
    function save() { localStorage.setItem('leisure_data', JSON.stringify(leisureData)); }
    function load() {
        const stored = localStorage.getItem('leisure_data');
        if (stored) { try { leisureData = JSON.parse(stored); } catch(e) {} }
        for (let t of leisureTypes) { if (!leisureData[t]) leisureData[t] = defaultLeisureData[t]; }
        render();
    }
    function render() {
        const c = document.getElementById('leisureContainer');
        if (!c) return;
        let html = '<div class="leisure-page">';
        const names = { movie:'🎬电影', book:'📚书籍', food:'🍜美食', music:'🎵音乐' };
        for (let t of leisureTypes) {
            let d = leisureData[t];
            html += `<div class="leisure-category">
                <div class="category-header"><span>${names[t]}</span><span>▼</span></div>
                <div class="category-content" style="display:none">
                    <div><strong>⭐他的</strong>：${d.hisItems.map(i=>`<span class="tag">${i}</span>`).join('')}</div>
                    <div><strong>🐱我的</strong>：${d.myItems.map(i=>`<span class="tag">${i}</span>`).join('')}</div>
                    <input type="text" class="add-input" placeholder="添加我的收藏"><button class="add-btn">添加</button>
                    <button class="invite-btn">邀请一起</button>
                </div>
            </div>`;
        }
        html += '</div>';
        c.innerHTML = html;
        
        document.querySelectorAll('.category-header').forEach(h => {
            h.onclick = () => { let p = h.parentElement.querySelector('.category-content'); p.style.display = p.style.display === 'none' ? 'block' : 'none'; };
        });
        document.querySelectorAll('.add-btn').forEach(btn => {
            btn.onclick = (e) => {
                let input = e.target.parentElement.querySelector('.add-input');
                let val = input.value.trim();
                if (!val) return;
                let cat = e.target.parentElement.parentElement;
                let type = null;
                for (let t of leisureTypes) if (cat.innerHTML.includes(names[t])) type = t;
                if (type) { leisureData[type].myItems.push(val); save(); render(); }
            };
        });
        document.querySelectorAll('.invite-btn').forEach(btn => {
            btn.onclick = () => alert('邀请功能开发中');
        });
    }
    
    window.CatChat.leisure = { load, render };
    window.loadLeisureData = load;
    window.renderLeisurePage = render;
    load();
    console.log('✅ leisure 模块已加载');
})();
