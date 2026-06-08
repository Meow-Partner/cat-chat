// ========== modules/leisure.js · 2026-06-09 01:50:00 ==========
(function() {
    if (window.CatChat && window.CatChat.leisure) return;
    window.CatChat = window.CatChat || {};
    
    let leisureData = {};
    const leisureTypes = ['movie', 'book', 'food', 'music'];
    
    const defaultLeisureData = {
        movie: { myItems: [], hisItems: ['流浪地球', '你的名字。'] },
        book: { myItems: [], hisItems: ['不存在的骑士', '小王子'] },
        food: { myItems: [], hisItems: ['火锅', '烤肉'] },
        music: { myItems: [], hisItems: ['周杰伦', '告五人'] }
    };
    
    function save() {
        localStorage.setItem('leisure_data', JSON.stringify(leisureData));
    }
    
    function load() {
        const stored = localStorage.getItem('leisure_data');
        if (stored) {
            try { leisureData = JSON.parse(stored); } catch(e) {}
        }
        for (let t of leisureTypes) {
            if (!leisureData[t]) leisureData[t] = defaultLeisureData[t];
        }
        render();
    }
    
    function render() {
        const container = document.getElementById('leisureContainer');
        if (!container) return;
        
        let html = '<div class="leisure-page">';
        const typeNames = { movie:'🎬 电影', book:'📚 书籍', food:'🍜 美食', music:'🎵 音乐' };
        
        for (let t of leisureTypes) {
            const data = leisureData[t];
            html += `
                <div class="leisure-category">
                    <div class="category-header"><span>${typeNames[t]}</span><span>▼</span></div>
                    <div class="category-content" style="display:none">
                        <div><strong>⭐ 他的收藏</strong>：${data.hisItems.map(i => `<span class="tag">${i}</span>`).join('')}</div>
                        <div><strong>🐱 我的收藏</strong>：${data.myItems.map(i => `<span class="tag">${i}</span>`).join('')}</div>
                        <input type="text" class="add-input" placeholder="添加我的收藏"><button class="add-btn">添加</button>
                        <button class="invite-btn">邀请一起</button>
                    </div>
                </div>
            `;
        }
        html += '</div>';
        container.innerHTML = html;
        
        // 绑定事件
        document.querySelectorAll('.category-header').forEach(header => {
            header.onclick = () => {
                const content = header.parentElement.querySelector('.category-content');
                const isHidden = content.style.display === 'none';
                content.style.display = isHidden ? 'block' : 'none';
                const arrow = header.querySelector('span:last-child');
                if (arrow) arrow.textContent = isHidden ? '▲' : '▼';
            };
        });
        
        document.querySelectorAll('.add-btn').forEach(btn => {
            btn.onclick = (e) => {
                const input = e.target.parentElement.querySelector('.add-input');
                const val = input.value.trim();
                if (!val) return;
                let type = null;
                const parentHtml = e.target.parentElement.parentElement.innerHTML;
                if (parentHtml.includes('🎬 电影')) type = 'movie';
                else if (parentHtml.includes('📚 书籍')) type = 'book';
                else if (parentHtml.includes('🍜 美食')) type = 'food';
                else if (parentHtml.includes('🎵 音乐')) type = 'music';
                if (type) {
                    leisureData[type].myItems.push(val);
                    save();
                    render();
                }
            };
        });
        
        document.querySelectorAll('.invite-btn').forEach(btn => {
            btn.onclick = () => {
                alert('邀请功能开发中');
            };
        });
    }
    
    window.CatChat.leisure = { load, render, save };
    window.leisureData = leisureData;
    window.saveLeisureData = save;
    window.loadLeisureData = load;
    window.renderLeisurePage = render;
    
    load();
    console.log('✅ leisure 模块已加载');
})();
